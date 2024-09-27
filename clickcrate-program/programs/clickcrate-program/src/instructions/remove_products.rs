use crate::errors::ClickCrateErrors;
use crate::state::{ClickCrateState, OrderOracle, OrderStatus, ProductListingState, VaultAccount};
use crate::Core;
use anchor_lang::prelude::*;
use mpl_core::{
    instructions::{
        RemoveExternalPluginAdapterV1CpiBuilder, RemovePluginV1CpiBuilder, UpdatePluginV1CpiBuilder,
    },
    types::{ExternalPluginAdapterKey, FreezeDelegate, Plugin, PluginType},
    Asset, Collection,
};

#[derive(Accounts)]
#[instruction(product_listing_id: Pubkey, clickcrate_id: Pubkey)]
pub struct RemoveProducts<'info> {
    #[account(
        mut,
        has_one = owner,
        seeds = [b"clickcrate".as_ref(), clickcrate_id.key().as_ref()],
        bump,
    )]
    pub clickcrate: Account<'info, ClickCrateState>,
    #[account(
        mut,
        has_one = owner,
        seeds = [b"listing".as_ref(), product_listing_id.key().as_ref()],
        bump,
    )]
    pub product_listing: Account<'info, ProductListingState>,
    #[account(
        mut,
        seeds = [b"vault".as_ref(), product_listing_id.key().as_ref()],
        bump,
        close = owner
    )]
    pub vault: Account<'info, VaultAccount>,
    /// CHECK: This is the Metaplex core collection account
    #[account(mut)]
    pub listing_collection: UncheckedAccount<'info>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub core_program: Program<'info, Core>,
    pub system_program: Program<'info, System>,
}

pub fn remove_products<'a, 'b, 'c: 'info, 'info>(
    ctx: Context<'a, 'b, 'c, 'info, RemoveProducts<'info>>,
    _product_listing_id: Pubkey,
    _clickcrate_id: Pubkey,
) -> Result<()> {
    let product_listing = &mut ctx.accounts.product_listing;
    let clickcrate = &mut ctx.accounts.clickcrate;
    let vault = &ctx.accounts.vault;
    let listing_collection = &ctx.accounts.listing_collection;
    let product_accounts = ctx.remaining_accounts;

    require!(
        product_listing.is_active,
        ClickCrateErrors::ProductListingDeactivated
    );
    require!(
        clickcrate.is_active,
        ClickCrateErrors::ClickCrateDeactivated
    );
    require!(
        product_listing.vault.is_some() && vault.key() == product_listing.vault.unwrap(),
        ClickCrateErrors::InvalidVaultAccount
    );

    let collection_data = listing_collection.try_borrow_data()?;
    let collection_account = Collection::deserialize(&mut &collection_data[..])?;
    let total_minted = collection_account.base.num_minted;

    require!(
        product_accounts.len() as u32 == total_minted && (1..=20).contains(&product_accounts.len()),
        ClickCrateErrors::InvalidRemovalRequest
    );

    let core_program_info = &ctx.accounts.core_program;
    let owner_info = &ctx.accounts.owner;
    let system_program_info = &ctx.accounts.system_program;

    // Check order status for all products
    for product_account in product_accounts.iter() {
        let product_data = product_account.try_borrow_data()?;
        let deserialized_product = Asset::deserialize(&mut &product_data[..])
            .map_err(|_| ClickCrateErrors::InvalidProductAccount)?;

        let oracle = deserialized_product
            .external_plugin_adapter_list
            .oracles
            .first()
            .ok_or(ClickCrateErrors::OracleNotFound)?;

        let oracle_account_info = ctx
            .remaining_accounts
            .iter()
            .find(|a| *a.key == oracle.base_address)
            .ok_or(ClickCrateErrors::OracleNotFound)?;

        let oracle_data = oracle_account_info.try_borrow_data()?;
        let oracle_state = OrderOracle::try_deserialize(&mut &oracle_data[..])?;

        match oracle_state.order_status {
            OrderStatus::Pending | OrderStatus::Completed | OrderStatus::Cancelled => {}
            _ => return Err(ClickCrateErrors::OrdersInProgress.into()),
        }
    }

    // Remove plugins and update product listing
    for product_account in product_accounts.iter() {
        remove_product_plugins(
            product_listing,
            product_account,
            core_program_info,
            listing_collection,
            owner_info,
            system_program_info,
            ctx.bumps.product_listing,
        )?;
        product_listing.in_stock -= 1;
    }

    // Transfer vault funds to owner
    let vault_balance = vault.to_account_info().lamports();
    if vault_balance > Rent::get()?.minimum_balance(VaultAccount::MAX_SIZE) {
        let amount_to_transfer =
            vault_balance - Rent::get()?.minimum_balance(VaultAccount::MAX_SIZE);
        **vault.to_account_info().try_borrow_mut_lamports()? -= amount_to_transfer;
        **owner_info.try_borrow_mut_lamports()? += amount_to_transfer;
    }

    // Clear the ClickCrate and ProductListing association
    clickcrate.product = None;
    product_listing.clickcrate_pos = None;

    Ok(())
}

fn remove_product_plugins<'info>(
    product_listing: &Account<'info, ProductListingState>,
    product_account: &AccountInfo<'info>,
    core_program: &Program<'info, Core>,
    listing_collection: &AccountInfo<'info>,
    owner: &Signer<'info>,
    system_program: &Program<'info, System>,
    bump: u8,
) -> Result<()> {
    let product_data = product_account.try_borrow_data()?;
    let deserialized_product = Asset::deserialize(&mut &product_data[..])
        .map_err(|_| ClickCrateErrors::InvalidProductAccount)?;

    // Unfreeze the Asset
    UpdatePluginV1CpiBuilder::new(core_program)
        .asset(product_account)
        .collection(Some(listing_collection))
        .payer(owner)
        .authority(Some(&product_listing.to_account_info()))
        .system_program(system_program)
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
        .invoke_signed(&[&[b"listing", product_listing.id.as_ref(), &[bump]]])?;

    // Remove the FreezeDelegate and TransferDelegate Plugins
    for plugin_type in [PluginType::FreezeDelegate, PluginType::TransferDelegate] {
        RemovePluginV1CpiBuilder::new(core_program)
            .asset(product_account)
            .collection(Some(listing_collection))
            .payer(owner)
            .authority(Some(owner))
            .system_program(system_program)
            .plugin_type(plugin_type)
            .invoke()?;
    }

    // Remove the Oracle Plugin
    let oracle = deserialized_product
        .external_plugin_adapter_list
        .oracles
        .first()
        .ok_or(ClickCrateErrors::OracleNotFound)?;

    RemoveExternalPluginAdapterV1CpiBuilder::new(core_program)
        .asset(product_account)
        .collection(Some(listing_collection))
        .payer(owner)
        .authority(Some(owner))
        .system_program(system_program)
        .key(ExternalPluginAdapterKey::Oracle(oracle.base_address))
        .invoke()?;

    Ok(())
}
