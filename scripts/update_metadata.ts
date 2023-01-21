import { keypairIdentity, Metaplex, UpdateNftInput } from "@metaplex-foundation/js";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import dotenv from 'dotenv'
dotenv.config();

const item = process.argv[2]
const mint = process.argv[3]
console.log('item', item)
console.log('mint', mint)

const connection = new Connection(process.env.RPC);
const metaplex = new Metaplex(connection);
const keypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.UPDATE_AUTHORITY)))
//console.log(metaplex);
console.log('update authority', keypair.publicKey.toBase58())
const updateUri = async () => {
	metaplex.use(keypairIdentity(keypair));
	const nft = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(mint)});
	console.log(nft)
	const tx = await metaplex.nfts().update( {
		nftOrSft: nft,
		uri: `https://shdw-drive.genesysgo.net/4EVCAGfgf62Dm3bmd2e6L7BnqKZP2jmuXUtufWND12oo/${item}.json` 
	});

	console.log(tx)
}
updateUri();
