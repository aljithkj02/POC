import { NextRequest, NextResponse } from "next/server";
import { getAccount, getAssociatedTokenAddress, getMint } from '@solana/spl-token'
import { connection, getSupportedToken, TokenDetails } from "@/lib/constants";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address') as unknown as PublicKey;

    const supportedTokens = await getSupportedToken();

    const balances = await Promise.all(supportedTokens.map((item) => {
        return getAccountBalance(item, address);
    }))

    const tokens = supportedTokens.map((token, index) => ({
        ...token,
        balance: balances[index],
        usdBalance: balances[index] * Number(token.price)
    }))

    return NextResponse.json({
        tokens,
        totalBalance: tokens.reduce((acc, cur) => acc + cur.usdBalance, 0)
    })
}

async function getAccountBalance(token: TokenDetails, address: PublicKey) {
    if (token.native) {
        const balance = await connection.getBalance(new PublicKey(address));
        return balance / LAMPORTS_PER_SOL;
    }

    try {
        const ata = await getAssociatedTokenAddress(new PublicKey(token.mint), address);
        const account = await getAccount(connection, ata);
        const mint = await getMint(connection, new PublicKey(token.mint));
    
        return Number(account.amount) / (10 ** token.decimals);
    } catch (error) {
        return 0;
    }
}