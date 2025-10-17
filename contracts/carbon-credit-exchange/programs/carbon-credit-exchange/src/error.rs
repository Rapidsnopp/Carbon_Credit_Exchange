use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("The provided price must be greater than zero")]
    InvalidPrice,
    #[msg("NFT token balance must be exactly 1")]
    InvalidTokenBalance,
    #[msg("Insufficient funds to complete purchase")]
    InsufficientFunds,
    #[msg("SOL transfer failed")]
    TransferFailed,
    #[msg("Invalid listing owner")]
    InvalidOwner,
    #[msg("Invalid mint account")]
    InvalidMint,
    #[msg("Token transfer failed")]
    TokenTransferFailed,
    #[msg("Token burn failed")]
    TokenBurnFailed,
    #[msg("Metadata creation failed")]
    MetadataCreationFailed,
    #[msg("NFT must be locked/frozen while listed")]
    NFTNotLocked,
}
