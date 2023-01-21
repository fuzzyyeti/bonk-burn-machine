import axios from 'axios';
import dotenv from 'dotenv';
//const ADMIN='2caMPE832jAJfrbQdGXYtDWyYaqfg2umgh4cN56QgUAG'
const ADMIN='9Ccz6i4DhCMBzTSkTufRbhkNSd8ySVgns7wJco3cjeU7'

dotenv.config();
let url = `https://api.helius.xyz/v0/addresses/${ADMIN}/transactions?api-key=${process.env.API_KEY}`
const findMintForNumber = async (searchNumber: Number) => {
  while (true) {
    const { data } = await axios.get(url)
    let x = 0;
    let last_sig = "";
    for (const tx of data) {
      if (tx.type === "NFT_MINT") {
					console.log(tx.tokenTransfers)
					return;
					const mint = tx.accountData[1].account;
					if(await isMintNumber(tx.accountData[1].account, searchNumber)) {
						console.log(`NFT #${searchNumber} is ${mint}`)
						break;
					}
          last_sig = tx.signature;
      }
    }
    url = `https://api.helius.xyz/v0/addresses/${ADMIN}/transactions?api-key=${process.env.API_KEY}&before=${last_sig}`
    if(last_sig === "") {
      break;
    }
    x++;
  }
}

const isMintNumber = async (mint: String, searchNumber: Number) =>
{
	const url = `https://api.helius.xyz/v0/tokens/metadata?api-key=${process.env.API_KEY}`
  const { data } = await axios.post(url, { mintAccounts: [mint]})
  const name = data[0].onChainData.data.name
	const mintNumber = Number(name.match(/#(\d+)/)[1])
	console.log('comparing', mintNumber, searchNumber)
	return mintNumber === searchNumber;
}
//parseTransactions();
//getMetadata('HJ5p3x2TYqBMtLesDFr467XBxQzTmC5PTghsEm2ePoMM')
findMintForNumber(10)
//isMintNumber('HJ5p3x2TYqBMtLesDFr467XBxQzTmC5PTghsEm2ePoMM', 10);
