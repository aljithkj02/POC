import { ProfileCard } from "@/components/ProfileCard";
import db from '@/db'
import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";

async function getUserWallet() {
    const session = await getServerSession(authConfig);

    if (!session?.user) return null;

    
    const userWallet = await db.solWallet.findUnique({
        where: {
            userId: session?.user?.uid || '1'
        },
        select: {
            publicKey: true
        }
    })

    if (!userWallet) {
        return {
            error: "No solana wallet found associated to the user"
        }
    }
    
    return { error: null, userWallet };
}

export default async function Dashboard() {
    const userWalletInfo = await getUserWallet();
    
    console.log({userWalletInfo})

    if (userWalletInfo?.error || !userWalletInfo?.userWallet?.publicKey) {
        return (
            <p className="text-red-500 text-center mt-10">No Solana Wallet found!</p>
        )
    }

    return (
        <div>
            <ProfileCard publicKey={userWalletInfo.userWallet?.publicKey} />
        </div>
    )
}