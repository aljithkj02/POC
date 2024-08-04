"use client"
import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

interface ProvidersProps {
    children: ReactNode
}

export const ProvidersProps = ({ children }: ProvidersProps) => {
    return (
        <SessionProvider>
            { children }
        </SessionProvider>
    )
}
