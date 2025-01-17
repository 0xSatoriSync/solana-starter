import wallet from "../../wallets/turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader({address: "https://devnet.irys.xyz/"}));
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://developers.metaplex.com/token-metadata/token-standard

        const image = "https://devnet.irys.xyz/FdF8JRefYWFaJQv2Wg9Z5xe2z2xL85mJ1WxL47wnSnor"
        const metadata = {
            name: "Llama Rug",
            symbol: "LLAMARUG",
            description: "A serene llama on a rug.",
            image: image,
            attributes: [
                {trait_type: 'Rarity', value: 'Legendary'},
                {trait_type: 'Rug', value: 'Turkish'},
                {trait_type: 'Face', value: 'Serene'}
            ],
            properties: {
                files: [
                    {
                        type: "image/jpeg",
                        uri: image
                    },
                ]
            }
        };
        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your metadata URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();

// Your metadata URI:  https://devnet.irys.xyz/C2WHtgsrh1wyvF2xdg7AuLJRz7Tn4vLRGb4tKeTyiHQc