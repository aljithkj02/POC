import { Connection, PublicKey } from "@solana/web3.js";
import axios from "axios";

let LAST_UPDATED: number | null = null;
let prices: Record<string, { price: number }> = {};
const TOKEN_PRICE_REFRESH_INTERVAL = 60 * 1000;

export interface TokenDetails {
    name: string;
    mint: string;
    native: boolean;
    image: string;
    decimals: number;
}

export const SUPPORTED_TOKENS: TokenDetails[] = [
    {
        name: "USDC",
        mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        native: false,
        image: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=032",
        decimals: 6
    },
    {
        name: "USDT",
        mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
        native: false,
        image: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=032",
        decimals: 6
    },
    {
        name: "SOL",
        mint: "So11111111111111111111111111111111111111112",
        native: true,
        image: "https://cryptologos.cc/logos/solana-sol-logo.png?v=032",
        decimals: 9
    }
]

export const connection = new Connection("https://api.mainnet-beta.solana.com");

export const getSupportedToken = async () => {
    if (!LAST_UPDATED || new Date().getTime() - LAST_UPDATED < TOKEN_PRICE_REFRESH_INTERVAL) {
        const response = await axios.get('https://price.jup.ag/v6/price?ids=SOL,USDC,USDT');
        prices = response.data.data;
        LAST_UPDATED = new Date().getTime();
    }

    return SUPPORTED_TOKENS.map(token => {
        return {
            ...token,
            price: prices[token.name].price
        }
    })
}