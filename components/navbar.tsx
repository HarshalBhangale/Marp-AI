'use client'
import Image from 'next/image';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';
const Navbar = () => {
    const { login, ready, authenticated } = usePrivy();

    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
            {/* Left side - Marp Logo */}
            <div className="flex items-center">
                <Image
                    src="/marp-logo.png" // Make sure to add your logo in the public folder
                    alt="Marp Logo"
                    width={120}
                    height={40}
                    className="cursor-pointer"
                />
                marp ai
            </div>

            {/* Right side - Privy Connect Button */}
            <div>
                {ready && !authenticated ? (
                    <button
                        onClick={login}
                        className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Connect Wallet
                    </button>
                ) : (
                    <button
                        className="px-6 py-2 text-white bg-green-600 rounded-lg"
                    >
                        Connected
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;