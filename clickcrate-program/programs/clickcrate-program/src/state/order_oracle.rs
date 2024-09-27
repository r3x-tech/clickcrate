use super::{
    enums::{OracleValidation, OrderStatus, Origin},
    ExternalValidationResult,
};
use anchor_lang::prelude::*;

#[account]
pub struct OrderOracle {
    pub order_status: OrderStatus,
    pub order_manager: Origin,
    pub validation: OracleValidation,
    pub bump: u8,
}

impl OrderOracle {
    pub const MAX_SIZE: usize = 8 + 1 + 1 + 5 + 1;

    pub fn initialize(&mut self, order_manager: Origin, bump: u8) -> Result<()> {
        self.order_status = OrderStatus::Placed;
        self.order_manager = order_manager;
        self.validation = OracleValidation::V1 {
            create: ExternalValidationResult::Pass,
            transfer: ExternalValidationResult::Rejected,
            burn: ExternalValidationResult::Pass,
            update: ExternalValidationResult::Pass,
        };
        self.bump = bump;
        Ok(())
    }
}
