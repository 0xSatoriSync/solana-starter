import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../../wallets/turbin3-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("8MeovqDNj1M7qCdzJ1uaAUvQrCdSn2E9f5o95dPwMPyo");
const token_decimals = 1_000_000n;

// Recipient address
const to = new PublicKey("5QmQLcUESZkqESWZr78UDFTjyQTfFPzVXUEmn7ZKDWW6"); // dev-wallet

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        let fromATA = await getOrCreateAssociatedTokenAccount(
            connection, 
            keypair, 
            mint, 
            keypair.publicKey
        );

        // Get the token account of the toWallet address, and if it does not exist, create it
        let toATA = await getOrCreateAssociatedTokenAccount(
            connection, 
            keypair, 
            mint, 
            to
        );

        // Transfer the new token to the "toTokenAccount" we just created
        let tx = await transfer(
            connection, 
            keypair, 
            fromATA.address, 
            toATA.address, 
            keypair.publicKey, 
            token_decimals/4n
        );

        console.log(`Transfer Tx: ${tx}`);

    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();

// Latest Output:
// Transfer Tx: 2Lm8ZtM6rtS8cfTWrqM67yeJ1zkXVs99EpNFhCDqCEnTe4BLnew92CJKkkX2axdqGCAbZAhD5AF7bG1MFHdHzQ2p