use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 8 + 1,
        seeds = [b"carbon_exchange"],
        bump
    )]
    pub carbon_exchange: Account<'info, CarbonExchange>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Initialize>) -> Result<()> {
    let carbon_exchange = &mut ctx.accounts.carbon_exchange;
    carbon_exchange.authority = ctx.accounts.authority.key();
    carbon_exchange.total_credits = 0;
    carbon_exchange.bump = ctx.bumps.carbon_exchange;
    
    Ok(())
}
