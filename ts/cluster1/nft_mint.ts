import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../../wallets/turbin3-wallet.json"
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);
const metadata_uri = "https://devnet.irys.xyz/C2WHtgsrh1wyvF2xdg7AuLJRz7Tn4vLRGb4tKeTyiHQc";

(async () => {
    let tx = createNft(umi, {
        mint: mint,
        name: "Llama Rug",
        symbol: "LLAMARUG",
        uri: metadata_uri,
        sellerFeeBasisPoints: percentAmount(10),
        creators: [{
            address: keypair.publicKey,
            verified: false,
            share: 100
        }]
    });
    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);
    
    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)
    console.log("Mint Address: ", mint.publicKey);
})();

// Succesfully Minted! Check out your TX here:
// https://explorer.solana.com/tx/4Sy9BMtXZdrT8M5d2vSd9sf6Z3w7Ni86Xea3PsueBKGQJyuEexqu9wsDad1JKU1hV6r1RXFWRuNfuqua2VQQ6eDC?cluster=devnet
// Mint Address:  H1aYDg56NBrFRfUC2uUoHevSg486Uo96zTRq6okrQAgR