import { SUPPORTED_TOKENS, TokenDetails } from "@/lib/constants"
import { useState } from "react"

export const SwapTab = () => {
    const [baseAsset, setBaseAsset] = useState(SUPPORTED_TOKENS[0]);
    const [quoteAsset, setQuoteAsset] = useState(SUPPORTED_TOKENS[1]);

    return (
        <div className="bg-[#FAFCFE] px-8 pb-8 rounded-lg">
            <p className="text-gray-700 font-bold text-2xl">Swap Tokens</p>

            <div className="mt-2">
                <SwapInput token={baseAsset} />
            </div>
        </div>
    )
}

const SwapInput = ({ token }: { token: TokenDetails}) => {
    return (
        <div className="border-2 rounded-lg p-4 flex items-center justify-between">
            <div>
                <p className="text-[12px] text-gray-700 font-semibold">You Pay:</p>
                <select value={token.name}
                    className="px-4 py-2 rounded-md mt-2 outline-none"
                >
                    {
                        SUPPORTED_TOKENS.map((item) => {
                            return (
                                <option key={item.name} value={item.name} >
                                    <div>
                                        <img src={item.image} alt={item.name} />
                                        <p> {item.name} </p>
                                    </div>
                                </option>
                            )
                        })
                    }
                </select>
            </div>
        </div>
    )
}
