import { NextRequest, NextResponse } from "next/server";
import {
  getAssociatedTokenAddress,
  getAccount,
} from "@solana/spl-token";
import { getSupportedTokens, connection } from "@/app/lib/constants";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  // ✅ if no address provided, just return tokens with price info
  if (!address || !isValidAddress(address)) {
    const supportedTokens = await getSupportedTokens();
    return NextResponse.json({
      tokens: supportedTokens.map((t) => ({
        ...t,
        balance: "0.00",
        usdBalance: "0.00",
      })),
      totalBalance: "0.00",
      error: "Invalid or missing wallet address",
    });
  }

  const supportedTokens = await getSupportedTokens();
  const balances = await Promise.all(
    supportedTokens.map((token) => getAccountBalance(token, address))
  );

  const tokens = supportedTokens.map((token, index) => ({
    ...token,
    balance: balances[index].toFixed(2),
    usdBalance: (balances[index] * Number(token.price)).toFixed(2),
  }));

  return NextResponse.json({
    tokens,
    totalBalance: tokens
      .reduce((acc, val) => acc + Number(val.usdBalance), 0)
      .toFixed(2),
  });
}

// ✅ helper: check if address is valid
function isValidAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

async function getAccountBalance(
  token: {
    name: string;
    mint: string;
    native: boolean;
    decimals: number;
  },
  address: string
) {
  if (!isValidAddress(address)) return 0;

  const owner = new PublicKey(address);

  if (token.native) {
    const balance = await connection.getBalance(owner);
    return balance / LAMPORTS_PER_SOL;
  }

  try {
    const ata = await getAssociatedTokenAddress(new PublicKey(token.mint), owner);
    const account = await getAccount(connection, ata);
    return Number(account.amount) / 10 ** token.decimals;
  } catch {
    // user doesn’t have this token account
    return 0;
  }
}
