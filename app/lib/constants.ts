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

let LAST_UPDATED: number | null = null;
let prices: { [key: string]: { usdPrice: number } } = {};

export interface TokenDetails {
  name: string;
  mint: string;
  native: boolean;
  price: string;
  image: string;
  decimals: number;
}

export const SUPPORTED_TOKENS: TokenDetails[] = [
  {
    name: "SOL",
    mint: "So11111111111111111111111111111111111111112",
    native: true,
    price: "180",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/3/34/Solana_cryptocurrency_two.jpg",
    decimals: 9,
  },
  {
    name: "USDC",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    native: false,
    price: "1",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1vAKYEl0YffTpWSxrqEi_gmUsl-0BuXSKMQ&s",
    decimals: 6,
  },
  {
    name: "USDT",
    mint: "Es9vMFrzaCERfJjaswCv8FgbCkgtDGVm1rnUZ9weTnRS", // ✅ updated mint
    native: false,
    price: "1",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvSxrpym7ij1Hf6zQOltcDORlrJGyj1kPf3A&s",
    decimals: 6,
  },
];

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
