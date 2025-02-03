'use client'

import {PrivyProvider} from '@privy-io/react-auth'

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      appId='cm6owh66s002rlwuef0fvk51c'
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: 'https://your-logo-url',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
