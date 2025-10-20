use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount},
};
use crate::{state::*, error::ErrorCode, events::*};

#[derive(Accounts)]
pub struct RetireCarbonCredit<'info> {
    #[account(mut)]
    pub carbon_exchange: Account<'info, CarbonExchange>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = owner,
        constraint = token_account.amount == 1 @ ErrorCode::InvalidTokenBalance
    )]
    pub token_account: Account<'info, TokenAccount>,
    
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 32 + 8 + 32,
        seeds = [b"retired", mint.key().as_ref()],
        bump
    )]
    pub retirement_record: Account<'info, RetirementRecord>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<RetireCarbonCredit>, beneficiary: Pubkey) -> Result<()> {
    // Create retirement record
    let retirement_record = &mut ctx.accounts.retirement_record;
    retirement_record.owner = ctx.accounts.owner.key();
    retirement_record.mint = ctx.accounts.mint.key();
    retirement_record.retirement_date = Clock::get()?.unix_timestamp;
    retirement_record.beneficiary = beneficiary;
    
    // Burn the NFT token to permanently retire it
    let cpi_accounts = token::Burn {
        mint: ctx.accounts.mint.to_account_info(),
        from: ctx.accounts.token_account.to_account_info(),
        authority: ctx.accounts.owner.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        cpi_accounts,
    );
    
    token::burn(cpi_ctx, 1)?;
    
    // Update carbon exchange total
    let carbon_exchange = &mut ctx.accounts.carbon_exchange;
    carbon_exchange.total_credits = carbon_exchange.total_credits.saturating_sub(1);
    
    emit!(CreditRetiredEvent {
        mint: ctx.accounts.mint.key(),
        owner: ctx.accounts.owner.key(),
        beneficiary,
        retirement_date: retirement_record.retirement_date,
    });
    
    Ok(())
}
