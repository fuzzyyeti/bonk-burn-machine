import * as anchor from "@project-serum/anchor";
import { TOKEN_METADATA_PROGRAM_ID, TOKEN_MINT } from "./constants";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

export const getAccounts = async (minter: PublicKey) => {
  const mintKey = anchor.web3.Keypair.generate();
  const [metaDataAccount, _mdbump] =
    anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKey.publicKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
  // Get accounts needed for NFT mint
  const [masterEditionAccount, _mebump] =
    anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKey.publicKey.toBuffer(),
        Buffer.from("edition"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

  const nftTokenAccount = await getAssociatedTokenAddress(
    mintKey.publicKey,
    minter
  );

  let ownerTokenAccount = await getAssociatedTokenAddress(TOKEN_MINT, minter);

  return {
    mintKey,
    metaDataAccount,
    masterEditionAccount,
    nftTokenAccount,
    ownerTokenAccount,
  };
};
