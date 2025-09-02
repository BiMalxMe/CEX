import { NextResponse } from "next/server"
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js"
import { connection } from "@/app/lib/constants"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { amount, to, from } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, message: "Invalid amount" }, { status: 400 })
    }
    if (!to || to.length < 32) {
      return NextResponse.json({ success: false, message: "Invalid recipient address" }, { status: 400 })
    }
    if (!from || from.length < 32) {
      return NextResponse.json({ success: false, message: "Invalid sender address" }, { status: 400 })
    }

    // --- Setup Solana connection ---

    // --- Load server wallet ---
    const secret = process.env.SENDER_SECRET_KEY
    if (!secret) {
      return NextResponse.json({ success: false, message: "Server wallet not configured" }, { status: 500 })
    }
    const secretKey = Uint8Array.from(JSON.parse(secret))
    const payer = Keypair.fromSecretKey(secretKey)

    // --- Prepare transaction ---
    const recipient = new PublicKey(to)
    const lamports = amount * 1e9 // SOL → lamports

    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: recipient,
        lamports,
      })
    )

    // --- Send transaction ---
    const signature = await sendAndConfirmTransaction(connection, tx, [payer])

    return NextResponse.json({
      success: true,
      message: `Transaction confirmed`,
      txnId: signature,
      explorer: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    })
  } catch (err) {
    console.error("Send API error:", err)
    return NextResponse.json({ success: false, message: "Transaction failed" }, { status: 500 })
  }
}
