"use client"
import { ReactNode, useEffect, useState } from "react"
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens"
import { tokenbalanceprops } from "../api/hooks/useTokens";
import { PrimaryButton } from "./Button";
import axios from "axios";
import { SwapIcon } from "./SwapIcon";
import { toast } from "react-toastify";

export function Swap({publicKey, tokenBalances }: {
    publicKey?: string;
    tokenBalances : {
        totalBalance: number,
        tokens: tokenbalanceprops[]
    } | null;
}) {
    const [baseAsset, setBaseAsset] = useState(SUPPORTED_TOKENS[0])
    const [quoteAsset, setQuoteAsset] = useState(SUPPORTED_TOKENS[1])
    const [baseAmount, setBaseAmount] = useState<string>("")
    const [quoteAmount, setQuoteAmount] = useState<string>("")
    const [fetchingQuote, setFetchingQuote] = useState(false);
    const [quoteResponse, setQuoteResponse] = useState<any>(null);

    // fetch new quote whenever base amount, base asset or quote asset changes
    useEffect(() => {
        if (!baseAmount) {
            return;
        }
        setFetchingQuote(true);
        axios.get(`https://quote-api.jup.ag/v6/quote?inputMint=${baseAsset.mint}&outputMint=${quoteAsset.mint}&amount=${Number(baseAmount) * (10 ** baseAsset.decimals)}&slippageBps=50`)
        .then(res => {
            // Format quoteAmount to 2 decimal places
            const outAmount = Number(res.data.outAmount) / Number(10 ** quoteAsset.decimals);
            setQuoteAmount(outAmount.toFixed(2));
            setFetchingQuote(false);
            setQuoteResponse(res.data);
        })
        .catch(() => setFetchingQuote(false));
      
    }, [baseAsset, quoteAsset, baseAmount])

    // Helper to get the user's balance for the selected base asset
    function getBaseAssetBalance(): number {
        if (!tokenBalances) return 0;
        const token = tokenBalances.tokens.find(x => x.name === baseAsset.name);
        if (!token) return 0;
        // token.balance is a string, parse as float
        return parseFloat(token.balance);
    }

    return (
        <div className="p-12 bg-slate-50">
            <div className="text-2xl font-bold pb-4">
                swap tokens
            </div>
            <SwapInputRow 
                amount={baseAmount} 
                onAmountChange={(value: string) => {
                    setBaseAmount(value);
                }}
                onSelect={(asset) => {
                    setBaseAsset(asset)
                }} 
                selectedToken={baseAsset} 
                title={"You pay:"} 
                topBorderEnabled={true} 
                bottomBorderEnabled={false} 
                subtitle={
                    <div className="text-slate-500 pt-1 text-sm pl-1 flex">
                        <div className="font-normal pr-1">
                            current balance:
                        </div>
                        <div className="font-semibold">
                            {tokenBalances?.tokens.find(x => x.name === baseAsset.name)?.balance} {baseAsset.name}
                        </div>
                    </div>
                }
            />
            
            <div className="flex justify-center">
                {/* switch tokens (base <-> quote) */}
                <div onClick={() => {
                    let baseAssetTemp = baseAsset;
                    setBaseAsset(quoteAsset);
                    setQuoteAsset(baseAssetTemp);
                }} className="cursor-pointer rounded-full w-10 h-10 border absolute mt-[-20px] bg-white flex justify-center pt-2">
                    <SwapIcon />
                </div>
            </div>

            <SwapInputRow 
                inputLoading={fetchingQuote} 
                inputDisabled={true} 
                // Only show up to 2 decimal places for quoteAmount
                amount={quoteAmount} 
                onSelect={(asset) => {
                    setQuoteAsset(asset)
                }} 
                selectedToken={quoteAsset} 
                title={"You receive:"}  
                topBorderEnabled={false} 
                bottomBorderEnabled={true} 
                subtitle={
                    <div className="text-slate-500 pt-1 text-sm pl-1 flex">
                        <div className="font-normal pr-1">
                            estimated:
                        </div>
                        <div className="font-semibold truncate max-w-[120px] sm:max-w-[180px]">
                            {fetchingQuote
                                ? "..."
                                : (quoteAmount && quoteAsset.name
                                    ? `${quoteAmount} ${quoteAsset.name}`
                                    : `0 ${quoteAsset.name}`)}
                        </div>
                    </div>
                }
            />

            <div className="flex justify-end pt-4">
                <PrimaryButton onClick={async () => {
                    // Check for balance errors before sending swap request
                    const userBalance = getBaseAssetBalance();
                    const amountToSwap = parseFloat(baseAmount);

                    if (!tokenBalances) {
                        toast.error("No token balances found. Please connect your wallet.");
                        return;
                    }
                    if (!baseAmount || isNaN(amountToSwap) || amountToSwap <= 0) {
                        toast.error("Please enter a valid amount to swap.");
                        return;
                    }
                    if (userBalance === 0) {
                        toast.error(`You have no ${baseAsset.name} to swap.`);
                        return;
                    }
                    if (amountToSwap > userBalance) {
                        toast.error(`Insufficient ${baseAsset.name} balance.`);
                        return;
                    }

                    // send swap request to backend
                    try {
                        const res = await axios.post("/api/swap", { 
                            quoteResponse
                        })
                        if (res.data.txnId) {
                            toast.success("Swap done!");
                        }
                    } catch(e) {
                        toast.error("Error while sending a transaction");
                    }
                }}>swap</PrimaryButton>
            </div>
        </div>
    );
}

function SwapInputRow({onSelect, amount, onAmountChange, selectedToken, title, subtitle, topBorderEnabled, bottomBorderEnabled, inputDisabled, inputLoading}: {
    onSelect: (asset: TokenDetails) => void;
    selectedToken: TokenDetails;
    title: string;
    subtitle?: ReactNode;
    topBorderEnabled: boolean;
    bottomBorderEnabled: boolean;
    amount?: string;
    onAmountChange?: (value: string) => void;
    inputDisabled?: boolean;
    inputLoading?: boolean;
}) {
    // For quote row, show only up to 2 decimal places
    let displayAmount = amount;
    if (inputDisabled && amount && !inputLoading) {
        // Only format if it's the quote row (inputDisabled is true)
        const num = Number(amount);
        if (!isNaN(num)) {
            displayAmount = num.toFixed(2);
        }
    }
    return (
        <div
            className={`border flex flex-col sm:flex-row justify-between p-4 sm:p-6 gap-4 sm:gap-0 ${
                topBorderEnabled ? "rounded-t-xl" : ""
            } ${bottomBorderEnabled ? "rounded-b-xl" : ""}`}
        >
            <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold mb-1">{title}</div>
                <AssetSelector selectedToken={selectedToken} onSelect={onSelect} />
                {subtitle}
            </div>
            <div className="flex items-center sm:items-end justify-end sm:justify-end mt-2 sm:mt-0 w-full sm:w-auto">
                <input
                    disabled={inputDisabled}
                    onChange={(e) => {
                        onAmountChange?.(e.target.value);
                    }}
                    placeholder="0"
                    type="text"
                    className="bg-slate-50 p-4 sm:p-6 outline-none text-3xl sm:text-4xl w-full sm:w-40 rounded-lg text-right"
                    dir="rtl"
                    value={inputLoading ? "..." : displayAmount ?? ""}
                    inputMode="decimal"
                    pattern="[0-9]*"
                />
            </div>
        </div>
    );
}

function AssetSelector({selectedToken, onSelect}: {
    selectedToken: TokenDetails;
    onSelect: (asset: TokenDetails) => void;
}) {
    return <div className="w-24">
        {/* token selection dropdown */}
        <select 
            value={selectedToken.name}   
            onChange={(e) => {
                const selectedToken = SUPPORTED_TOKENS.find(x => x.name === e.target.value);
                if (selectedToken) {
                    onSelect(selectedToken);
                }
            }} 
            id="tokens" 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
            {SUPPORTED_TOKENS.map(token => 
                <option key={token.name} value={token.name}>
                    {token.name}
                </option>
            )}
        </select>
    </div>
}