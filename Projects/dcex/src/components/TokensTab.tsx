import { TokenWithBalance } from '@/hooks/useTokens'
import React from 'react'

interface TokensTabProps {
    tokens: TokenWithBalance[]
}

export const TokensTab = ({ tokens }: TokensTabProps) => {
    return (
        <div className="bg-[#FAFCFE] p-8 rounded-lg">
            <p className="font-semibold py-2 px-4 border-b-2 border-b-black inline-block">Tokens</p>

            <div className="my-5 flex flex-col gap-2">
                { tokens.map((item) => {
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
    )
}
