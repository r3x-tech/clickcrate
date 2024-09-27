use crate::error::ClickCrateErrors;
use crate::state::{
    ClickCrateState, ExternalValidationResult, OracleValidation, OrderOracle, OrderStatus,
    ProductListingState, VaultAccount,
};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction};
use mpl_core::{Asset, Attribute, Attributes, Collection, Plugin};

#[derive(Accounts)]
#[instruction(product_listing_id: Pubkey, clickcrate_id: Pubkey, product_id: Pubkey, quantity: u64)]
pub struct MakePurchase<'info> {
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
      seeds = [b"oracle", product_id.key().as_ref()],
      bump = oracle.bump,
     )]
    pub oracle: Account<'info, OrderOracle>,
    #[account(
      mut,
      seeds = [b"vault".as_ref(), product_listing_id.as_ref()],
      bump,
    )]
    pub vault: Account<'info, VaultAccount>,
    /// CHECK: This is the Metaplex core collection account
    #[account(mut)]
    pub listing_collection: UncheckedAccount<'info>,
    /// CHECK: This is a Metaplex Core NFT
    #[account(mut)]
    pub product_account: UncheckedAccount<'info>,
    #[account(mut, constraint = owner.key() == product_listing.owner)]
    pub owner: Signer<'info>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    pub core_program: Program<'info, Core>,
    pub system_program: Program<'info, System>,
}

pub fn make_purchase(
    ctx: Context<MakePurchase>,
    _product_listing_id: Pubkey,
    _clickcrate_id: Pubkey,
    product_id: Pubkey,
    quantity: u64,
) -> Result<()> {
    let clickcrate = &mut ctx.accounts.clickcrate;
    let product_listing = &mut ctx.accounts.product_listing;
    let oracle = &mut ctx.accounts.oracle;
    let product = &ctx.accounts.product_account;

    require!(
        clickcrate.product == Some(product_listing.id),
        ClickCrateErrors::ProductNotFound
    );

    require!(
        product.key() == product_id,
        ClickCrateErrors::ProductNotFound
    );

    require!(
        oracle.order_status == OrderStatus::Placed,
        ClickCrateErrors::ProductNotPlaced
    );

    require!(
        product_listing.in_stock >= quantity,
        ClickCrateErrors::ProductOutOfStock
    );

    require!(
        product_listing.price.is_some(),
        ClickCrateErrors::PriceNotFound
    );

    let amount = product_listing.price.unwrap() * quantity;
    let user_lamports = ctx.accounts.buyer.lamports();

    if user_lamports >= amount {
        invoke(
            &system_instruction::transfer(
                ctx.accounts.buyer.key,
                &ctx.accounts.vault.key(),
                amount,
            ),
            &[
                ctx.accounts.buyer.to_account_info(),
                ctx.accounts.vault.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;
    }
    msg!("Payment received");

    product_listing.in_stock -= quantity;
    product_listing.sold += quantity;
    msg!("Updated listing");

    require!(
        oracle.validation
            == OracleValidation::V1 {
                create: ExternalValidationResult::Pass,
                transfer: ExternalValidationResult::Rejected,
                burn: ExternalValidationResult::Pass,
                update: ExternalValidationResult::Pass,
            },
        ClickCrateErrors::OracleAlreadyUpdated
    );

    oracle.order_status = OrderStatus::Pending;
    oracle.validation = OracleValidation::V1 {
        create: ExternalValidationResult::Pass,
        transfer: ExternalValidationResult::Rejected,
        burn: ExternalValidationResult::Pass,
        update: ExternalValidationResult::Rejected,
    };
    msg!("Updated order oracle");

    UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
        .asset(product)
        .collection(Some(&ctx.accounts.listing_collection.to_account_info()))
        .payer(&ctx.accounts.buyer.to_account_info())
        .authority(Some(&ctx.accounts.owner.to_account_info()))
        .system_program(&ctx.accounts.system_program.to_account_info())
        .plugin(Plugin::Attributes(Attributes {
            attribute_list: vec![Attribute {
                key: "Order Status".to_string(),
                value: "Confirmed".to_string(),
            }],
        }))
        .invoke()?;
    msg!("Updated order status");

    Ok(())
}
