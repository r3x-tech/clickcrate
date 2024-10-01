#[cfg(target_os = "solana")]
#[global_allocator]
static ALLOC: smalloc::Smalloc<
    { solana_program::entrypoint::HEAP_START_ADDRESS as usize },
    { solana_program::entrypoint::HEAP_LENGTH as usize },
    16,
    1024,
> = smalloc::Smalloc::new();

// #[cfg(all(feature = "custom-heap", target_arch = "bpf"))]
// #[global_allocator]
// static ALLOC: smalloc::Smalloc<{ solana_program::entrypoint::HEAP_LENGTH as usize }> =
//     smalloc::Smalloc::new();

// #[cfg(feature = "custom-heap")]
// use solana_program::custom_heap_default;

use anchor_lang::prelude::*;

// pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;

// use crate::constants::*;
// use crate::errors::ClickCrateErrors;
use instructions::*;
use state::*;

declare_id!("8haS17iUkRL1aMchExXTcLS5J8iHwupN9gWWRNLD9q3v");

#[program]
pub mod clickcrate_program {
    use super::*;

    pub fn register_clickcrate(
        ctx: Context<RegisterClickCrate>,
        id: Pubkey,
        eligible_placement_type: PlacementType,
        eligible_product_category: ProductCategory,
        manager: Pubkey,
    ) -> Result<()> {
        instructions::register_clickcrate::register_clickcrate(
            ctx,
            id,
            eligible_placement_type,
            eligible_product_category,
            manager,
        )
    }

    pub fn update_clickcrate(
        ctx: Context<UpdateClickCrate>,
        id: Pubkey,
        eligible_placement_type: PlacementType,
        eligible_product_category: ProductCategory,
        manager: Pubkey,
    ) -> Result<()> {
        instructions::update_clickcrate::update_clickcrate(
            ctx,
            id,
            eligible_placement_type,
            eligible_product_category,
            manager,
        )
    }

    pub fn register_product_listing(
        ctx: Context<RegisterProductListing>,
        id: Pubkey,
        origin: Origin,
        placement_type: PlacementType,
        product_category: ProductCategory,
        manager: Pubkey,
        order_manager: Origin,
    ) -> Result<()> {
        instructions::register_product_listing::register_product_listing(
            ctx,
            id,
            origin,
            placement_type,
            product_category,
            manager,
            order_manager,
        )
    }

    pub fn update_product_listing(
        ctx: Context<UpdateProductListing>,
        id: Pubkey,
        placement_type: PlacementType,
        product_category: ProductCategory,
        manager: Pubkey,
        price: u64,
    ) -> Result<()> {
        instructions::update_product_listing::update_product_listing(
            ctx,
            id,
            placement_type,
            product_category,
            manager,
            price,
        )
    }

    pub fn activate_clickcrate(ctx: Context<ActivateClickCrate>) -> Result<()> {
        instructions::activate_clickcrate::activate_clickcrate(ctx)
    }

    pub fn deactivate_clickcrate(ctx: Context<DeactivateClickCrate>) -> Result<()> {
        instructions::deactivate_clickcrate::deactivate_clickcrate(ctx)
    }

    pub fn activate_product_listing(ctx: Context<ActivateProductListing>) -> Result<()> {
        instructions::activate_product_listing::activate_product_listing(ctx)
    }

    pub fn deactivate_product_listing(ctx: Context<DeactivateProductListing>) -> Result<()> {
        instructions::deactivate_product_listing::deactivate_product_listing(ctx)
    }

    pub fn initialize_oracle(
        ctx: Context<InitializeOracle>,
        product_listing_id: Pubkey,
        product_id: Pubkey,
    ) -> Result<()> {
        instructions::initialize_oracle::initialize_oracle(ctx, product_listing_id, product_id)
    }

    pub fn close_oracle(
        ctx: Context<CloseOracle>,
        product_listing_id: Pubkey,
        product_id: Pubkey,
    ) -> Result<()> {
        instructions::close_oracle::close_oracle(ctx, product_listing_id, product_id)
    }

    pub fn remove_products<'a, 'b, 'c: 'info, 'info>(
        ctx: Context<'a, 'b, 'c, 'info, RemoveProducts<'info>>,
        product_listing_id: Pubkey,
        clickcrate_id: Pubkey,
    ) -> Result<()> {
        instructions::remove_products::remove_products(ctx, product_listing_id, clickcrate_id)
    }

    pub fn place_products<'a, 'b, 'c: 'info, 'info>(
        ctx: Context<'a, 'b, 'c, 'info, PlaceProducts<'info>>,
        product_listing_id: Pubkey,
        clickcrate_id: Pubkey,
        price: u64,
    ) -> Result<()> {
        instructions::place_products::place_products(ctx, product_listing_id, clickcrate_id, price)
    }

    pub fn make_purchase(
        ctx: Context<MakePurchase>,
        product_listing_id: Pubkey,
        clickcrate_id: Pubkey,
        product_id: Pubkey,
        quantity: u64,
    ) -> Result<()> {
        instructions::make_purchase::make_purchase(
            ctx,
            product_listing_id,
            clickcrate_id,
            product_id,
            quantity,
        )
    }

    pub fn update_order_status(
        ctx: Context<UpdateOrderStatus>,
        product_id: Pubkey,
        product_listing_id: Pubkey,
        new_order_status: OrderStatus,
    ) -> Result<()> {
        instructions::update_order_status::update_order_status(
            ctx,
            product_id,
            product_listing_id,
            new_order_status,
        )
    }

    pub fn complete_order(ctx: Context<CompleteOrder>, product_listing_id: Pubkey) -> Result<()> {
        instructions::complete_order::complete_order(ctx, product_listing_id)
    }
}
