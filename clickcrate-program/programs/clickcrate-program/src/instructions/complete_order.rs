use crate::errors::ClickCrateErrors;
use crate::state::{OrderOracle, ProductListingState, VaultAccount};
use crate::OrderStatus;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction};
use mpl_core::Asset;

#[derive(Accounts)]
#[instruction(product_listing_id: Pubkey)]
pub struct CompleteOrder<'info> {
    #[account(
    mut,
    seeds = [b"listing".as_ref(), product_listing_id.key().as_ref()],
    bump,
    )]
    pub product_listing: Account<'info, ProductListingState>,
    #[account(
      mut,
      seeds = [b"vault".as_ref(), product_listing_id.as_ref()],
      bump,
    )]
    pub vault: Account<'info, VaultAccount>,
    #[account(
        mut,
        seeds = [b"oracle".as_ref(), product.key().as_ref()],
        bump = oracle.bump,
    )]
    pub oracle: Account<'info, OrderOracle>,
    /// CHECK: This is the seller's wallet
    #[account(mut, constraint = seller.key() == product_listing.owner)]
    pub seller: Signer<'info>,
    /// CHECK: This is a Metaplex Core NFT
    #[account(mut)]
    pub product: UncheckedAccount<'info>,
    #[account(constraint = authority.key() == product_listing.owner)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn complete_order(ctx: Context<CompleteOrder>, _product_listing_id: Pubkey) -> Result<()> {
    let product = Asset::deserialize(&mut &ctx.accounts.product.data.borrow()[..])?;

    require!(
        product.base.owner.key() == ctx.accounts.seller.key(),
        ClickCrateErrors::UnauthorizedUpdate
    );

    require!(
        ctx.accounts.oracle.order_status == OrderStatus::Completed,
        ClickCrateErrors::OrderNotCompleted
    );

    let amount = ctx.accounts.product_listing.price;

    require!(
        **ctx.accounts.vault.to_account_info().lamports.borrow() >= amount.unwrap(),
        ClickCrateErrors::InsufficientBalance
    );

    invoke(
        &system_instruction::transfer(
            &ctx.accounts.vault.key(),
            &ctx.accounts.seller.key(),
            amount.unwrap(),
        ),
        &[
            ctx.accounts.vault.to_account_info(),
            ctx.accounts.seller.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;

    Ok(())
}
