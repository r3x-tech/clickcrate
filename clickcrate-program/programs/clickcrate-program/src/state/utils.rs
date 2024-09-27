use anchor_lang::prelude::*;
use mpl_core::programs::MPL_CORE_ID;

pub trait MaxSize {
    const MAX_SIZE: usize;
}

pub struct Core;

impl anchor_lang::Id for Core {
    fn id() -> Pubkey {
        MPL_CORE_ID
    }
}
