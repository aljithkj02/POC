"use client"

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
            if (!copied) clearInterval(intervalId);
            setCopied(false)
        }, 2000);

        return () => clearInterval(intervalId);
    }, [copied])

    console.log(session.data.user)

    return (
        <div>
            <div className="max-w-3xl shadow-xl rounded-lg p-8 mx-auto mt-10 bg-white">
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
                        <p className="text-6xl font-bold">₹0</p>
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
        </div>
    )
}
