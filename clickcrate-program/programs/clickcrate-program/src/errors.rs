use anchor_lang::prelude::*;

#[error_code]
pub enum ClickCrateErrors {
    #[msg("Failed to borrow account data")]
    AccountBorrowFailed,

    #[msg("Failed to add plugin")]
    AddPluginFailed,

    #[msg("ClickCrate already registered")]
    ClickCrateExists,

    #[msg("ClickCrate is actived")]
    ClickCrateActivated,

    #[msg("ClickCrate is deactived")]
    ClickCrateDeactivated,

    #[msg("ClickCrate not found")]
    ClickCrateNotFound,

    #[msg("Invalid clickcrate registration")]
    InvalidClickCrateRegistration,

    #[msg("Product Listing was not found")]
    ProductNotFound,

    #[msg("Product Listing already registered")]
    ProductListingExists,

    #[msg("Product Listing is actived")]
    ProductListingActivated,

    #[msg("Product Listing is deactived")]
    ProductListingDeactivated,

    #[msg("Product not placed")]
    ProductNotPlaced,

    #[msg("Product out of stock")]
    ProductOutOfStock,

    #[msg("Invalid product account")]
    InvalidProductAccount,

    #[msg("Invalid stocking request")]
    InvalidStockingRequest,

    #[msg("Invalid stocking amount")]
    InvalidStockingAmount,

    #[msg("Invalid removal request")]
    InvalidRemovalRequest,

    #[msg("Invalid removal amount")]
    InvalidRemovalAmount,

    #[msg("Invalid listing registration")]
    InvalidProductListingRegistration,

    #[msg("Product removal failed")]
    ProductRemovalFailed,

    #[msg("Price not found")]
    PriceNotFound,

    #[msg("Order not found")]
    OrderNotFound,

    #[msg("Order not confirmed")]
    OrderNotConfirmed,

    #[msg("Order not completed")]
    OrderNotCompleted,

    #[msg("Orders in progress")]
    OrdersInProgress,

    #[msg("Invalid oracle")]
    InvalidOrderOracleAccount,

    #[msg("Invalid vault")]
    InvalidVaultAccount,

    #[msg("Freeze authority not found")]
    FreezeAuthorityNotFound,

    #[msg("Transfer authority not found")]
    TransferAuthorityNotFound,

    #[msg("Invalid freeze authority")]
    InvalidFreezeAuthority,

    #[msg("Invalid transfer authority")]
    InvalidTransferAuthority,

    #[msg("Vault not empty")]
    VaultNotEmpty,

    #[msg("Insufficient balance")]
    InsufficientBalance,

    #[msg("Oracle account closure failed")]
    OracleFailedToClose,

    #[msg("Oracle not found")]
    OracleNotFound,

    #[msg("Oracle already updated")]
    OracleAlreadyUpdated,

    #[msg("Unauthorized update")]
    UnauthorizedUpdate,

    #[msg("Unauthorized close")]
    UnauthorizedClose,
}
