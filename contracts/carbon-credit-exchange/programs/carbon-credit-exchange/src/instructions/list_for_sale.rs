use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use crate::{state::*, error::ErrorCode, events::*};

#[derive(Accounts)]
pub struct ListForSale<'info> {
    #[account(mut)]
    pub carbon_exchange: Account<'info, CarbonExchange>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
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
        space = 8 + 32 + 32 + 8 + 1,
        seeds = [b"listing", mint.key().as_ref()],
        bump
    )]
    pub listing: Account<'info, Listing>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<ListForSale>, price: u64) -> Result<()> {
    require!(price > 0, ErrorCode::InvalidPrice);

    let listing = &mut ctx.accounts.listing;
    listing.owner = ctx.accounts.owner.key();
    listing.mint = ctx.accounts.mint.key();
    listing.price = price;
    listing.bump = ctx.bumps.listing;

    // 🔒 QUAN TRỌNG: Freeze NFT để không thể transfer trong khi listing
    let freeze_accounts = token::FreezeAccount {
        account: ctx.accounts.token_account.to_account_info(),
        mint: ctx.accounts.mint.to_account_info(),
        authority: ctx.accounts.owner.to_account_info(),
    };

    let freeze_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        freeze_accounts,
    );

    token::freeze_account(freeze_ctx)?;

    emit!(ListingCreatedEvent {
        mint: ctx.accounts.mint.key(),
        owner: ctx.accounts.owner.key(),
        price,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}
