use anchor_lang::prelude::*;

mod state;
mod error;
mod events;
mod instructions;

pub use state::*;
pub use error::*;
pub use events::*;
pub use instructions::*;

declare_id!("G1oyFNSMSHRBPG6LWWpAMhJJNf23HWjNpq8FALJSUqs3");

#[program]
pub mod carbon_credit_exchange {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize::handler(ctx)
    }

    pub fn mint_carbon_credit(
        ctx: Context<MintCarbonCredit>,
        carbon_data: CarbonCreditData,
        uri: String,
        name: String,
        symbol: String,
    ) -> Result<()> {
        instructions::mint_carbon_credit::handler(ctx, carbon_data, uri, name, symbol)
    }

    pub fn list_for_sale(
        ctx: Context<ListForSale>,
        price: u64,
    ) -> Result<()> {
        instructions::list_for_sale::handler(ctx, price)
    }

    pub fn cancel_listing(ctx: Context<CancelListing>) -> Result<()> {
        instructions::cancel_listing::handler(ctx)
    }

    pub fn buy_carbon_credit(ctx: Context<BuyCarbonCredit>) -> Result<()> {
        instructions::buy_carbon_credit::handler(ctx)
    }

    pub fn retire_carbon_credit(
        ctx: Context<RetireCarbonCredit>,
        beneficiary: Pubkey,
    ) -> Result<()> {
        instructions::retire_carbon_credit::handler(ctx, beneficiary)
    }
}