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

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

export const Wallet: FC = () => {
  // Set this to your own mainnet-beta RPC endpoint when ready to go live.
  const endpoint = "https://wider-bold-silence.solana-mainnet.quiknode.pro/8f39cf8e33b2ab0d4a6d022fea1bac60757ca5f0/";

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
