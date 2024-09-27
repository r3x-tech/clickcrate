pub mod state;
use anchor_lang::prelude::*;

declare_id!("5PJAUEMFVHKn29byHzAqbFerH71h1g9XQLui3ToYoAow");

#[program]
pub mod clickcrate_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
