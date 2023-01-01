import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { BN } from "bn.js";
import { BonkMint, IDL } from "../target/types/bonk_mint";
import { Connection, PublicKey} from "@solana/web3.js";
import { getAssociatedTokenAddress, mintTo, createMint, TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();
const URI_BASE = "https://shdw-drive.genesysgo.net/4EVCAGfgf62Dm3bmd2e6L7BnqKZP2jmuXUtufWND12oo/"
const COLLECTION_SYMBOL = "BUBBLES";
const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
)
const PROGRAM_ADDRESS = new anchor.web3.PublicKey('BoNk8h5Nk687Mag3mMnGTsDMePi6JwimSFZjQP7vBNZs')
const TOKEN_MINT = new anchor.web3.PublicKey('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263');
const connection = new Connection(process.env.RPC);
const keypair = Uint8Array.from(JSON.parse(fs.readFileSync(process.env.KEY_PATH, 'utf8')));
const walletKeyPair = anchor.web3.Keypair.fromSecretKey(keypair);
anchor.setProvider(new anchor.AnchorProvider(connection, new NodeWallet(walletKeyPair), anchor.AnchorProvider.defaultOptions()));
console.log(anchor.getProvider().publicKey.toBase58())
const program = new Program<BonkMint>(IDL, PROGRAM_ADDRESS);
console.log(program);
const devAta = new PublicKey('7dSGWHssYh7kWU7t1jKgbtZN2RRAeT6R5QtVh8Ah7WfE');
const artistAta = new PublicKey('ARgb6EhBjYFfgkfac7HrqUfx3S4qXX8W6akdiLNHwftA');
const royalty_wallet = new PublicKey('GkYZr19qj2pLEzWy1kghbvaTTWLen2TGcJm1f8K63PtP');
const provider = anchor.getProvider();

const [collection, cBump] = PublicKey.findProgramAddressSync([
    Buffer.from("collection"), 
    provider.publicKey.toBuffer()], 
    program.programId);

const [collectionState, cSBump] = PublicKey.findProgramAddressSync([
    Buffer.from("collection_state"), 
    provider.publicKey.toBuffer()], 
    program.programId);

(async () => {
const tx = await program.methods.initialize(
    new BN(0), 
    new BN(0),
    devAta,
    artistAta, 
    new BN(500000000000),  
    TOKEN_MINT,
    COLLECTION_SYMBOL,
    URI_BASE,
    "Bubble Burn",
    1000,
    royalty_wallet,
    500)
  .accounts({
    admin: provider.publicKey,
    collection,
    collectionState
}).rpc();
console.log("Your transaction signature", tx);
console.log('collection', collection.toBase58());
console.log('collectionState', collectionState.toBase58());
})();