import { TokenDetails } from "@/app/lib/tokens";
import axios from "axios";
import { useEffect, useState } from "react";

export interface tokenbalanceprops extends TokenDetails {
  balance: string;
  usdBalance: string;
}

export const useTokens = (address: string) => {
  const [tokenBalances, setTokenBalances] = useState<{
    totalBalance: number;
    tokens: tokenbalanceprops[];
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;

    setLoading(true);
    axios
      .get(`/api/tokens?address=${address}`)
      .then((res) => {
        const data = res.data;
        setTokenBalances({

            //i had fixed here by destructuring data.totalBalance to Number
          totalBalance: Number(data.totalBalance), 
          tokens: data.tokens,
        });
      })
      .catch((err) => {
        console.error("Error fetching tokens:", err);
        setTokenBalances(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [address]);

  return { tokenBalances, loading };
};
