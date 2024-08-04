"use client"
import { SecondaryButton } from "./atoms/SecondaryButton"

export const GoogleLogo = () => (
    <div className="p-2 bg-white rounded-lg me-1">
        <img src="https://tiplink.io/_next/static/media/google-no-background.207a36b0.svg" alt="Google Logo" 
            className="w-5"
        />
    </div>
)

export const Hero = () => {
    return (
        <div className="mt-14">
            <p className="font-semibold text-6xl text-center">
                The Indian Crypto Currency 
                <span className="text-blue-800 ml-3">
                    Revolution
                </span>
            </p>

            <p className="text-gray-500 text-2xl text-center my-3">
                Create a frictionless wallet from India with just a Google Account.
            </p>

            <p className="text-gray-800 text-xl text-center mt-5 font-semibold">
                Convert your INR into Crypto currency.
            </p>

            <div className="flex justify-center my-5">
                <SecondaryButton
                    onClick={() => {}}
                    prefix={<GoogleLogo />}
                >
                    Sign up with Google
                </SecondaryButton>
            </div>
        </div>
    )
}