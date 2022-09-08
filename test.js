const {Connection, PublicKey,LAMPORTS_PER_SOL,Keypair} = require("@solana/web3.js");
const {Program} = require("@project-serum/anchor");
const anchor = require("@project-serum/anchor");
const { assert } = require("chai");
const crypto = require('crypto');

const idl = require('../target/idl/puppet.json');

describe("the program", () => {
  let user = Keypair.generate();
  user = new anchor.Wallet(user);

  const connection = new Connection("https://api.devnet.solana.com");
  const provider = new anchor.AnchorProvider(connection,user,{});
  const programId = new PublicKey(idl.metadata.address);
  const program = new Program(idl,programId,provider);

  async function addFunds(user, amount,provider) {
    const airdrop_tx = await provider.connection.requestAirdrop(user.publicKey, amount)
    await provider.connection.confirmTransaction(airdrop_tx);
  }

  it("initializes the account with the long string", async() => {

    await addFunds(user,LAMPORTS_PER_SOL,provider); //airdrops 1 SOL

    let hexString = crypto.createHash('sha256').update('This is a long string..','utf-8').digest('hex');
    let seed = Uint8Array.from(Buffer.from(hexString,'hex'));

    let [programPDA, _] = await PublicKey.findProgramAddress([
        seed
    ],programId);

    await program.methods.initialize('This is a long string..')
    .accounts({
        data: programPDA,
    }).rpc()

    let account = await program.account.data.fetch(programPDA)
    console.log(account)
})


});
