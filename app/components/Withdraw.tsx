"use client"
import { useState } from "react"
import { tokenbalanceprops } from "../api/hooks/useTokens"
import { PrimaryButton } from "./Button"
import { toast } from "react-toastify"
import axios from "axios"
import { AlertTriangle } from "lucide-react"

export function Withdraw({ publicKey, tokenBalances }: {
    publicKey?: string;
    tokenBalances : {
        totalBalance: number,
        tokens: tokenbalanceprops[]
    } | null;
}) {
    const [amount, setAmount] = useState<string>("")
    const [receiver, setReceiver] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [showBankModal, setShowBankModal] = useState(false)

    const userBalance = tokenBalances?.tokens.find(x => x.name === "SOL")?.balance || 0

    const handleWithdrawToWallet = async () => {
        if (!publicKey) {
            toast.error("Please connect your wallet first!")
            return
        }

        if (!receiver || receiver.length < 32) {  
            toast.error("Enter a valid Solana address!")
            return
        }

        if (!amount || Number(amount) <= 0) {
            toast.error("Enter a valid amount!")
            return
        }

        if (Number(amount) > Number(userBalance)) {
            toast.error("Insufficient SOL balance!")
            return
        }

        try {
            setLoading(true)
            const res = await axios.post("/api/send", {
                amount: Number(amount),
                to: receiver,
                from: publicKey,
            })

            if (res.data?.success) {
                toast.success(`Withdrew ${amount} SOL to ${receiver}`)
                setAmount("")
                setReceiver("")
            } else {
                toast.error(res.data?.message || "Withdraw failed!")
            }
        } catch (err) {
            toast.error("Error while sending transaction!")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto p-8 bg-gray-50 rounded-2xl shadow-lg flex flex-col gap-6">
            {/* header */}
            <div className="flex items-center gap-2 p-3 bg-yellow-100 text-yellow-700 rounded-lg border border-yellow-300">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm font-medium">
                    ⚠️ Only SOL transfers are supported. Bank withdrawals are restricted in Nepal.
                </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-800">Withdraw SOL</h1>
            <p className="text-gray-600 text-sm">You can withdraw SOL to an external wallet. Bank withdrawals are currently disabled.</p>

            {/* bank withdraw card */}
            <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-gray-800">Withdraw to Bank Account</h2>
                <p className="text-gray-500 text-sm">
                    Withdrawals to bank accounts are currently not allowed due to Nepal regulations.
                </p>
                <PrimaryButton onClick={() => setShowBankModal(true)}>
                    Withdraw to Bank Account
                </PrimaryButton>
            </div>

            {/* external wallet withdraw card */}
            <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-gray-800">Withdraw to External Wallet</h2>
                <p className="text-gray-500 text-sm">Send SOL directly to any valid Solana wallet address.</p>

                <div className="flex flex-col gap-4 mt-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Receiver Address</label>
                        <input
                            type="text"
                            value={receiver}
                            onChange={(e) => setReceiver(e.target.value)}
                            placeholder="Enter Solana wallet address"
                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700">Amount (SOL)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0"
                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                            Balance: {userBalance} SOL
                        </div>
                    </div>

                    <PrimaryButton onClick={handleWithdrawToWallet} disabled={loading}>
                        {loading ? "Withdrawing..." : "Withdraw"}
                    </PrimaryButton>
                </div>
            </div>

            {/* bank modal */}
            {showBankModal && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-1/2 shadow-xl flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-gray-800">Bank Withdrawals Restricted</h2>
            <p className="text-gray-600 text-lg">
                As per current regulations in Nepal, direct withdrawals to bank accounts are not allowed for cryptocurrency. 
                Please use external wallet withdrawals instead.
            </p>
            <div className="flex justify-end">
                <PrimaryButton onClick={() => setShowBankModal(false)} >
                    Okay, I Understand
                </PrimaryButton>
            </div>
        </div>
    </div>
)}

        </div>
    )
}
