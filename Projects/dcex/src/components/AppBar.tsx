"use client"
import { signIn, signOut, useSession } from "next-auth/react"
import { PrimaryButton } from "./atoms/PrimaryButton";

export const AppBar = () => {
    const session = useSession();

    console.log({session});

    return (
        <div className="px-8 py-2 border-b flex justify-between items-center">
            <div className="cursor-pointer text-xl font-bold">
                DCEX 
            </div>

            <div>
                { session.data?.user ? (
                    <PrimaryButton onClick={() => signOut()}> Logout</PrimaryButton>
                ) : (
                    <PrimaryButton onClick={() => signIn()}> Login </PrimaryButton>
                )}
            </div>
        </div>
    )
}
