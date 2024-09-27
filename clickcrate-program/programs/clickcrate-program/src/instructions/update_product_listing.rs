use crate::state::{PlacementType, ProductCategory, ProductListingState};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(id: Pubkey, placement_type: PlacementType, product_category: ProductCategory, manager: Pubkey, price: u64)]
pub struct UpdateProductListing<'info> {
    #[account(
        mut,
        seeds = [b"listing".as_ref(), id.key().as_ref()],
        bump,
        realloc = 8 + ProductListingState::MAX_SIZE,
        realloc::payer = owner,
        realloc::zero = true,
    )]
    pub product_listing: Account<'info, ProductListingState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn update_product_listing(
    ctx: Context<UpdateProductListing>,
    _id: Pubkey,
    placement_type: PlacementType,
    product_category: ProductCategory,
    manager: Pubkey,
    price: u64,
) -> Result<()> {
    let product_listing = &mut ctx.accounts.product_listing;
    product_listing.placement_type = placement_type;
    product_listing.product_category = product_category;
    product_listing.price = Some(price);
    product_listing.manager = manager;
    Ok(())
}
