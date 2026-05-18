import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Mission Control',
  description: 'Engineering portfolio — live system status',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} bg-[#010409]`}
        style={{ fontFamily: 'var(--font-mono), monospace' }}
      >
        {children}
      </body>
    </html>
  )
}
