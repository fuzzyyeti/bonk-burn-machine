import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Wallet } from "./Components/Wallet";
import styled from "styled-components";
import solana_bubbles from "./images/solana_bubbles.png";

const Page = styled.div`
  background-image: url(${solana_bubbles});
  background-size: cover;
  background-color: #000000;
`;

function App() {
  return (
    <Page className="App">
      <Wallet />
    </Page>
  );
}

export default App;
