"use client"
import { ReactNode } from "react";

interface PrimaryButtonProps {
    onClick: () => void;
    children: ReactNode;
    prefix?: ReactNode
}

export const SecondaryButton = ({ children, onClick, prefix }: PrimaryButtonProps) => {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-2 text-xl font-semibold text-white bg-sky-700 hover:bg-sky-800 focus:outline-none focus:ring-4 focus:ring-gray-300 rounded-xl ${prefix ? 'p-2': 'px-6 py-3'}`}
        >
            {prefix}
            {children}
        </button>
    )
}
