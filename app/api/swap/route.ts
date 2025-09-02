import { authConfig } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import db from "@/app/db";
import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";

export async function POST(req: NextRequest) {
  // 🔹 Use mainnet
  const connection = new Connection("https://api.mainnet-beta.solana.com");

  const data: { quoteResponse: any } = await req.json();

  const session = await getServerSession(authConfig);
  if (!session?.user) {
    return NextResponse.json({ message: "You are not logged in" }, { status: 401 });
  }

  const solWallet = await db.solWallet.findFirst({
    where: { userId: session.user.uid },
  });

  if (!solWallet) {
    return NextResponse.json({ message: "Couldn’t find associated Solana wallet" }, { status: 401 });
  }

  // 🔹 Use Jupiter Lite free swap endpoint
  const { swapTransaction } = await (
    await fetch("https://lite-api.jup.ag/swap/v1/swap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quoteResponse: data.quoteResponse,
        userPublicKey: solWallet.publicKey,
        wrapAndUnwrapSol: true,
      }),
    })
  ).json();

  console.log("Jup returned txn");

  // 🔹 Deserialize and sign
  const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
  const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

  // 🔹 Sign with DB private key
  const privateKey = getPrivateKeyFromDb(solWallet.privateKey);
  transaction.sign([privateKey]);

  // 🔹 Get latest blockhash to prevent expiration
  const latestBlockHash = await connection.getLatestBlockhash();

  // 🔹 Send transaction
  const rawTransaction = transaction.serialize();
  const txid = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true,
    maxRetries: 2,
  });

  // 🔹 Confirm transaction
  await connection.confirmTransaction(
    {
      signature: txid,
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    },
    "confirmed"
  );

  return NextResponse.json({ txid });
}

function getPrivateKeyFromDb(privateKey: string) {
  const arr = privateKey.split(",").map(Number);
  const privateKeyUintArr = Uint8Array.from(arr);
  return Keypair.fromSecretKey(privateKeyUintArr);
}