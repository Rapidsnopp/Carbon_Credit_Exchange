use anchor_lang::prelude::*;

#[event]
pub struct ListingCreatedEvent {
    pub mint: Pubkey,
    pub owner: Pubkey,
    pub price: u64,
    pub timestamp: i64,
}

#[event]
pub struct SaleCompletedEvent {
    pub mint: Pubkey,
    pub seller: Pubkey,
    pub buyer: Pubkey,
    pub price: u64,
    pub timestamp: i64,
    pub listing_closed: bool,
}

#[event]
pub struct CreditRetiredEvent {
    pub mint: Pubkey,
    pub owner: Pubkey,
    pub beneficiary: Pubkey,
    pub retirement_date: i64,
}

#[event]
pub struct CarbonCreditMintedEvent {
    pub mint: Pubkey,
    pub owner: Pubkey,
    pub project_name: String,
    pub project_id: String,
    pub vintage_year: u16,
    pub metric_tons: u64,
}
