use crate::state::{ClickCrateState, PlacementType, ProductCategory};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(id: Pubkey, eligible_placement_type: PlacementType, eligible_product_category: ProductCategory, manager: Pubkey)]
pub struct RegisterClickCrate<'info> {
    #[account(
        init,
        seeds = [b"clickcrate".as_ref(), id.key().as_ref()],
        bump,
        payer = owner,
        space = 8 + ClickCrateState::MAX_SIZE,
    )]
    pub clickcrate: Account<'info, ClickCrateState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn register_clickcrate(
    ctx: Context<RegisterClickCrate>,
    id: Pubkey,
    eligible_placement_type: PlacementType,
    eligible_product_category: ProductCategory,
    manager: Pubkey,
) -> Result<()> {
    msg!("ClickCrate Registration in progress");
    let clickcrate = &mut ctx.accounts.clickcrate;
    clickcrate.id = id;
    clickcrate.owner = ctx.accounts.owner.key();
    clickcrate.manager = manager;
    clickcrate.eligible_placement_type = eligible_placement_type;
    clickcrate.eligible_product_category = eligible_product_category;
    clickcrate.product = None;
    clickcrate.is_active = false;
    msg!("ClickCrate Registered");
    Ok(())
}
