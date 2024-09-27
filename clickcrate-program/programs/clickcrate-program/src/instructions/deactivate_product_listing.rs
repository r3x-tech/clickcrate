use crate::state::ProductListingState;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct DeactivateProductListing<'info> {
    #[account(
        mut,
        seeds = [b"listing".as_ref(), product_listing.id.as_ref()],
        bump,
        has_one = owner
    )]
    pub product_listing: Account<'info, ProductListingState>,
    pub owner: Signer<'info>,
}

pub fn deactivate_product_listing(ctx: Context<DeactivateProductListing>) -> Result<()> {
    let product_listing = &mut ctx.accounts.product_listing;
    product_listing.is_active = false;
    Ok(())
}
