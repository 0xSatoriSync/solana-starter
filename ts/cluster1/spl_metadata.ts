import wallet from "../../wallets/turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address
const mint = publicKey("8MeovqDNj1M7qCdzJ1uaAUvQrCdSn2E9f5o95dPwMPyo")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {

        // Create metadata account accounts
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint: mint,
            mintAuthority: signer
        }

        // Create metadata account data
        let data: DataV2Args = {
            name: "Turbin3",
            symbol: "TURB",
            uri: "https://turbin3.com",
            sellerFeeBasisPoints: 500,
            creators: null,
            collection: null,
            uses: null
        }

        // Create metadata account args
        let args: CreateMetadataAccountV3InstructionArgs = {
            data: data,
            isMutable: true,
            collectionDetails: null,
        }

        // Create metadata account transaction
        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,  // spreads: { mint, mintAuthority }
                ...args      // spreads: { data, isMutable, collectionDetails }
            }
        )

        // Send and print metadata account transaction
        let result = await tx.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature));

    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();

// Latest Output:
// RbUBA23mfTweBNqxJ1j6842SwVkyeNrPsN2G4cVD1uHcNtCXAd1BX1zT3x39pWcnVaxdGmEVMNVtNezorSgLH7V