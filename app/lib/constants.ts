import { Connection } from "@solana/web3.js";
import axios from "axios";
import { SUPPORTED_TOKENS } from "./tokens";

let LAST_UPDATED: number | null = null;
let prices: {[key: string]: {
    price: string;
}} = {};

const TOKEN_PRICE_REFRESH_INTERVAL = 60 * 1000; // every 60s

export const connection = new Connection("https://solana-devnet.g.alchemy.com/v2/u-HGjUk-M9HMphshm3_KH");

export async function getSupportedTokens() {
    if (!LAST_UPDATED || new Date().getTime() - LAST_UPDATED < TOKEN_PRICE_REFRESH_INTERVAL) {
        try {
            const response = await axios.get("https://lite-api.jup.ag/price/v3?ids=SOL,USDC,USDT");
            prices = response.data.data;
            LAST_UPDATED = new Date().getTime();
            console.log(prices)
        } catch(e) {
            console.log(e);
        }
    }
    return SUPPORTED_TOKENS.map(s => ({
        ...s,
        price: prices[s.name].price
    }))

}

getSupportedTokens();