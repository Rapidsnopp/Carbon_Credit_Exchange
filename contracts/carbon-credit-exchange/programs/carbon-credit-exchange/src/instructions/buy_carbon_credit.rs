use anchor_lang::prelude::*;
use anchor_lang::solana_program::{clock::Clock, program::invoke};
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount},
};
use crate::{state::*, error::ErrorCode, events::*};

#[derive(Accounts)]
pub struct BuyCarbonCredit<'info> {
    #[account(mut)]
    pub carbon_exchange: Account<'info, CarbonExchange>,
    
    #[account(mut)]
    pub buyer: Signer<'info>,
    
    #[account(mut, constraint = seller.key() == listing.owner @ ErrorCode::InvalidOwner)]
    /// CHECK: We verify this matches the listing owner
    pub seller: AccountInfo<'info>,
    
    #[account(
        constraint = mint.key() == listing.mint @ ErrorCode::InvalidMint,
    )]
    pub mint: Account<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = seller,
        constraint = seller_token_account.amount == 1 @ ErrorCode::InvalidTokenBalance
    )]
    pub seller_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = mint,
        associated_token::authority = buyer
    )]
    pub buyer_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"listing", mint.key().as_ref()],
        bump = listing.bump,
        constraint = listing.mint == mint.key() @ ErrorCode::InvalidMint,
        close = seller
    )]
    pub listing: Account<'info, Listing>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<BuyCarbonCredit>) -> Result<()> {
    let listing = &ctx.accounts.listing;
    let price = listing.price;

    // Verify NFT is frozen (still listed)
    require!(
        ctx.accounts.seller_token_account.is_frozen(),
        ErrorCode::NFTNotLocked
    );

    // Transfer SOL
    let buyer_info = &ctx.accounts.buyer.to_account_info();
    let seller_info = &ctx.accounts.seller.to_account_info();

    require!(buyer_info.lamports() >= price, ErrorCode::InsufficientFunds);

    invoke(
        &anchor_lang::solana_program::system_instruction::transfer(
            &buyer_info.key(),
            &seller_info.key(),
            price,
        ),
        &[buyer_info.clone(), seller_info.clone(), ctx.accounts.system_program.to_account_info()],
    )?;

    // Thaw NFT before transfer
    let thaw_accounts = token::ThawAccount {
        account: ctx.accounts.seller_token_account.to_account_info(),
        mint: ctx.accounts.mint.to_account_info(),
        authority: ctx.accounts.seller.to_account_info(),
    };

    let thaw_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        thaw_accounts,
    );

    token::thaw_account(thaw_ctx)?;

    // Transfer NFT
    let transfer_accounts = token::Transfer {
        from: ctx.accounts.seller_token_account.to_account_info(),
        to: ctx.accounts.buyer_token_account.to_account_info(),
        authority: ctx.accounts.seller.to_account_info(),
    };

    let transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        transfer_accounts,
    );

    token::transfer(transfer_ctx, 1)?;

    // Close listing
    let listing_info = ctx.accounts.listing.to_account_info();
    let dest_starting_lamports = seller_info.lamports();
    **seller_info.lamports.borrow_mut() = dest_starting_lamports
        .checked_add(listing_info.lamports())
        .unwrap();
    **listing_info.lamports.borrow_mut() = 0;

    emit!(SaleCompletedEvent {
        mint: ctx.accounts.mint.key(),
        seller: ctx.accounts.seller.key(),
        buyer: ctx.accounts.buyer.key(),
        price,
        timestamp: Clock::get()?.unix_timestamp,
        listing_closed: true,
    });

    Ok(())
}
