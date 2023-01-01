import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
let url = `https://api.helius.xyz/v0/addresses/2caMPE832jAJfrbQdGXYtDWyYaqfg2umgh4cN56QgUAG/transactions?api-key=${process.env.API_KEY}`
const parseTransactions = async () => {
  while (true) {
    const { data } = await axios.get(url)
    let x = 0;
    let last_sig = "";
    for (const tx of data) {
      if (tx.type === "NFT_MINT") {
          console.log(tx.accountData[1].account)
          last_sig = tx.signature;
      }
    }
    url = `https://api.helius.xyz/v0/addresses/2caMPE832jAJfrbQdGXYtDWyYaqfg2umgh4cN56QgUAG/transactions?api-key=${process.env.API_KEY}&before=${last_sig}`
    if(last_sig === "") {
      break;
    }
    x++;
  }
}
parseTransactions();