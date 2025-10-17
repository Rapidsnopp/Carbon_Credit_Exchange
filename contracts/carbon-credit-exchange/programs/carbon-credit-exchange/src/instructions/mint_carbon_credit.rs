use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount},
};
use mpl_token_metadata::{
    instructions::CreateV1CpiBuilder,
    types::{PrintSupply, TokenStandard},
};
use crate::{state::*, events::*};

#[derive(Accounts)]
pub struct MintCarbonCredit<'info> {
    #[account(mut)]
    pub carbon_exchange: Account<'info, CarbonExchange>,
    
    #[account(
        init,
        payer = payer,
        mint::decimals = 0,
        mint::authority = payer,
        mint::freeze_authority = payer
    )]
    pub mint: Account<'info, Mint>,
    
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = payer
    )]
    pub token_account: Account<'info, TokenAccount>,
    
    /// CHECK: Metaplex will initialize this account
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    
    /// CHECK: Metaplex will initialize this account
    #[account(mut)]
    pub master_edition: UncheckedAccount<'info>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    
    /// CHECK: Metaplex Token Metadata Program
    pub token_metadata_program: UncheckedAccount<'info>,
    
    /// CHECK: Sysvar Instructions
    pub sysvar_instructions: UncheckedAccount<'info>,
    
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<MintCarbonCredit>,
    carbon_data: CarbonCreditData,
    uri: String,
    name: String,
    symbol: String,
) -> Result<()> {
    msg!("Minting carbon credit: {}", name);
    msg!("Symbol: {}", symbol);
    msg!("URI: {}", uri);
    
    // Mint exactly 1 token (NFT standard)
    let cpi_accounts = token::MintTo {
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.token_account.to_account_info(),
        authority: ctx.accounts.payer.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        cpi_accounts,
    );
    
    token::mint_to(cpi_ctx, 1)?;
    
    // Create Metaplex metadata on-chain
    CreateV1CpiBuilder::new(&ctx.accounts.token_metadata_program.to_account_info())
        .metadata(&ctx.accounts.metadata.to_account_info())
        .master_edition(Some(&ctx.accounts.master_edition.to_account_info()))
        .mint(&ctx.accounts.mint.to_account_info(), true)
        .authority(&ctx.accounts.payer.to_account_info())
        .payer(&ctx.accounts.payer.to_account_info())
        .update_authority(&ctx.accounts.payer.to_account_info(), true)
        .system_program(&ctx.accounts.system_program.to_account_info())
        .sysvar_instructions(&ctx.accounts.sysvar_instructions.to_account_info())
        .spl_token_program(Some(&ctx.accounts.token_program.to_account_info()))
        .name(name.clone())
        .symbol(symbol.clone())
        .uri(uri.clone())
        .seller_fee_basis_points(0)
        .token_standard(TokenStandard::NonFungible)
        .print_supply(PrintSupply::Zero)
        .invoke()?;
    
    // Update program state
    let carbon_exchange = &mut ctx.accounts.carbon_exchange;
    carbon_exchange.total_credits = carbon_exchange.total_credits.checked_add(1).unwrap();
    
    msg!("Carbon credit minted successfully with on-chain metadata.");
    
    // Emit the event with all the carbon credit data
    emit!(CarbonCreditMintedEvent {
        mint: ctx.accounts.mint.key(),
        owner: ctx.accounts.payer.key(),
        project_name: carbon_data.project_name,
        project_id: carbon_data.project_id,
        vintage_year: carbon_data.vintage_year,
        metric_tons: carbon_data.metric_tons,
    });
    
    Ok(())
}
