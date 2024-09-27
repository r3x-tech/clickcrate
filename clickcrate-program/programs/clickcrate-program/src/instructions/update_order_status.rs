use crate::error::ClickCrateErrors;
use crate::state::{
    ExternalValidationResult, OracleValidation, OrderOracle, OrderStatus, ProductListingState,
};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(product_id: Pubkey, product_listing_id: Pubkey, new_order_status: OrderStatus)]
pub struct UpdateOrderStatus<'info> {
    #[account(
      mut,
      has_one = owner,
      seeds = [b"listing".as_ref(), product_listing_id.key().as_ref()],
      bump,
    )]
    pub product_listing: Account<'info, ProductListingState>,
    #[account(
      mut,
      seeds = [b"oracle".as_ref(), product_id.key().as_ref()],
      bump = oracle.bump,
     )]
    pub oracle: Account<'info, OrderOracle>,
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)]
    pub seller: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn update_order_status(
    ctx: Context<UpdateOrderStatus>,
    _product_id: Pubkey,
    _product_listing_id: Pubkey,
    new_order_status: OrderStatus,
) -> Result<()> {
    let oracle = &mut ctx.accounts.oracle;

    require!(
        ctx.accounts.seller.key() == ctx.accounts.product_listing.owner
            || ctx.accounts.seller.key() == ctx.accounts.product_listing.manager,
        ClickCrateErrors::UnauthorizedUpdate
    );

    oracle.order_status = new_order_status.clone();
    oracle.validation = match new_order_status {
        OrderStatus::Pending => OracleValidation::V1 {
            create: ExternalValidationResult::Pass,
            transfer: ExternalValidationResult::Rejected,
            burn: ExternalValidationResult::Pass,
            update: ExternalValidationResult::Pass,
        },
        OrderStatus::Placed
        | OrderStatus::Confirmed
        | OrderStatus::Fulfilled
        | OrderStatus::Delivered => OracleValidation::V1 {
            create: ExternalValidationResult::Rejected,
            transfer: ExternalValidationResult::Rejected,
            burn: ExternalValidationResult::Rejected,
            update: ExternalValidationResult::Pass,
        },
        OrderStatus::Cancelled | OrderStatus::Completed => OracleValidation::V1 {
            create: ExternalValidationResult::Approved,
            transfer: ExternalValidationResult::Approved,
            burn: ExternalValidationResult::Rejected,
            update: ExternalValidationResult::Pass,
        },
    };
    Ok(())
}
