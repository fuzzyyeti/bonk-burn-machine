use anchor_lang::prelude::*;
use spl_token::instruction::mint_to;
use anchor_spl::token::{Mint, Token, TokenAccount, Transfer, Burn, transfer, burn};
use solana_program::program::{invoke_signed, invoke};
use solana_program::entrypoint::ProgramResult;
use anchor_spl::associated_token::AssociatedToken;
use mpl_token_metadata::instruction::{
    create_master_edition_v3,
    create_metadata_accounts_v3,
    update_metadata_accounts_v2,
};
use mpl_token_metadata::state::Creator;


declare_id!("BoNk8h5Nk687Mag3mMnGTsDMePi6JwimSFZjQP7vBNZs");


pub fn transfer_fee<'info>(
    dev_fee: u64,
    artist_fee: u64,
    burn_amount: u64,
    owner_ata: &AccountInfo<'info>,
    admin_ata: &AccountInfo<'info>,
    artist_ata: &AccountInfo<'info>,
    owner: &AccountInfo<'info>,
    mint: &Account<'info, Mint>,
    token_program: &Program<'info, Token>,
) -> ProgramResult {
    if dev_fee > 0 {
        let transfer_instruction = Transfer{
            from: owner_ata.to_account_info(),
            to: admin_ata.to_account_info(),
            authority: owner.to_account_info(),
        };
        let transfer_cpi_ctx = CpiContext::new(
            token_program.to_account_info(),
            transfer_instruction
        );
        transfer(transfer_cpi_ctx, dev_fee)?;
    }
    if artist_fee > 0 {
        let transfer_instruction = Transfer{
            from: owner_ata.to_account_info(),
            to: artist_ata.to_account_info(),
            authority: owner.to_account_info(),
        };
        let transfer_cpi_ctx = CpiContext::new(
            token_program.to_account_info(),
            transfer_instruction
        );
        transfer(transfer_cpi_ctx, artist_fee)?;
    }
    if burn_amount > 0 {
        let burn_instruction = Burn{
            mint: mint.to_account_info(),
            from: owner_ata.to_account_info(),
            authority: owner.to_account_info(),
        };
        let burn_cpi_ctx = CpiContext::new(
            token_program.to_account_info(),
            burn_instruction
        );
        msg!("burning {} tokens with mint {}", burn_amount, mint.to_account_info().key);
        burn(burn_cpi_ctx, burn_amount)?;
    }
    Ok(())
}
 
pub fn mint_token<'info>(
    mint: &Account<'info, Mint>,
    owner: &AccountInfo<'info>,
    ata: &Account<'info, TokenAccount>,
    token_program: &Program<'info, Token>,
) -> ProgramResult {
    invoke(
        &mint_to(
            token_program.key,
            mint.to_account_info().key,
            ata.to_account_info().key,
            owner.to_account_info().key,
            &[owner.to_account_info().key],
            1,
        )?,
        &[
            mint.to_account_info().clone(),
            ata.to_account_info().clone(),
            owner.to_account_info().clone(),
        ]
    )
}

pub fn set_update_authority_to_admin<'info>(
    metadata: &UncheckedAccount<'info>,
    collection: &AccountInfo<'info>,
    admin: &AccountInfo<'info>,
    token_metadata_program: &AccountInfo<'info>,
    collection_bump: u8,
) -> ProgramResult {
    let account_info = vec![
        metadata.to_account_info(),
        collection.to_account_info(),
    ];
    invoke_signed(
        &update_metadata_accounts_v2(
            token_metadata_program.key(),
            metadata.key(),
            collection.key(),
            Some(admin.key()),
            None,
            Some(true),
            None),
            &account_info.as_slice(),
            &[
                &[&b"collection"[..], 
                admin.key.as_ref(),
                &[collection_bump]]],
        )?;
        Ok(())
}

pub fn create_metadata<'info>(
    token_metadata_program: &AccountInfo<'info>,
    metadata: &UncheckedAccount<'info>,
    master_edition: &UncheckedAccount<'info>,
    mint: &Account<'info, Mint>,
    collection: &AccountInfo<'info>,
    owner: &AccountInfo<'info>,
    admin: &AccountInfo<'info>,
    token_program: &Program<'info, Token>,
    system_program: &Program<'info, System>,
    rent: &Sysvar<'info, Rent>,    
    uri: String,
    name: String,
    symbol: String,
    creator: Pubkey,
    royalty: u16,
    collection_bump: u8,
) -> ProgramResult { 
    let account_info = vec![
        metadata.to_account_info(),
        mint.to_account_info(),
        owner.to_account_info(),
        owner.to_account_info(),
        collection.to_account_info(),
        system_program.to_account_info(),
        rent.to_account_info(),
    ];
    invoke_signed(
        &create_metadata_accounts_v3(
            token_metadata_program.key(),
            metadata.key(),
            mint.key(),
            owner.key(),
            owner.key(),
            collection.key(),
            name,
            symbol,
            uri,
            Some(vec![Creator {
                address: creator,
                verified: false,
                share: 100,
            }]),
            royalty,
            true,
            true,
            None,
            None,
            None,
        ),
        account_info.as_slice(),    
            &[
                &[&b"collection"[..], 
                admin.key.as_ref(),
                &[collection_bump]]]
    )?;
        let master_edition_infos = vec![
            master_edition.to_account_info(),
            mint.to_account_info(),
            collection.to_account_info(),
            owner.to_account_info(),
            metadata.to_account_info(),
            token_metadata_program.to_account_info(),
            token_program.to_account_info(),
            system_program.to_account_info(),
            rent.to_account_info(),
        ];
        invoke_signed(
            &create_master_edition_v3(
                token_metadata_program.key(),
                master_edition.key(),
                mint.key(),
                collection.key(),
                owner.key(),
                metadata.key(),
                owner.key(),
                Some(0),
            ),
            master_edition_infos.as_slice(),    
            &[
                &[&b"collection"[..], 
                admin.key.as_ref(),
                &[collection_bump]]],
        )?; 
    Ok(())
}



#[program]
pub mod bonk_mint {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, 
        dev_fee: u64, 
        artist_fee: u64, 
        dev_token_ata: Pubkey,
        artist_token_ata: Pubkey,
        burn_amount: u64, 
        token_mint: Pubkey, 
        symbol: String, 
        item_uri_base: String, 
        item_name_base: String,
        collection_size: u32,
        creator: Pubkey,
        royalty: u16) -> Result<()> {
        ctx.accounts.collection.admin = *ctx.accounts.admin.key;
        ctx.accounts.collection.token_mint = token_mint;
        ctx.accounts.collection.dev_token_ata = dev_token_ata;
        ctx.accounts.collection.dev_fee= dev_fee;
        ctx.accounts.collection.artist_token_ata = artist_token_ata; 
        ctx.accounts.collection.artist_fee = artist_fee;
        ctx.accounts.collection.burn_amount = burn_amount;
        ctx.accounts.collection.bump = *ctx.bumps.get("collection").unwrap();
        ctx.accounts.collection.symbol = symbol;
        ctx.accounts.collection.item_name_base = item_name_base;
        ctx.accounts.collection.item_uri_base = item_uri_base;
        ctx.accounts.collection_state.total = collection_size;
        ctx.accounts.collection.creator = creator;
        ctx.accounts.collection.royalty = royalty;
        ctx.accounts.collection_state.next = 0;
        Ok(())
    }

    pub fn mint_nft(ctx: Context<MintNft>) -> Result<()> {
        if ctx.accounts.collection_state.next >= ctx.accounts.collection_state.total {
            return Err(ErrorCode::MintComplete.into());
        }
        transfer_fee(
            ctx.accounts.collection.dev_fee,
            ctx.accounts.collection.artist_fee,
            ctx.accounts.collection.burn_amount,
            &ctx.accounts.owner_token_ata,
            &ctx.accounts.dev_token_ata,
            &ctx.accounts.artist_token_ata,
            &ctx.accounts.owner,
            &ctx.accounts.token_mint,
            &ctx.accounts.token_program
            )?;
        mint_token(
            &ctx.accounts.nft_mint, 
            &ctx.accounts.owner,
            &ctx.accounts.nft_ata, 
            &ctx.accounts.token_program)?;
        create_metadata(
            &ctx.accounts.metadata_program,
            &ctx.accounts.metadata, 
            &ctx.accounts.master_edition,
            &ctx.accounts.nft_mint,
            &ctx.accounts.collection.to_account_info(),
            &ctx.accounts.owner,
            &ctx.accounts.admin,
            &ctx.accounts.token_program,
            &ctx.accounts.system_program,
            &ctx.accounts.rent,
            ctx.accounts.collection.item_uri_base.clone() + &ctx.accounts.collection_state.next.to_string() + ".json",
            ctx.accounts.collection.item_name_base.clone() + " #" + &ctx.accounts.collection_state.next.to_string(),
            ctx.accounts.collection.symbol.clone(),
            ctx.accounts.collection.creator,
            ctx.accounts.collection.royalty,
            ctx.accounts.collection.bump,
        )?;
        set_update_authority_to_admin(
            &ctx.accounts.metadata, 
            &ctx.accounts.collection.to_account_info(), 
            &ctx.accounts.admin, 
            &ctx.accounts.metadata_program, 
            ctx.accounts.collection.bump,
        )?;
        ctx.accounts.collection_state.next += 1;
        Ok(())
    }


    pub fn update_authority_to_admin(ctx: Context<SetUpdateAuthorityToAdmin>) -> Result<()> {
        set_update_authority_to_admin(
            &ctx.accounts.metadata, 
            &ctx.accounts.collection.to_account_info(), 
            &ctx.accounts.admin, 
            &ctx.accounts.metadata_program, 
            ctx.accounts.collection.bump,
        )?;
        Ok(())
    }
}


#[derive(Accounts)]
pub struct MintNft<'info>{
    /// CHECK: This is checked on the collection
    #[account(mut)]
    admin: UncheckedAccount<'info>,
    #[account(mut, has_one = token_mint, has_one = admin, has_one = artist_token_ata, has_one = dev_token_ata)]
    collection: Box<Account<'info, Collection>>,
    #[account(mut)]
    collection_state: Account<'info, CollectionState>,
    #[account(mut)]
    owner: Signer<'info>,
    #[account(init,
        payer = owner,
        mint::authority = owner,
        mint::decimals = 0,
        mint::freeze_authority = owner
    )]
    nft_mint: Account<'info, Mint>,
    #[account(init,
        payer = owner,
        associated_token::mint = nft_mint,
        associated_token::authority = owner,
      )]
    nft_ata: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    token_mint: Account<'info, Mint>,
    /// CHECK: Does not need additional check
    #[account(mut)]
    owner_token_ata: UncheckedAccount<'info>,
    /// CHECKs Does not need additional check
    #[account(mut)]
    artist_token_ata: UncheckedAccount<'info>,
    /// CHECKs Does not need additional check
    #[account(mut)]
    dev_token_ata: UncheckedAccount<'info>,
    /// CHECK: Does not need additional check
    #[account(mut)]
    metadata: UncheckedAccount<'info>, 
    /// CHECK: Does not need additional check
    #[account(mut)]
    master_edition: UncheckedAccount<'info>, 
    token_program: Program<'info, Token>,
    system_program: Program<'info, System>,
    associated_token_program: Program<'info, AssociatedToken>,
    #[account(address = mpl_token_metadata::ID)]
    /// CHECK: Does not need additional check
    metadata_program: AccountInfo<'info>,
    rent: Sysvar<'info, Rent>
}

// This is only needed because I left the update-authority as
// a PDA in gen 0 Bubble bonks. It shouldn't work
// for new collections where the admin will already be the
// update authority.
#[derive(Accounts)]
pub struct SetUpdateAuthorityToAdmin<'info> {
    #[account(mut)]
    admin: Signer<'info>,
    #[account(mut, has_one = admin)]
    collection: Box<Account<'info, Collection>>,
    /// CHECK: Does not need additional check
    #[account(mut)]
    metadata: UncheckedAccount<'info>,
    /// CHECK: Does not need additional check
    #[account(address = mpl_token_metadata::ID)]
    metadata_program: AccountInfo<'info>,
}


#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    admin: Signer<'info>,
    #[account(init,
        payer = admin,
        space = 8 + 32 + 32 + 8 + 4 + 20 + (120 + 4) * 2 + 1,
        seeds = [b"collection".as_ref(), admin.key.as_ref()],
        bump,
    )]
    collection: Box<Account<'info, Collection>>,
    #[account(init,
        payer = admin,
        space = 8 + 8 + 8,
        seeds = [b"collection_state".as_ref(), admin.key.as_ref()],
        bump,
    )]
    collection_state: Account<'info, CollectionState>,
    /// CHECK: This is just the system program.
    system_program: AccountInfo<'info>,
    rent: Sysvar<'info, Rent>,
}

#[account]
pub struct CollectionState {
    total: u32,
    next: u32,
}

#[account]
pub struct Collection {
    admin: Pubkey,
    token_mint: Pubkey,
    dev_fee: u64,
    artist_fee: u64,
    artist_token_ata: Pubkey,
    dev_token_ata: Pubkey,
    burn_amount: u64,
    creator: Pubkey,
    royalty: u16,
    bump: u8,
    symbol: String,
    item_name_base: String,
    item_uri_base: String
}



#[error_code]
pub enum ErrorCode {
    #[msg("No more items to mint")]
    MintComplete,
}
