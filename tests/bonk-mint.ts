import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { BN } from "bn.js";
import { BonkMint } from "../target/types/bonk_mint";
import { PublicKey} from "@solana/web3.js";
import { getAssociatedTokenAddress, mintTo, createMint, TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
const URI_BASE = "https://shdw-drive.genesysgo.net/4EVCAGfgf62Dm3bmd2e6L7BnqKZP2jmuXUtufWND12oo/"
const COLLECTION_SYMBOL = "BUBBLE";
const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

const program = anchor.workspace.BonkMint as Program<BonkMint>;
describe("bonk-mint", () => {
  
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  it("Is initialized!", async () => {
    const tokenMaker =  anchor.web3.Keypair.generate();
    const tokenMint =  anchor.web3.Keypair.generate();
    const admin = anchor.web3.Keypair.generate();
    let latestBlockHash = await program.provider.connection.getLatestBlockhash();
    console.log("hi");
    await program.provider.connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: await program.provider.connection.requestAirdrop(
          tokenMaker.publicKey,
          anchor.web3.LAMPORTS_PER_SOL * 10
      ),
    });

    await program.provider.connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: await program.provider.connection.requestAirdrop(
          admin.publicKey,
          anchor.web3.LAMPORTS_PER_SOL * 10
      ),
  });

    let mint = await createMint(
      program.provider.connection,
      tokenMaker,
      tokenMaker.publicKey,
      tokenMaker.publicKey,
      5,
      tokenMint
    );

    console.log("creating token account", mint.toBase58(), tokenMint.publicKey.toBase58());
    let ownerTokenAccount = await getOrCreateAssociatedTokenAccount(
      program.provider.connection,
      tokenMaker,
      tokenMint.publicKey,
      program.provider.publicKey
    );

    console.log("made owner ata")
    let adminTokenAccount = await getOrCreateAssociatedTokenAccount(
      program.provider.connection,
      admin,
      tokenMint.publicKey,
      admin.publicKey
    );

    const artist = anchor.web3.Keypair.generate();
    let artistAta = await getOrCreateAssociatedTokenAccount(
      program.provider.connection,
      admin,
      tokenMint.publicKey,
      artist.publicKey
    );
    console.log("minting token");
    console.log("token account", ownerTokenAccount.address.toBase58());


    const tokenTransfer = await mintTo(program.provider.connection,
      tokenMaker,
      tokenMint.publicKey,
      ownerTokenAccount.address,
      tokenMaker,
      200000000000);
    console.log("token transfer", tokenTransfer);

    const tokenAccounts = await program.provider.connection.getParsedTokenAccountsByOwner(
      program.provider.publicKey, {mint: tokenMint.publicKey});
    console.log("token amount", tokenAccounts.value[0].account.data.parsed.info.tokenAmount.amount);

    const [collection, cBump] = PublicKey.findProgramAddressSync([
      Buffer.from("collection"), 
      admin.publicKey.toBuffer()], 
      program.programId)
    const [collectionState, cSBump] = PublicKey.findProgramAddressSync([
        Buffer.from("collection_state"), 
        admin.publicKey.toBuffer()], 
        program.programId)
    latestBlockHash = await program.provider.connection.getLatestBlockhash();

    const creator = anchor.web3.Keypair.generate().publicKey;

    const tx = await program.methods.initialize(
        new BN(25000000000), 
        new BN(25000000000),
        adminTokenAccount.address,
        artistAta.address, 
        new BN(50000000000),  
        tokenMint.publicKey,
        COLLECTION_SYMBOL,
        URI_BASE,
        "Bubble Bonk",
        10,
        creator,
        500)
      .accounts({
        admin: admin.publicKey,
        collection,
        collectionState
    }).signers([admin]).rpc();
    console.log("Your transaction signature", tx);

      const mintKey = anchor.web3.Keypair.generate();
      const [metaDataAccount, _mdbump] = await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mintKey.publicKey.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      ) 
      // Get accounts needed for NFT mint
      const [masterEditionAccount, _mebump] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mintKey.publicKey.toBuffer(),
          Buffer.from("edition"),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
      
      const nftTokenAccount = await getAssociatedTokenAddress(
        mintKey.publicKey,
        program.provider.publicKey,
      );
      console.log('nftTokenAccount', nftTokenAccount.toBase58())
      console.log('metaDataAccount', metaDataAccount.toBase58())
      console.log('masterEditionAccount', masterEditionAccount.toBase58())
      console.log('mintKey', mintKey.publicKey.toBase58())
      console.log('admin', admin.publicKey.toBase58())
      console.log('artist', artist.publicKey.toBase58())
      console.log('creator', creator.toBase58())
      await program.methods.mintNft(new BN(50000000000)).accounts({
        admin: admin.publicKey,
        collection,
        collectionState,
        owner: program.provider.publicKey,
        nftMint: mintKey.publicKey,
        tokenMint: tokenMint.publicKey,
        nftAta: nftTokenAccount,
        ownerTokenAta: ownerTokenAccount.address,
        devTokenAta: adminTokenAccount.address,
        artistTokenAta: artistAta.address,
        metadata:metaDataAccount,
        masterEdition: masterEditionAccount, 
        metadataProgram: TOKEN_METADATA_PROGRAM_ID,
      }).signers([mintKey]).rpc();
      
      await program.methods.updateMinBurnAmount(new BN(100000000))
      .accounts({
        admin: admin.publicKey,
        collection
      }).signers([admin]).rpc();



      const anotherMintKey = anchor.web3.Keypair.generate();
            // Get accounts needed for NFT mint
            const [metaDataAccount2, _mdbump2] = await anchor.web3.PublicKey.findProgramAddress(
              [
                Buffer.from("metadata"),
                TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                anotherMintKey.publicKey.toBuffer(),
              ],
              TOKEN_METADATA_PROGRAM_ID
            ) 
            const [masterEditionAccount2, _mebump2] = anchor.web3.PublicKey.findProgramAddressSync(
              [
                Buffer.from("metadata"),
                TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                anotherMintKey.publicKey.toBuffer(),
                Buffer.from("edition"),
              ],
              TOKEN_METADATA_PROGRAM_ID
            )
            
            const nftTokenAccount2 = await getAssociatedTokenAddress(
              anotherMintKey.publicKey,
              program.provider.publicKey,
            );
      console.log('admin here', admin.publicKey.toBase58())
      await program.methods.mintNft(new BN(500000000)).accounts({
        admin: admin.publicKey,
        collection,
        collectionState,
        owner: program.provider.publicKey,
        nftMint: anotherMintKey.publicKey,
        tokenMint: tokenMint.publicKey,
        nftAta: nftTokenAccount2,
        ownerTokenAta: ownerTokenAccount.address,
        devTokenAta: adminTokenAccount.address,
        artistTokenAta: artistAta.address,
        metadata:metaDataAccount2,
        masterEdition: masterEditionAccount2, 
        metadataProgram: TOKEN_METADATA_PROGRAM_ID,
      }).signers([anotherMintKey]).rpc();
      console.log("check this owner", program.provider.publicKey.toBase58());
      
      // await program.methods.updateAuthorityToAdmin().accounts({
      //   admin: admin.publicKey,
      //   collection,
      //   metadata: metaDataAccount2,
      //   metadataProgram: TOKEN_METADATA_PROGRAM_ID}).signers([admin]).rpc();
        
  });
});
