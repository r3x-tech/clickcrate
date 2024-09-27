use super::enums::{Origin, PlacementType, ProductCategory};
use anchor_lang::prelude::*;

#[account]
pub struct ProductListingState {
    pub id: Pubkey,
    pub origin: Origin,
    pub owner: Pubkey,
    pub manager: Pubkey,
    pub placement_type: PlacementType,
    pub product_category: ProductCategory,
    pub in_stock: u64,
    pub sold: u64,
    pub clickcrate_pos: Option<Pubkey>,
    pub is_active: bool,
    pub price: Option<u64>,
    pub vault: Option<Pubkey>,
    pub order_manager: Origin,
}

impl ProductListingState {
    pub const MAX_SIZE: usize = 8 + 32 + 1 + 32 + 32 + 1 + 1 + 8 + 8 + (1 + 32) + 1 + 8 + 32 + 1;
}
