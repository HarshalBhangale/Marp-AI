import { Inter } from 'next/font/google'
import './globals.css'
import { StarknetProvider } from '@/components/starknet-provider'

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
          {children}
        </StarknetProvider>
      </body>
    </html>
  )
}
