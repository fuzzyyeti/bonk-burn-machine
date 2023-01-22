# Bonk Burn Machine
This is the code behind https://mintbubble.xyz, an experimental collection to try out minting NFTs with a token and
setting an amount of the token to burn within the mint instruction. There are three parts:
* Anchor program, deployed on Solana
* Scripts to set up collections
* The mint website

Here is an example of a [mint](https://solscan.io/tx/2Hov8XACgcztovNQR95vMYcTrrW5UcpNanHgZDv7uyuqf8UBvRpT5KqqknZmjuuTKa5ExJKjme3mKFmmKQX4mdLM) using this program. If your project burns $BONK for example, the minter can verify their $BONK has been burned on Solscan immediately after the mint completes. No need to wait for the team to keep their promise to burn!

Note: You can use this to create your own collection, but I don't have it set up to use without digging into the code. You will need to look at the code, understand it, and modify it where you need to. The program is deployed on mainnet, so you can use that part as-is, if you want.

## Anchor Program
The anchor program has some the functionality of https://github.com/metaplex-foundation/metaplex-program-library/tree/master/candy-machine, but it is way simpler and includes almost none of the features of Candy Machine. I hope it is a good starting point for other people experimenting with novel collection mint ideas.

## Scripts
There is a script to create a collection that you can run with ts-node. You will need to set all your own parameters. Make sure to use ATAs for the fees and not wallet addresses.

## Website
The website is the code for https://mintbubble.xzy. It's a mess because I wanted to release as fast as humanly possible. The key part is the code in the mint folder, and you probably want to re-implement the rest.

## Here are the basic steps to create and launch a project using the deployed version of this program
* Create generative art with metadata .json files and image files
* Load the art onto shadow drive
* Set up a collection account using setup/create-collection.ts
* Create a website that uses @project-serum/anchor@0.25.0 and the IDL to mint
* Go!

## Working on the anchor program
Use
`anchor test` 
with your default solana config and the Anchor.toml set to localhost. You can use 
`anchor test --detach` 
to keep the local validator running and use explorer.solana.com to look at your accounts and transactions. You can see logs in .anchor/program-logs if you leave the validator running as well,
but you have a to wait a bit before they show up.
