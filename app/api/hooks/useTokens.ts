import { TokenDetails } from "@/app/lib/constants";
import axios from "axios";
import { useEffect, useState } from "react";

export interface tokenbalanceprops extends TokenDetails{
    balance: string;
    usdBalance: string;
}

export const useTokens = (address : string) => {

    const [tokenBalances,setTokenBalances] = useState<{
        totalBalance: string,
        tokens: tokenbalanceprops[],
    } | null >( null)

    const [loading,setLoading] = useState(true)

    useEffect(() => {
        console.log("before the response data")
        axios.get(`/api/tokens?address=${address}`)
        .then(res=> {setTokenBalances(res.data);
            console.log("response data",res.data);
        });
        setLoading(false)
    },[address])
    return {tokenBalances,loading}
};
