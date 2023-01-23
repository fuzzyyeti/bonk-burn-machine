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
const PROGRAM_ADDRESS = new anchor.web3.PublicKey('BoNk8h5Nk687Mag3mMnGTsDMePi6JwimSFZjQP7vBNZs')
const connection = new Connection(process.env.RPC);
const keypair = Uint8Array.from(JSON.parse(fs.readFileSync(process.env.KEY_PATH, 'utf8')));
const walletKeyPair = anchor.web3.Keypair.fromSecretKey(keypair);
anchor.setProvider(new anchor.AnchorProvider(connection, new NodeWallet(walletKeyPair), anchor.AnchorProvider.defaultOptions()));
console.log(anchor.getProvider().publicKey.toBase58())
const program = new Program<BonkMint>(IDL, PROGRAM_ADDRESS);
const provider = anchor.getProvider();

const [collection, cBump] = PublicKey.findProgramAddressSync([
    Buffer.from("collection"), 
    provider.publicKey.toBuffer()], 
    program.programId);

console.log('collection', collection.toBase58());
console.log('provider', provider.publicKey.toBase58());

program.methods.updateMinBurnAmount(new BN(100000000))
	.accounts({
		admin: provider.publicKey,
		collection: collection}).rpc();

