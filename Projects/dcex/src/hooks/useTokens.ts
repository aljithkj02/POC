import { TokenDetails } from "@/lib/constants";
import axios from "axios";
import { useEffect, useState } from "react";

interface TokenWithBalance extends TokenDetails {
    balance: number;
    usdBalance: number;
}

export const useTokens = (address: string) => {
    const [tokenBalances, setTokenBalances] = useState<{
        tokens: TokenWithBalance[],
        totalBalance: number
    }>({
        tokens: [],
        totalBalance: 0
    });

    useEffect(() => {
        fetchTokenInfo();
    }, [])

    const fetchTokenInfo = async () => {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/tokens?address=' + address);
        setTokenBalances(response.data);
        setLoading(false);
    }

    const [loading, setLoading] = useState(false);

    return { tokenBalances, loading };
}