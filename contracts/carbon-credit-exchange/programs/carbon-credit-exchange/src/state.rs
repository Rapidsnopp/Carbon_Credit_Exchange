use anchor_lang::prelude::*;

#[account]
pub struct CarbonExchange {
    pub authority: Pubkey,
    pub total_credits: u64,
    pub bump: u8,
}

#[account]
pub struct Listing {
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub price: u64,
    pub bump: u8,
}

#[account]
pub struct RetirementRecord {
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub retirement_date: i64,
    pub beneficiary: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct CarbonCreditData {
    pub project_name: String,
    pub project_id: String,
    pub vintage_year: u16,
    pub metric_tons: u64,
    pub validator: String,
    pub standard: String,
    pub project_type: String,
    pub country: String,
}
