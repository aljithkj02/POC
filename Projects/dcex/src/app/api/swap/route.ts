import { authConfig } from "@/lib/auth";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import db from '@/db'
import { Keypair, VersionedTransaction } from "@solana/web3.js";
import { connection } from "@/lib/constants";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authConfig);

    if (!session?.user) {
        return NextResponse.json({
            status: false,
            message: "You are not authorized!"
        }, {
            status: 401
        })
    }

    const solWallet = await db.solWallet.findUnique({
        where: {
            userId: session.user.uid
        }
    })
    
    if (!solWallet) {
        return NextResponse.json({
            status: false,
            message: "No wallet exist!"
        }, {
            status: 404
        })
    }

    const data: { quoteResponse: any } = await req.json();

    const response = await axios.post('https://quote-api.jup.ag/v6/swap', {
        quoteResponse: data.quoteResponse,
        userPublicKey: solWallet.publicKey,
        wrapAndUnwrapSol: true,
    })

    // deserialize the transaction
    const swapTransactionBuf = Buffer.from(response.data.swapTransaction, 'base64');
    var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    const privateKey = getPrivateKeyFromDb(solWallet.privateKey);

    // sign the transaction
    transaction.sign([privateKey]);

    // get the latest block hash
    const latestBlockHash = await connection.getLatestBlockhash();

    // Execute the transaction
    const rawTransaction = transaction.serialize()
    const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2
    });

    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid
    });

    console.log(`https://solscan.io/tx/${txid}`);

    return NextResponse.json({
        status: true,
        txid
    })
}

function getPrivateKeyFromDb(privateKey: string) {
    const arr = privateKey.split(",").map(x => Number(x));
    const privateKeyUintArr = Uint8Array.from(arr)
    const keypair = Keypair.fromSecretKey(privateKeyUintArr);
    return keypair;
}