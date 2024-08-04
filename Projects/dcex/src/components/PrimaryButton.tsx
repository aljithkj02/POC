"use client"
import { ReactNode } from "react";

interface PrimaryButtonProps {
    onClick: () => void;
    children: ReactNode
}

export const PrimaryButton = ({ children, onClick }: PrimaryButtonProps) => {
    return (
        <button 
            onClick={onClick}
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
        >
            {children}
        </button>
    )
}
