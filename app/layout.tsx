import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import Header from '../components/header'
import Footer from '../components/footer'
import { AuthProvider } from '../context/auth-context'
import { ToastProvider } from '../components/ui/simple-toast'

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'] })

export const metadata: Metadata = {
  title: 'GameRipple - Pre-installed Game Downloads',
  description: 'A modern web platform for pre-installed, compressed PC game downloads',
  keywords: 'games, download games, pc games, pre-installed games, compressed games, game downloads',
  authors: [{ name: 'GameRipple Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#8A2BE2',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${outfit.className} bg-game-dark text-white antialiased selection:bg-game-accent selection:text-white`}>
        <AuthProvider>
          <ToastProvider>
            <div className="relative min-h-screen flex flex-col">
              {/* Animated background gradient */}
              <div className="fixed inset-0 bg-game-darker z-0 overflow-hidden">
                <div className="absolute -inset-[10%] opacity-30 blur-3xl bg-gradient-to-br from-game-accent/20 via-transparent to-game-blue/20 animate-slow-pulse"></div>
                <div className="absolute top-0 right-0 w-[80%] h-[50%] opacity-10 blur-3xl bg-gradient-to-bl from-game-neon/30 via-transparent to-transparent animate-slow-drift"></div>
              </div>
              
              <div className="relative z-10 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8 md:py-12">{children}</main>
                <Footer />
              </div>
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
