"use client"

import { useTokens } from "@/hooks/useTokens";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TokensTab } from "./TokensTab";
import { SwapTab } from "./SwapTab";

interface ProfileCardProps {
    publicKey: string;
}

enum Tab {
    TOKENS = "tokens",
    SEND = "send",
    ADD_FUNDS = "add_funds",
    WITHDRAW = "withdraw",
    SWAP = "swap"
}

const allTabs = [
    {
        id: Tab.TOKENS,
        name: "Tokens"
    },
    {
        id: Tab.SEND,
        name: "Send"
    },
    {
        id: Tab.ADD_FUNDS,
        name: "Add Funds"
    },
    {
        id: Tab.WITHDRAW,
        name: "Withdraw"
    },
    {
        id: Tab.SWAP,
        name: "Swap"
    },
]

export const ProfileCard = ({ publicKey }: ProfileCardProps) => {
    const session = useSession();
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const { loading, tokenBalances } = useTokens(publicKey);
    const [tab, setTab] = useState<Tab>(Tab.TOKENS);

    if (session.status === 'loading') {
        return (
            <div className="mt-28">
                <p className="text-2xl text-center">Loading...</p>
            </div>
        )
    }

    if (!session.data?.user) {
        router.push('/');
        return null;
    }

    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         setCopied(false)
    //     }, 2000);

    //     return () => clearInterval(intervalId);
    // }, [])


    return (
        <div>
            <div className="max-w-3xl shadow-xl rounded-lg mx-auto mt-10">
                <div className="bg-white p-8 rounded-lg">
                    <div className="flex gap-5 items-center">
                        <img src={session.data?.user?.image || undefined} alt="Profile picture" 
                            className="w-16 rounded-[50%]"
                        />

                        <p className="text-2xl font-semibold text-gray-600"> Welcome back, {session.data?.user?.name }!</p>
                    </div>

                    <div className="my-5">
                        <p className="text-gray-500 text-sm">DCEX Account Assets</p>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-end gap-3">
                            <p className="text-6xl font-bold">₹{tokenBalances.totalBalance}</p>
                            <p className="text-gray-500 text-4xl font-bold pb-1">INR</p>
                        </div>

                        <div className="px-4 py-2 rounded-2xl bg-gray-200 cursor-pointer hover:bg-gray-300 transition-all">
                            <p className="text-[12px] text-gray-600"
                                onClick={() => {
                                    navigator.clipboard.writeText(publicKey);
                                    setCopied(true)
                                }}
                            >
                                { copied ? 'Copied': 'Your Wallet Address'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-5 gap-2">
                        { allTabs.map((item) => {
                            return (
                                <button key={item.id} onClick={() => setTab(item.id)}
                                    className={`col-span-1 p-[10px] rounded-md font-semibold transition-all ${item.id === tab ? 'bg-[#007CBF] text-[#E6F2F9] hover:bg-[#007cbff1]': 'bg-[#E6F2F9] text-[#007CBF] hover:bg-[#d4e8f5]'}`}
                                >
                                    { item.name }
                                </button>
                            )
                        })}
                    </div>
                </div>

               { tab === Tab.TOKENS && <TokensTab tokens={tokenBalances.tokens} />}
               { tab === Tab.SWAP && <SwapTab balances={tokenBalances.tokens} />}
            </div>
        </div>
    )
}
