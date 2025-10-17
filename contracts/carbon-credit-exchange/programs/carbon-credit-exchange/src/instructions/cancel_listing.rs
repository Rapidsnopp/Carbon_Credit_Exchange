use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use crate::{state::*, error::ErrorCode};

#[derive(Accounts)]
pub struct CancelListing<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub mint: Account<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = owner,
    )]
    pub token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"listing", mint.key().as_ref()],
        bump = listing.bump,
        constraint = listing.owner == owner.key() @ ErrorCode::InvalidOwner,
        close = owner
    )]
    pub listing: Account<'info, Listing>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CancelListing>) -> Result<()> {
    // Thaw NFT khi cancel
    let thaw_accounts = token::ThawAccount {
        account: ctx.accounts.token_account.to_account_info(),
        mint: ctx.accounts.mint.to_account_info(),
        authority: ctx.accounts.owner.to_account_info(),
    };

    let thaw_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        thaw_accounts,
    );

    token::thaw_account(thaw_ctx)?;

    Ok(())
}
