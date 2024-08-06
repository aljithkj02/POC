import { TokenWithBalance } from "@/hooks/useTokens";
import { SUPPORTED_TOKENS, TokenDetails } from "@/lib/constants"
import { ChangeEvent, useCallback, useState } from "react"
import { PrimaryButton } from "./atoms/PrimaryButton";

const SwapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
    </svg>
) 

export const SwapTab = ({ balances }: { balances: TokenWithBalance[] }) => {
    const [baseAsset, setBaseAsset] = useState(SUPPORTED_TOKENS[0]);
    const [quoteAsset, setQuoteAsset] = useState(SUPPORTED_TOKENS[1]);
    const [baseAmount, setBaseAmount] = useState(0);
    const [quoteAmount, setQuoteAmount] = useState(0);

    const  handleBaseAsset = (asset: TokenDetails) => {
        if (asset.name !== quoteAsset.name) {
            setBaseAsset(asset);
        }
    }
    const  handleQuoteAsset = (asset: TokenDetails) => {
        if (asset.name !== baseAsset.name) {
            setQuoteAsset(asset);
        }
    }

    const subtitle = useCallback((asset: TokenDetails) => {
        const token = balances.find(x => x.name === asset.name); 

        if (token) {
            return `${token.balance} ${token.name}`;
        }
        return "";
    }, []);

    return (
        <div className="bg-[#FAFCFE] px-8 pb-8 rounded-lg">
            <p className="text-gray-700 font-bold text-2xl">Swap Tokens</p>

            <div className="mt-2 relative">
                <SwapInput token={baseAsset} oppositeToken={quoteAsset} onChange={handleBaseAsset} 
                    roundedTop={true} roundedBottom={false} subtitle={subtitle(baseAsset)}
                    balance={balances.find(x => x.name === baseAsset.name)?.balance || 0}
                    amount={baseAmount}
                    onAmountChange={(newAmount) => setBaseAmount(newAmount)}
                />
                <div className="rounded-[50%] bg-white shadow-xl inline-block p-[5px] border border-gray-300 absolute left-[50%] top-[43%] cursor-pointer"
                    onClick={() => {
                        const token = quoteAsset;
                        setQuoteAsset(baseAsset);
                        setBaseAsset(token);
                    }}
                >
                    <SwapIcon />
                </div>
                <SwapInput token={quoteAsset} oppositeToken={baseAsset} onChange={handleQuoteAsset} 
                    roundedTop={false} roundedBottom={true} subtitle={subtitle(quoteAsset)}
                    amount={quoteAmount}
                    onAmountChange={(newAmount) => setQuoteAmount(newAmount)}
                />
            </div>

            <div className="flex mt-4 justify-end">
                <PrimaryButton onClick={() => {}}>
                    Swap
                </PrimaryButton>
            </div>
        </div>
    )
}

const SwapInput = ({ token, onChange, oppositeToken, roundedTop, roundedBottom, subtitle, balance, amount, onAmountChange }: { token: TokenDetails, oppositeToken: TokenDetails, onChange: (asset: TokenDetails) => void,
    roundedTop: boolean, roundedBottom: boolean, subtitle: string, balance?: number, amount: number, onAmountChange: (value: number) => void
}) => {
    const handleOnChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const item = SUPPORTED_TOKENS.find((t) => t.name === e.target.value);
        if (item) {
            onChange(item);
        }
    }

    return (
        <div className={`border p-4 flex justify-between ${roundedTop ? 'rounded-t-lg border-gray-700': ''} ${roundedBottom ? 'rounded-b-lg': ''}`}>
            <div className="w-[50%]">
                <p className="text-[12px] text-gray-700 font-semibold">You Pay:</p>
                <select value={token.name} onChange={handleOnChange}
                    className="px-4 py-2 rounded-md mt-2 outline-none"
                >
                    {
                        SUPPORTED_TOKENS.map((item) => {
                            if (item.name === oppositeToken.name) return null;
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
                
                <div className="flex items-center gap-1 mt-1">
                    <p className="text-[12px] text-gray-500">Current balance: </p>
                    <p className="text-[12px] text-gray-500 font-semibold"> {subtitle} </p>
                </div>
            </div>

            <div className="flex w-[50%] flex-col items-end">
                { 
                    roundedTop && (amount > (balance || 0)) && <div className="px-2 py-[1px] rounded-lg bg-red-100 mb-1">
                        <span className="text-red-500 text-[12px] font-semibold block">Insufficient Funds</span>
                    </div> 
                }

                <input type="number" dir="rtl" autoFocus={roundedTop} value={amount}
                    className={`text-4xl w-full border-none outline-none ${roundedTop && (amount > (balance || 0)) ? 'text-red-500': 'text-gray-400'}`}
                    onChange={(e) => {
                        if (roundedTop) {
                            onAmountChange(+e.target.value)
                        }
                    }}
                />
            </div>
        </div>
    )
}