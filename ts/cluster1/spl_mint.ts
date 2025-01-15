import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "../../wallets/turbin3-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("8MeovqDNj1M7qCdzJ1uaAUvQrCdSn2E9f5o95dPwMPyo");

(async () => {
    try {
        // Create an ATA
        const ata = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        );
        console.log(`Your ata is: ${ata.address.toBase58()}`);

        // Mint to ATA
        const mintTx = await mintTo(
            connection,
            keypair,
            mint,
            ata.address,
            keypair.publicKey,
            token_decimals  
        );
        console.log(`Your mint txid: ${mintTx}`);
        
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()

// Latest Output:
// Your ata is: 5ymDxH6P86gBQMRL8DqxpBhdUvMAEkQpKHMtaePXYhd1
// Your mint txid: 2FPtBua1mLGZr5KUQWqL8ESzizL7tpGE1X5vgV5Lb65u6yFeJ6LCWYEVwDuJgnUE3P7URvuBTYTiVQkbRjfoPfTw