import { keypairIdentity, Metaplex } from "@metaplex-foundation/js";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import dotenv from 'dotenv'
dotenv.config();

const publicKey = process.argv[2]

console.log(publicKey)
const connection = new Connection(process.env.RPC);
const metaplex = new Metaplex(connection);
const keypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.CREATOR_KEY)))
//console.log(metaplex);
console.log(keypair.publicKey.toBase58())
const verify = async () => {
	metaplex.use(keypairIdentity(keypair));
	const tx = await metaplex.nfts().verifyCreator({
		mintAddress: new PublicKey(publicKey),
			creator: keypair
	});
	console.log(tx)
}
verify();
