use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
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
    // ✅ Không cần thaw NFT vì chúng ta không freeze nó khi list
    // Listing account sẽ tự động close và refund rent cho owner (do close = owner)
    
    msg!("Listing cancelled successfully for mint: {}", ctx.accounts.mint.key());
    
    Ok(())
}
