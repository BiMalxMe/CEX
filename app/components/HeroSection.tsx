"use client"
import { signIn, useSession } from "next-auth/react"
import { SecondaryButton } from "./Button"
import { useRouter } from "next/navigation"
import Image from "next/image"

export const Hero = () => {
    const { data: session } = useSession()
    const router = useRouter()

    return (
        <section className="flex flex-col items-center text-center px-4 py-16">
            {/* Heading */}
            <div className="text-3xl sm:text-5xl font-semibold flex flex-col sm:flex-row items-center justify-center gap-2">
                <span>The Nepalese Cryptocurrency</span>
                <span className="text-blue-500">Revolution</span>
            </div>

            {/* Subtext */}
            <p className="pt-4 text-lg sm:text-2xl text-slate-600 max-w-2xl">
                Create a frictionless wallet from Nepal with just Google Account.
            </p>
            <p className="pt-2 text-lg sm:text-2xl text-slate-600 max-w-2xl">
                Convert your NPR into Cryptocurrency
            </p>

            {/* CTA Button */}
            <div className="pt-6 flex justify-center">
                {session ? (
                    <SecondaryButton
                        className="px-5 py-2 text-sm sm:text-base"
                        onClick={() => router.push("dashboard")}
                    >
                        Go to Dashboard
                    </SecondaryButton>
                ) : (
                    <SecondaryButton
                        className="px-5 py-2 text-sm sm:text-base"
                        onClick={() => signIn("google")}
                    >
                        Login With Google
                    </SecondaryButton>
                )}
            </div>

            {/* Decorative Divider and Info Text */}
            <div className="w-full flex flex-col items-center mt-12 mb-12 px-4">
    {/* Gradient Divider */}
    <div className="w-28 h-1 rounded-full mb-6 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 shadow-md"></div>

    {/* Card */}
    <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl px-8 py-6 max-w-2xl text-center transition-transform hover:-translate-y-2 hover:shadow-2xl duration-300">
        <h3 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-4">
            See How It Works
        </h3>
        <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
            Instantly swap, withdraw, and manage your crypto assets with a simple, intuitive interface. 
            Enjoy seamless transactions, real-time updates, and a smooth experience designed specifically for users in Nepal.
        </p>
    </div>
</div>


            {/* Preview Images */}
            <div className="relative mt-8 w-full max-w-5xl flex justify-center">
                {/* Main center image */}
                <Image
                    src="/swap.png"
                    alt="Swap Preview"
                    width={600}
                    height={400}
                    className="rounded-xl shadow-xl relative z-20 transition-transform duration-500 hover:scale-105 hover:-translate-y-2"
                />

                {/* Left image */}
                <Image
                    src="/withdraw.png"
                    alt="Withdraw Preview"
                    width={450}
                    height={300}
                    className="rounded-xl shadow-lg absolute -left-10 top-10 hidden sm:block z-10 transition-transform duration-500 hover:scale-105 hover:-translate-y-2"
                />

                {/* Right image */}
                <Image
                    src="/tokens.png"
                    alt="Tokens Preview"
                    width={450}
                    height={300}
                    className="rounded-xl shadow-lg absolute -right-10 top-10 hidden sm:block z-10 transition-transform duration-500 hover:scale-105 hover:-translate-y-2"
                />
            </div>
        </section>
    )
}
