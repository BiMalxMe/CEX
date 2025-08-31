import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  getAccount,
} from "@solana/spl-token";
import axios from "axios";
import { SUPPORTED_TOKENS, TokenDetails } from "./tokens";

let LAST_UPDATED: number | null = null;
let prices: { [key: string]: { usdPrice: number } } = {};

const TOKEN_PRICE_REFRESH_INTERVAL = 60 * 1000; // every 60s

export const connection = new Connection(
  "https://solana-devnet.g.alchemy.com/v2/u-HGjUk-M9HMphshm3_KH"
);

// ✅ validate address
function isValidAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

//  get balance for SOL + SPL tokens
export async function getAccountBalance(
  token: TokenDetails,
  ownerAddress: string
): Promise<number> {
  if (!ownerAddress || !isValidAddress(ownerAddress)) {
    console.error("Invalid wallet address:", ownerAddress);
    return 0;
  }

  const owner = new PublicKey(ownerAddress);

  if (token.native) {
    const balance = await connection.getBalance(owner);
    return balance / LAMPORTS_PER_SOL;
  } else {
    try {
      const ata = await getAssociatedTokenAddress(
        new PublicKey(token.mint),
        owner
      );
      const accountInfo = await getAccount(connection, ata);
      return Number(accountInfo.amount) / Math.pow(10, token.decimals);
    } catch {
      // user may not have this token account
      return 0;
    }
  }
}

export async function getSupportedTokens(address?: string) {
  if (
    !LAST_UPDATED ||
    new Date().getTime() - LAST_UPDATED > TOKEN_PRICE_REFRESH_INTERVAL
  ) {
    try {
      const ids = SUPPORTED_TOKENS.map((t) => t.mint).join(",");
      const response = await axios.get(
        `https://lite-api.jup.ag/price/v3?ids=${ids}`
      );

      prices = response.data;
      LAST_UPDATED = new Date().getTime();
      console.log("Prices:", prices);
    } catch (e) {
      console.error("Error fetching prices:", e);
    }
  }

  return Promise.all(
    SUPPORTED_TOKENS.map(async (s) => {
      const balance = address
        ? await getAccountBalance(s, address)
        : 0;

      return {
        ...s,
        price: prices[s.mint]?.usdPrice?.toString() ?? s.price,
        balance,
      };
    })
  );
}

//  test run with no wallet
getSupportedTokens().then((tokens) => console.log("Tokens:", tokens));
