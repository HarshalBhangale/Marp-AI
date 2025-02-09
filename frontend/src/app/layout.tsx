import { Inter } from 'next/font/google'
import './globals.css'
import { StarknetProvider } from '@/components/starknet-provider'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Trading Bot',
  description: 'AI-powered trading assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen`}>
        <StarknetProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 pt-16">
              {children}
            </div>
          </div>
        </StarknetProvider>
      </body>
    </html>
  )
}
