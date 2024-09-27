use super::enums::{PlacementType, ProductCategory};
use anchor_lang::prelude::*;

#[account]
pub struct ClickCrateState {
    pub id: Pubkey,
    pub owner: Pubkey,
    pub manager: Pubkey,
    pub eligible_placement_type: PlacementType,
    pub eligible_product_category: ProductCategory,
    pub product: Option<Pubkey>,
    pub is_active: bool,
}

impl ClickCrateState {
    pub const MAX_SIZE: usize = 8 + 32 + 32 + 32 + 1 + 1 + (1 + 32) + 1;
}
