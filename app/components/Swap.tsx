"use client"
import { ReactNode, useEffect, useState } from "react"
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens"
import { tokenbalanceprops } from "../api/hooks/useTokens";
import { PrimaryButton } from "./Button";
import axios from "axios";
import { SwapIcon } from "./SwapIcon";

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
                setQuoteAmount((Number(res.data.outAmount) / Number(10 ** quoteAsset.decimals)).toString())
                setFetchingQuote(false);
                setQuoteResponse(res.data);
            })
    }, [baseAsset, quoteAsset, baseAmount])

    return <div className="p-12 bg-slate-50">
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
            subtitle={<div className="text-slate-500 pt-1 text-sm pl-1 flex">
                <div className="font-normal pr-1">
                    current balance:
                </div>
                <div className="font-semibold">
                    {tokenBalances?.tokens.find(x => x.name === baseAsset.name)?.balance} {baseAsset.name}
                </div>
            </div>}
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
            amount={quoteAmount} 
            onSelect={(asset) => {
                setQuoteAsset(asset)
            }} 
            selectedToken={quoteAsset} 
            title={"You receive:"}  
            topBorderEnabled={false} 
            bottomBorderEnabled={true} 
        />

         <div className="flex justify-end pt-4">
            <PrimaryButton onClick={async () => {
                // send swap request to backend
                try {
                    const res = await axios.post("/api/swap", { 
                        quoteResponse
                    })
                    if (res.data.txnId) {
                        alert("swap done!");
                    }
                } catch(e) {
                    alert("error while sending a txn")
                }
            }}>swap</PrimaryButton>
        </div>
    </div>
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
    return <div className={`border flex justify-between p-6 ${topBorderEnabled ? "rounded-t-xl" : ""} ${bottomBorderEnabled ? "rounded-b-xl" : ""}`}>
        <div>
            <div className="text-xs font-semibold mb-1">
                {title}
            </div>
            <AssetSelector selectedToken={selectedToken} onSelect={onSelect} />
            {subtitle}
        </div>
        <div>
            <input 
                disabled={inputDisabled} 
                onChange={(e) => {
                    onAmountChange?.(e.target.value);
                }} 
                placeholder="0" 
                type="text" 
                className="bg-slate-50 p-6 outline-none text-4xl" 
                dir="rtl" 
                value={inputLoading ? "loading" : (amount ?? "")}  
            />
        </div>
    </div>
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
