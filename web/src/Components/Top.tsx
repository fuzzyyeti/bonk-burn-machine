import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { useEffect, useState } from "react";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  Button,
  AppBar,
  Box,
  CircularProgress,
  Toolbar,
  Typography,
  Input,
  autocompleteClasses,
} from "@mui/material";
import { BonkMint } from "../anchor/bonk_mint";
import { purple } from "@mui/material/colors";
import { IDL } from "../anchor/bonk_mint";
import { Program, AnchorProvider } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import {
  COLLECTION_STATE,
  COLLECTION,
  PROGRAM_ID,
  TOKEN_MINT,
} from "../mint/constants";
import { mintNft } from "../mint/mint";
import styled from "styled-components";
import mintflasher from "../images/bubble_burner.gif";
import bonk_inu from "../images/bonk_inu.jpeg";
import LaunchIcon from "@mui/icons-material/Launch";
import BN from 'bn.js';

const Flasher = styled.img`
   {
    width: 200px;
    margin-top: 0;
  }
`;

const Inu = styled.img`
   {
    width: 50px;
  }
`;

const Footer = styled(Typography)`
   {
    color: white;
    margin-top: auto;
  }
`;

const Title = styled(Typography)`
   {
    color: white;
    font-size: 30px;
    font-family: "Signika Negative", sans-serif;
  }
`;

const Text = styled(Typography)`
   {
    color: white;
  }
`;

const MintButton = styled(Button)`
   {
    background-color: #ffffff;
    color: orange;
  }
`;

const StyledProgress = styled(CircularProgress)`
   {
    color: white;
  }
`;

export const Top = () => {
  const wallet = useWallet();
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();

  const [program, setProgram] = useState<Program<BonkMint> | null>(null);
  const [mintedAmount, setMintedAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [provider, setProvider] = useState<anchor.Provider | null>(null);
  const [successTx, setSuccessTx] = useState("");
  const [mintWaiter, setMintWaiter] = useState(false);
  const [userBurn, setUserBurn] = useState(1000);
  useEffect(() => {
    console.log("checking wallets", program);
    if (anchorWallet?.publicKey && connection && !program) {
      console.log("alive?", connection, anchorWallet);
      const provider = new AnchorProvider(connection, anchorWallet, {});
      const program = new Program<BonkMint>(IDL, PROGRAM_ID, provider);
      setProgram(program);
      setProvider(provider);
      console.log("provider", provider);
      console.log("program", program);
    }
  }, [connection, anchorWallet?.publicKey]);

  useEffect(() => {
    if (program) {
      getMintedAmount();
    }
  }, [program]);

  const getMintedAmount = async () => {
    const cs = await program?.account.collectionState.fetch(COLLECTION_STATE);
    setMintedAmount(cs!.next);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      wallet.publicKey!,
      { mint: TOKEN_MINT }
    );
    console.log("token accounts", tokenAccounts);
    if (tokenAccounts.value.length > 0) {
      setBalance(
        tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount
      );
    }
  };
  const mintWithBonk = async () => {
    if (!program || !wallet.publicKey) {
      console.log("no wallet connected");
    }
    try {
      setMintWaiter(true);
      const tx = await mintNft(program!, new BN(userBurn).mul(new BN(100000)));
      setSuccessTx(tx);
    } catch (e) {
      setMintWaiter(false);
    }
    setMintWaiter(false);
  };

  return (
    <>
      <AppBar
        style={{
          backgroundColor: "transparent",
        }}
        position={"static"}
      >
        <Toolbar>
          <Box flexGrow={1} />
          <Box>
            <WalletMultiButton
              style={{
                color: "black",
                backgroundColor: "white",
                borderRadius: "15px",
              }}
            />
            <Typography variant={"body2"} style={{ color: "white" }}>
              Bonk Balance:
            </Typography>
            <Typography variant={"body2"} style={{ color: "white" }}>
              {balance} BONK
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Flasher src={mintflasher} />
      <Typography variant={"body2"} style={{ color: "white" }}>
        Price: 1,000 $BONK or more. Your NFT will display your burn amount. 
      </Typography>
      <Typography variant={"body2"} style={{ color: "white" }}>
        100% of the mint and royalties will be burned
      </Typography>
      <Typography
        variant={"body2"}
        style={{ color: "white", width: "40%", margin: "auto" }}
      >
        Deflate the Bubble, burn the $BONK
      </Typography>
      {!mintWaiter && mintedAmount < 5000 && (
        <>
        <Typography variant={"h4"} style={{margin: "auto" ,color: "white" }}>How much $BONK do you want to burn?</Typography>
        <Input 
          type="number"
          style={{display: "block", width: "280px", backgroundColor: "white", color: "black", margin: "auto"}} 
          value={userBurn} 
          onChange={evt => setUserBurn(parseInt(evt.target.value))}></Input>
        <Button
          style={{
            display: "block",
            backgroundColor: "#0a93f5",
            color: "white",
            borderRadius: 0,
            height: "50px",
            width: "280px",
            marginTop: "20px",
            marginBottom: "20px",
            marginRight: "auto",
            marginLeft: "auto",
          }}
          onClick={mintWithBonk}
        >
          Mint
        </Button>
        </>
      )}
      {mintWaiter && (
        <StyledProgress variant="indeterminate" value={mintedAmount} />
      )}
      {!mintWaiter && successTx !== "" && (
        <Box
          onClick={() => window.open(`https://solscan.io/tx/${successTx}`)}
          style={{
            cursor: "pointer",
            textAlign: "center",
            border: "3px solid white",
            width: "400px",
            marginBottom: "20px",
            marginTop: "30px",
            paddingBottom: "10px",
            paddingTop: "10px",
            margin: "auto",
          }}
        >
          <Typography style={{ color: "white" }}>
            Find the burn instruction in your Solscan Tx
          </Typography>
          <LaunchIcon style={{ color: "white" }}></LaunchIcon>
        </Box>
      )}
      {mintedAmount === 1000 && (
        <Box
          style={{
            textAlign: "center",
            border: "3px solid white",
            width: "400px",
            marginBottom: "20px",
            marginTop: "30px",
            paddingBottom: "10px",
            paddingTop: "10px",
            margin: "auto",
          }}
        >
          <Typography style={{ color: "white" }}>Sold Out!</Typography>
        </Box>
      )}
      <Title
        style={{
          fontFamily: "'Rubik Glitch', cursive",
        }}
        variant={"h3"}
      >
        Bubble Burn
      </Title>
      {program && (
        <>
          <Typography
            variant={"body2"}
            style={{ color: "white", marginTop: "2px" }}
          >
            {mintedAmount} minted
          </Typography>
          <Typography
            variant={"body2"}
            style={{ color: "white", marginTop: "2px" }}
          >
            {mintedAmount * 5000000} BONK burned
          </Typography>
        </>
      )}
      <Typography
        onClick={() =>
          window.open("https://magiceden.io/marketplace/bubble_bonk")
        }
        variant={"body2"}
        style={{
          color: "white",
          cursor: "pointer",
          margin: "auto",
          width: "40%",
        }}
      >
        Bubble Burn are a follow up to Bubble Bonks, 1st ever $BONK burning
        mint, which burned over 6 billion $BONK and are now available on the
        secondary market
      </Typography>
      <Text variant={"body2"}>Powered By</Text>
      <Inu src={bonk_inu} />
      <Text variant={"body2"}>BONK Token</Text>
      <Footer>Created by ZSY and Fuzzy Yeti</Footer>
    </>
  );
};
