use crate::errors::ClickCrateErrors;
use crate::state::{ClickCrateState, ProductListingState, VaultAccount};
use crate::Core;
use anchor_lang::prelude::*;
use mpl_core::{
    instructions::{AddExternalPluginAdapterV1CpiBuilder, AddPluginV1CpiBuilder},
    types::{
        ExternalCheckResult, ExternalPluginAdapterInitInfo, FreezeDelegate, HookableLifecycleEvent,
        OracleInitInfo, Plugin, PluginAuthority, TransferDelegate, ValidationResultsOffset,
    },
    Collection,
};

#[derive(Accounts)]
#[instruction(product_listing_id: Pubkey, clickcrate_id: Pubkey, price: u64)]
pub struct PlaceProducts<'info> {
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
      init,
      seeds = [b"vault".as_ref(), product_listing_id.key().as_ref()],
      bump,
      payer = owner,
      space = 8 + VaultAccount::MAX_SIZE,
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

pub fn place_products<'a, 'b, 'c: 'info, 'info>(
    ctx: Context<'a, 'b, 'c, 'info, PlaceProducts<'info>>,
    _product_listing_id: Pubkey,
    _clickcrate_id: Pubkey,
    price: u64,
) -> Result<()> {
    let clickcrate: &mut Account<ClickCrateState> = &mut ctx.accounts.clickcrate;
    let product_listing: &mut Account<ProductListingState> = &mut ctx.accounts.product_listing;
    let vault = &ctx.accounts.vault;
    let listing_collection = &ctx.accounts.listing_collection;
    let product_accounts = ctx.remaining_accounts;

    let total_minted = {
        let collection_data = listing_collection.try_borrow_data()?;
        let collection_account = Collection::deserialize(&mut &collection_data[..])?;
        collection_account.base.num_minted
    };

    let core_program_info = ctx.accounts.core_program.to_account_info();
    let collection_info = ctx.accounts.listing_collection.to_account_info();
    let owner_info = ctx.accounts.owner.to_account_info();
    let system_program_info = ctx.accounts.system_program.to_account_info();

    require!(
        product_listing.is_active,
        ClickCrateErrors::ProductListingDeactivated
    );
    require!(
        clickcrate.is_active,
        ClickCrateErrors::ClickCrateDeactivated
    );
    require!(
        product_listing.in_stock == 0
            && product_listing.sold == 0
            && product_accounts.len() as u32 == total_minted
            && product_accounts.len() >= 1
            && product_accounts.len() <= 20,
        ClickCrateErrors::InvalidStockingRequest
    );

    for product_account in product_accounts.iter() {
        AddPluginV1CpiBuilder::new(&core_program_info)
            .asset(product_account)
            .collection(Some(&collection_info))
            .payer(&owner_info)
            .authority(Some(&owner_info))
            .system_program(&system_program_info)
            .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: true }))
            .init_authority(PluginAuthority::Address {
                address: product_listing.key(),
            })
            .invoke()?;

        AddPluginV1CpiBuilder::new(&core_program_info)
            .asset(&product_account)
            .collection(Some(&collection_info))
            .payer(&owner_info)
            .authority(Some(&owner_info))
            .system_program(&system_program_info)
            .plugin(Plugin::TransferDelegate(TransferDelegate {}))
            .init_authority(PluginAuthority::Address {
                address: product_listing.key(),
            })
            .invoke()?;

        let (oracle_pda, _) = Pubkey::find_program_address(
            &[b"oracle", product_account.key().as_ref()],
            ctx.program_id,
        );
        AddExternalPluginAdapterV1CpiBuilder::new(&core_program_info)
            .asset(&product_account)
            .collection(Some(&collection_info))
            .payer(&owner_info)
            .authority(Some(&owner_info))
            .system_program(&system_program_info)
            .init_info(ExternalPluginAdapterInitInfo::Oracle(OracleInitInfo {
                base_address: oracle_pda,
                results_offset: Some(ValidationResultsOffset::Anchor),
                lifecycle_checks: vec![(
                    HookableLifecycleEvent::Transfer,
                    ExternalCheckResult { flags: 4 },
                )],
                base_address_config: None,
                init_plugin_authority: None,
            }))
            .invoke()?;
        product_listing.in_stock += 1;
        msg!("Processed product account: {}", product_account.key());
    }

    product_listing.clickcrate_pos = Some(clickcrate.id);
    product_listing.vault = Some(vault.key());
    product_listing.price = Some(price);
    clickcrate.product = Some(product_listing.id);

    Ok(())
}
