import React, { FC, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  BackpackWalletAdapter,
  GlowWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { Top } from "./Top";

require("@solana/wallet-adapter-react-ui/styles.css");

export const Wallet: FC = () => {
  // Set this to your own mainnet-beta RPC endpoint when ready to go live.
  const endpoint = process.env.REACT_APP_SOLANA_ENDPOINT!

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new BackpackWalletAdapter(),
      new GlowWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Top />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
