// apps/chat-assistant/src/app/layout.tsx

import Providers from './providers'
import './global.css'
import { ReactNode } from 'react'
// import { CursorContainer } from './CursorContainer'; <CursorContainer />

function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-whiteSoft text-black min-h-screen overflow-x-hidden">
        
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
