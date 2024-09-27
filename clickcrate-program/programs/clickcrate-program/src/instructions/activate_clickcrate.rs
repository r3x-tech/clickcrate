use crate::state::ClickCrateState;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct ActivateClickCrate<'info> {
    #[account(
        mut,
        seeds = [b"clickcrate".as_ref(), clickcrate.id.as_ref()],
        bump,
        has_one = owner
    )]
    pub clickcrate: Account<'info, ClickCrateState>,
    pub owner: Signer<'info>,
}

pub fn activate_clickcrate(ctx: Context<ActivateClickCrate>) -> Result<()> {
    let clickcrate = &mut ctx.accounts.clickcrate;
    clickcrate.is_active = true;
    Ok(())
}
