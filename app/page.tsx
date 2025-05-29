"use client";

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import MostRequestedGames from '../components/most-requested-games'
import LoadingSpinner from '../components/ui/loading-spinner'
import LoadingScreen from '../components/loading-screen'

export default function Home() {
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Simulăm încărcarea paginii
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  
  if (loading) {
    return <LoadingScreen />
  }
  return (
    <>
      <main className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
        {/* Hero section with animated elements */}
        <div className="relative z-20 text-center max-w-4xl px-4 py-16">
          <div className="relative mb-8 inline-block">
            {/* Animated glow effect behind logo */}
            <div className="absolute -inset-4 bg-gradient-to-r from-game-accent via-game-neon to-game-blue rounded-full blur-xl opacity-50 animate-slow-pulse"></div>
            
            <Image 
              src="/images/logo.svg" 
              alt="GameRipple Logo" 
              width={220} 
              height={220} 
              className="relative z-10 animate-float"
            />
            
            {/* Decorative circles */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-game-neon/30 rounded-full blur-md animate-float"></div>
            <div className="absolute -bottom-4 -left-8 w-16 h-16 bg-game-accent/20 rounded-full blur-md animate-slow-pulse"></div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
            Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-game-accent via-game-accent-light to-game-neon animate-glow inline-block">GameRipple</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Your ultimate destination for pre-installed, compressed PC games.
            <span className="block mt-2 text-game-neon font-semibold">No installation hassle, just download and play!</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-8">
            <Link 
              href="/browse" 
              className="btn-primary group"
            >
              <span>Browse Games</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <Link 
              href="/top-games" 
              className="btn-secondary group"
            >
              <span>Top Games</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          
          {/* Floating game controller decorative element */}
          <div className="absolute -bottom-16 -right-16 opacity-10 md:opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="text-game-accent">
              <path d="M6 12h4m-2-2v4" />
              <path d="M15 11h.01" />
              <path d="M18 10h.01" />
              <path d="M17.5 15a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
              <path d="M22 5V2l-5.9 5.9" />
              <path d="M7.5 13.5 22 7" />
              <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2c.5 0 1 .042 1.5.12" />
            </svg>
          </div>
        </div>
      </main>

      
      {/* Most Requested Games Section */}
      <div className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-game-accent/5 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="section-title mb-10">Most Requested Games</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="glass-card p-8 relative overflow-hidden group">
                {/* Decorative elements */}
                <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-game-accent/10 rounded-full blur-xl group-hover:bg-game-accent/20 transition-all duration-500"></div>
                
                <h3 className="text-2xl font-bold mb-4 text-white relative z-10">Can't find your favorite game?</h3>
                <p className="text-lg mb-8 text-gray-300 max-w-2xl relative z-10">Let us know what games you'd like to see on GameRipple! We regularly update our library based on user requests and prioritize the most popular ones.</p>
                
                <Link 
                  href="/request-game" 
                  className="btn-primary inline-flex relative z-10 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 9v6m-3-3h6" />
                    <path d="M5 12a7 7 0 1 0 14 0 7 7 0 0 0-14 0z" />
                  </svg>
                  <span>Request a Game</span>
                </Link>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <MostRequestedGames />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
