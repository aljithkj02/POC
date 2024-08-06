"use client"

import { useTokens } from "@/hooks/useTokens";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProfileCardProps {
    publicKey: string;
}

export const ProfileCard = ({ publicKey }: ProfileCardProps) => {
    const session = useSession();
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const { loading, tokenBalances } = useTokens(publicKey);

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

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCopied(false)
        }, 2000);

        return () => clearInterval(intervalId);
    }, [])

    console.log(tokenBalances)


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
                </div>

                <div className="bg-[#FAFCFE] p-8 rounded-lg">
                    <p className="font-semibold py-2 px-4 border-b-2 border-b-black inline-block">Tokens</p>

                    <div className="my-5 flex flex-col gap-2">
                        { tokenBalances.tokens.map((item) => {
                            return (<div className="flex justify-between hover:bg-gray-50 transition-all cursor-pointer">
                                <div className="flex gap-2 items-center">
                                    <img src={item.image} alt={item.name} 
                                        className={`w-10 rounded-[50%] p-1 ${item.name === 'SOL' ? 'bg-black p-[9px]': ''}`}
                                    />

                                    <div>
                                        <p className="text-sm font-semibold">{item.name}</p>
                                        <p className="text-[12px] text-gray-500">1 {item.name} = {(item.price as Number).toFixed(2) }</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="font-semibold">${item.usdBalance}</p>
                                </div>
                            </div>)
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
