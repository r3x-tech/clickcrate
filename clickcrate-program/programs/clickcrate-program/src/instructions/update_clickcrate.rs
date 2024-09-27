use crate::state::{ClickCrateState, PlacementType, ProductCategory};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(id: Pubkey, eligible_placement_type: PlacementType, eligible_product_category: ProductCategory, manager: Pubkey)]
pub struct UpdateClickCrate<'info> {
    #[account(
        mut,
        seeds = [b"clickcrate".as_ref(), id.key().as_ref()],
        bump,
        realloc = 8 + ClickCrateState::MAX_SIZE,
        realloc::payer = owner,
        realloc::zero = true,
    )]
    pub clickcrate: Account<'info, ClickCrateState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn update_clickcrate(
    ctx: Context<UpdateClickCrate>,
    id: Pubkey,
    eligible_placement_type: PlacementType,
    eligible_product_category: ProductCategory,
    manager: Pubkey,
) -> Result<()> {
    let clickcrate = &mut ctx.accounts.clickcrate;
    clickcrate.id = id;
    clickcrate.eligible_placement_type = eligible_placement_type;
    clickcrate.eligible_product_category = eligible_product_category;
    clickcrate.manager = manager;
    Ok(())
}
