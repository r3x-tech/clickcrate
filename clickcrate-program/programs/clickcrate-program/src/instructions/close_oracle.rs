use crate::error::ClickCrateErrors;
use crate::state::{OrderOracle, ProductListingState};
use anchor_lang::prelude::*;
use mpl_core::Asset;

#[derive(Accounts)]
#[instruction(product_listing_id: Pubkey, product_id: Pubkey)]
pub struct CloseOracle<'info> {
    #[account(
        mut,
        seeds = [b"listing".as_ref(), product_listing_id.key().as_ref()],
        bump,
    )]
    pub product_listing: Account<'info, ProductListingState>,
    #[account(
        mut,
        close = owner,
        seeds = [b"oracle", product_id.key().as_ref()],
        bump,
    )]
    pub oracle: Account<'info, OrderOracle>,
    /// CHECK: This is a Metaplex Core NFT
    #[account(mut)]
    pub product: UncheckedAccount<'info>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn close_oracle(
    ctx: Context<CloseOracle>,
    _product_listing_id: Pubkey,
    _product_id: Pubkey,
) -> Result<()> {
    let product_listing: &mut Account<ProductListingState> = &mut ctx.accounts.product_listing;
    let product_account = &mut ctx.accounts.product;
    let product_data = product_account.try_borrow_data()?;
    require!(
        Asset::deserialize(&mut &product_data[..]).is_ok(),
        ClickCrateErrors::InvalidProductAccount
    );
    let deserialized_asset = Asset::deserialize(&mut &product_data[..]).unwrap();
    require!(
        ctx.accounts.owner.key() == product_listing.owner.key()
            && deserialized_asset.base.owner.key() == product_listing.owner.key(),
        ClickCrateErrors::UnauthorizedClose
    );

    Ok(())
}
