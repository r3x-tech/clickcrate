use anchor_lang::prelude::*;

#[account]
pub struct VaultAccount {
    pub bump: u8,
}

impl VaultAccount {
    pub const MAX_SIZE: usize = 8 + 1;
}
