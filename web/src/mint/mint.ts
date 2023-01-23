import { BonkMint } from "../anchor/bonk_mint";
import { Program } from "@project-serum/anchor";
import {
  ADMIN,
  COLLECTION,
  COLLECTION_STATE,
  DEV_ATA,
  ARTIST_ATA,
  TOKEN_METADATA_PROGRAM_ID,
  TOKEN_MINT,
} from "./constants";
import { getAccounts } from "./get_accounts";
import BN from "bn.js";

export const mintNft = async (program: Program<BonkMint>, userBurn: BN) => {
  console.log("minter", program.provider.publicKey?.toBase58());
  const {
    mintKey,
    metaDataAccount,
    masterEditionAccount,
    nftTokenAccount,
    ownerTokenAccount,
  } = await getAccounts(program.provider.publicKey!);
  console.log("", program);
  const col = await program?.account.collection.fetch(COLLECTION);
  console.log("artist fee", col.artistFee.toNumber());
  console.log("dev fee", col.devFee.toNumber());
  console.log("burn", col.burnAmount.toNumber());
  console.log("owner token ata", ownerTokenAccount.toBase58());
  console.log("dev token ata", DEV_ATA.toBase58());
  console.log("artist token ata", ARTIST_ATA.toBase58());
  console.log("equal?", col.tokenMint.toBase58(), TOKEN_MINT.toBase58());
  const tx = await program.methods
    .mintNft(userBurn)
    .accounts({
      admin: ADMIN,
      collection: COLLECTION,
      collectionState: COLLECTION_STATE,
      owner: program.provider.publicKey,
      nftMint: mintKey.publicKey,
      tokenMint: TOKEN_MINT,
      nftAta: nftTokenAccount,
      ownerTokenAta: ownerTokenAccount,
      devTokenAta: DEV_ATA,
      artistTokenAta: ARTIST_ATA,
      metadata: metaDataAccount,
      masterEdition: masterEditionAccount,
      metadataProgram: TOKEN_METADATA_PROGRAM_ID,
    })
    .signers([mintKey])
    .rpc();

  console.log(tx);
  return tx;
};
