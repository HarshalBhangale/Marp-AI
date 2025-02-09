import { Inter } from 'next/font/google'
import { Providers } from './providers'
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
      <body className={inter.className}>
        <Providers>
          <StarknetProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <div style={{ flex: 1, paddingTop: '4rem' }}>
                {children}
              </div>
            </div>
          </StarknetProvider>
        </Providers>
      </body>
    </html>
  )
}
