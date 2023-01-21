import { keypairIdentity, Metaplex, CreateNftInput, BigNumber} from "@metaplex-foundation/js";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import BN from 'bn.js'
import dotenv from 'dotenv'

dotenv.config();


const connection = new Connection(process.env.RPC);
const metaplex = new Metaplex(connection);
const keypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.UPDATE_AUTHORITY)))
//console.log(metaplex);
console.log('update authority', keypair.publicKey.toBase58())
const createCollectionNft = async () => {
	metaplex.use(keypairIdentity(keypair));
	await metaplex.nfts().create(
		{
			updateAuthority: keypair,
			uri: "https://shdw-drive.genesysgo.net/4EVCAGfgf62Dm3bmd2e6L7BnqKZP2jmuXUtufWND12oo/burn.json",
			name: "Bubble Burn",
			symbol: "BUBBLE",
			sellerFeeBasisPoints: 0,
			creators: [
				{
					address: new PublicKey("GkYZr19qj2pLEzWy1kghbvaTTWLen2TGcJm1f8K63PtP"),
					share: 100
				}],
				isCollection: true,
		}
	);
}

const createSizedCollection = async (mint: string) => {
	const tx = await metaplex.nfts().migrateToSizedCollection({
		mintAddress: new PublicKey(mint),
		size: new BN(1000) as BigNumber,
	});
}

createCollectionNft();
