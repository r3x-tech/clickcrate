use crate::state::{
    ExternalValidationResult, OracleValidation, OrderOracle, OrderStatus, ProductListingState,
};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(product_listing_id: Pubkey, product_id: Pubkey)]
pub struct InitializeOracle<'info> {
    #[account(
      mut,
      seeds = [b"listing".as_ref(), product_listing_id.key().as_ref()],
      bump,
    )]
    pub product_listing: Account<'info, ProductListingState>,
    /// CHECK: This is a Metaplex core asset account
    #[account(mut)]
    pub product: UncheckedAccount<'info>,
    #[account(
        init,
        seeds = [b"oracle".as_ref(), product_id.key().as_ref()],
        bump,
        payer = payer,
        space = 8 + OrderOracle::MAX_SIZE,
    )]
    pub oracle: Account<'info, OrderOracle>,
    #[account(
      mut,
      constraint = payer.key() == product_listing.owner
    )]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn initialize_oracle(
    ctx: Context<InitializeOracle>,
    _product_listing_id: Pubkey,
    _product_id: Pubkey,
) -> Result<()> {
    let oracle = &mut ctx.accounts.oracle;
    let product_listing = &ctx.accounts.product_listing;

    oracle.set_inner(OrderOracle {
        order_status: OrderStatus::Placed,
        order_manager: product_listing.order_manager.clone(),
        validation: OracleValidation::V1 {
            create: ExternalValidationResult::Pass,
            transfer: ExternalValidationResult::Rejected,
            burn: ExternalValidationResult::Pass,
            update: ExternalValidationResult::Pass,
        },
        bump: ctx.bumps.oracle,
    });

    Ok(())
}
