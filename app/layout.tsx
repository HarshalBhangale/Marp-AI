import './globals.css'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import {ThemeProvider} from "@/components/theme-provider"
import {Toaster} from "@/components/ui/sonner"
import Providers from "@/components/providers"

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
  title: 'Marp AI',
  description: '',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
          </Providers>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
