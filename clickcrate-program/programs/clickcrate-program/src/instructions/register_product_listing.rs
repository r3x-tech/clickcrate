use crate::state::{Origin, PlacementType, ProductCategory, ProductListingState};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(id: Pubkey, origin: Origin, placement_type: PlacementType, product_category: ProductCategory, manager: Pubkey, order_manager: Origin)]
pub struct RegisterProductListing<'info> {
    #[account(
        init,
        seeds = [b"listing".as_ref(), id.key().as_ref()],
        bump,
        payer = owner,
        space = 8 + ProductListingState::MAX_SIZE,
    )]
    pub product_listing: Account<'info, ProductListingState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn register_product_listing(
    ctx: Context<RegisterProductListing>,
    id: Pubkey,
    origin: Origin,
    placement_type: PlacementType,
    product_category: ProductCategory,
    manager: Pubkey,
    order_manager: Origin,
) -> Result<()> {
    let product_listing = &mut ctx.accounts.product_listing;
    product_listing.id = id;
    product_listing.origin = origin.clone();
    product_listing.owner = ctx.accounts.owner.key();
    product_listing.manager = manager;
    product_listing.placement_type = placement_type;
    product_listing.product_category = product_category;
    product_listing.in_stock = 0;
    product_listing.sold = 0;
    product_listing.is_active = false;
    product_listing.order_manager = order_manager.clone();
    Ok(())
}
