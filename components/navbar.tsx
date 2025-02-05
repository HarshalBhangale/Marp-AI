"use client"

import { usePrivy } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import logo from './assets/logo.png'
export function Navbar() {
  const { login, logout, authenticated } = usePrivy()

  return (
    <nav className="fixed top-0 w-full border-b border-yellow-600/20 bg-white/80 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-left">
            <Image
              src={logo}
              alt="Logo"
              width={140}
              height={40}
              className="mr-2"
            />
            
          </div>

          {/* Wallet Button */}
          <div>
            {authenticated ? (
              <Button 
                variant="outline" 
                className="border-yellow-600/50 hover:bg-yellow-50"
                onClick={() => logout()}
              >
                Disconnect Wallet
              </Button>
            ) : (
              <Button 
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
                onClick={() => login()}
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
