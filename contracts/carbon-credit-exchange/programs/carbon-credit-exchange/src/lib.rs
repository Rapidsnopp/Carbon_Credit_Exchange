use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount},
};
use mpl_token_metadata::{
    ID as MetadataID
};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod carbon_credit_exchange {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // Initialize program
        let carbon_exchange = &mut ctx.accounts.carbon_exchange;
        carbon_exchange.authority = ctx.accounts.authority.key();
        carbon_exchange.total_credits = 0;
        carbon_exchange.bump = *ctx.bumps.get("carbon_exchange").unwrap();
        
        Ok(())
    }

    pub fn mint_carbon_credit(
        ctx: Context<MintCarbonCredit>,
        carbon_data: CarbonCreditData,
        uri: String,
        name: String,
        symbol: String,
    ) -> Result<()> {
        // Logic to mint a carbon credit as an NFT
        // This is a placeholder for the actual implementation
        
        // Update program state
        let carbon_exchange = &mut ctx.accounts.carbon_exchange;
        carbon_exchange.total_credits = carbon_exchange.total_credits.checked_add(1).unwrap();
        
        Ok(())
    }

    pub fn list_for_sale(
        ctx: Context<ListForSale>,
        price: u64,
    ) -> Result<()> {
        // Logic to list a carbon credit NFT for sale
        // This is a placeholder for the actual implementation
        
        Ok(())
    }

    pub fn buy_carbon_credit(
        ctx: Context<BuyCarbonCredit>,
    ) -> Result<()> {
        // Logic to buy a carbon credit NFT
        // This is a placeholder for the actual implementation
        
        Ok(())
    }

    pub fn retire_carbon_credit(
        ctx: Context<RetireCarbonCredit>,
    ) -> Result<()> {
        // Logic to retire a carbon credit (mark as used)
        // This is a placeholder for the actual implementation
        
        Ok(())
    }
}

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

#[derive(Accounts)]
pub struct MintCarbonCredit<'info> {
    #[account(mut)]
    pub carbon_exchange: Account<'info, CarbonExchange>,
    
    #[account(mut)]
    pub mint: Signer<'info>,
    
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = payer
    )]
    pub token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    /// CHECK: Metadata account will be created by CPI
    #[account(mut)]
    pub metadata_account: UncheckedAccount<'info>,
    /// CHECK: This is the Metaplex token metadata program
    #[account(address = MetadataID)]
    pub token_metadata_program: UncheckedAccount<'info>,
    /// CHECK: Rent sysvar
    pub rent: Sysvar<'info, Rent>,
}

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
        associated_token::authority = owner
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
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyCarbonCredit<'info> {
    #[account(mut)]
    pub carbon_exchange: Account<'info, CarbonExchange>,
    
    #[account(mut)]
    pub buyer: Signer<'info>,
    
    #[account(mut)]
    pub seller: UncheckedAccount<'info>,
    
    pub mint: Account<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = seller
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
        close = seller
    )]
    pub listing: Account<'info, Listing>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RetireCarbonCredit<'info> {
    #[account(mut)]
    pub carbon_exchange: Account<'info, CarbonExchange>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub mint: Account<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = owner
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
    pub system_program: Program<'info, System>,
}

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