use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum OracleValidation {
    Uninitialized,
    V1 {
        create: ExternalValidationResult,
        transfer: ExternalValidationResult,
        burn: ExternalValidationResult,
        update: ExternalValidationResult,
    },
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ExternalValidationResult {
    Approved,
    Rejected,
    Pass,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum PlacementType {
    Digitalreplica,
    Relatedpurchase,
    Targetedplacement,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ProductCategory {
    Clothing,
    Electronics,
    Books,
    Home,
    Beauty,
    Toys,
    Sports,
    Automotive,
    Grocery,
    Beverage,
    Health,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum Origin {
    Clickcrate,
    Shopify,
    Square,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum OrderStatus {
    Pending,
    Placed,
    Confirmed,
    Fulfilled,
    Delivered,
    Completed,
    Cancelled,
}
