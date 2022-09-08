use anchor_lang::{prelude::*};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod puppet {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>,name: String) -> Result<()> {
        ctx.accounts.data.name = name;
        Ok(())
    }


}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct Initialize<'info> {
    #[account(init, payer = user,
        space = 8 + 4 + 30,
        seeds = [&anchor_lang::solana_program::hash::hash(name.as_bytes()).to_bytes()
        ],
        bump
    )]
    pub data: Account<'info, Data>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}



#[account]
pub struct Data {
    pub name : String,
}