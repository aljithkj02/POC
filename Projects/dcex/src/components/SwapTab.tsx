import { TokenWithBalance } from "@/hooks/useTokens";
import { SUPPORTED_TOKENS, TokenDetails } from "@/lib/constants"
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"
import { PrimaryButton } from "./atoms/PrimaryButton";
import axios from "axios";

const SwapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
    </svg>
) 

const Loading = () => (
    <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="Loading..." 
        className="w-20"
    />
)

export const SwapTab = ({ balances }: { balances: TokenWithBalance[] }) => {
    const [baseAsset, setBaseAsset] = useState(SUPPORTED_TOKENS[0]);
    const [quoteAsset, setQuoteAsset] = useState(SUPPORTED_TOKENS[1]);
    const [baseAmount, setBaseAmount] = useState(0);
    const [quoteAmount, setQuoteAmount] = useState(0);
    const [fetchingQuote, setFetchingQuote] = useState(false);
    const [quoteResponse, setQuoteResponse] = useState(null);

    const ref = useRef<null | NodeJS.Timeout>(null);


    useEffect(() => {
        if (baseAmount) {
            debouncer();
        } else {
            setQuoteAmount(0);
        }
    }, [baseAmount, baseAsset, quoteAsset]);

    const fetchQuoteAmount = async () => {
        setFetchingQuote(true);
        const res = await axios.get(`https://quote-api.jup.ag/v6/quote?inputMint=${baseAsset.mint}&outputMint=${quoteAsset.mint}&amount=${baseAmount * ( 10 ** baseAsset.decimals )}&slippageBps=50`);
        setQuoteAmount(Number(res.data.outAmount) / ( 10 ** quoteAsset.decimals ));
        setFetchingQuote(false);
        setQuoteResponse(res.data);
    }

    const debouncer = () => {
        if (ref.current) clearTimeout(ref.current);
        ref.current = setTimeout(fetchQuoteAmount, 1000);
    }

    const  handleBaseAsset = (asset: TokenDetails) => {
        if (asset.name !== quoteAsset.name) {
            setBaseAsset(asset);
            setBaseAmount(0);
        }
    }
    const  handleQuoteAsset = (asset: TokenDetails) => {
        if (asset.name !== baseAsset.name) {
            setQuoteAsset(asset);
            setQuoteAmount(0);
        }
    }

    const subtitle = useCallback((asset: TokenDetails) => {
        const token = balances.find(x => x.name === asset.name); 

        if (token) {
            return `${token.balance} ${token.name}`;
        }
        return "";
    }, []);

    const handleSwap = async () => {
        if (quoteResponse) {
            try {
                const res = await axios.post('http://localhost:3000/api/swap', { quoteResponse });
                if (res.data.status) {
                    alert('Swapping done!');
                }
            } catch (error) {
                alert("Error while swapping!")
            }
        }
    }

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
                        setBaseAmount(0);
                        setQuoteAmount(0);
                    }}
                >
                    <SwapIcon />
                </div>
                <SwapInput token={quoteAsset} oppositeToken={baseAsset} onChange={handleQuoteAsset} 
                    roundedTop={false} roundedBottom={true} subtitle={subtitle(quoteAsset)}
                    amount={quoteAmount}
                    onAmountChange={(newAmount) => setQuoteAmount(newAmount)}
                    fetchingQuote={fetchingQuote}
                />
            </div>

            <div className="flex mt-4 justify-end">
                <PrimaryButton onClick={handleSwap}>
                    Swap
                </PrimaryButton>
            </div>
        </div>
    )
}

const SwapInput = ({ token, onChange, oppositeToken, roundedTop, roundedBottom, subtitle, balance, amount, onAmountChange, fetchingQuote }: { token: TokenDetails, oppositeToken: TokenDetails, onChange: (asset: TokenDetails) => void,
    roundedTop: boolean, roundedBottom: boolean, subtitle: string, balance?: number, amount: number, onAmountChange: (value: number) => void, fetchingQuote?: boolean
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

                { fetchingQuote ? <Loading /> : <input type="number" dir="rtl" autoFocus={roundedTop} value={amount}
                    className={`text-4xl w-full border-none outline-none ${roundedTop && (amount > (balance || 0)) ? 'text-red-500': 'text-gray-400'}`}
                    onChange={(e) => {
                        if (roundedTop) {
                            onAmountChange(+e.target.value)
                        }
                    }}
                /> }
            </div>
        </div>
    )
}