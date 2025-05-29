"use client"

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, User as UserIcon, LogOut } from 'lucide-react'
import { useAuth } from '../context/auth-context'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="main-nav py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 animate-float">
              <div className="absolute inset-0 bg-game-accent rounded-full opacity-20 blur-md animate-pulse"></div>
              <Image src="/images/logo.svg" alt="GameRipple Logo" fill className="object-contain relative z-10" />
            </div>
            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-game-accent via-game-accent-light to-game-neon group-hover:bg-gradient-to-r group-hover:from-game-neon group-hover:to-game-accent transition-all duration-500">GameRipple</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/browse" className="nav-link group">
              <span className="relative text-white group-hover:text-game-accent transition-colors duration-300">
                Browse Games
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-game-accent group-hover:w-full transition-all duration-300"></span>
              </span>
            </Link>
            <Link href="/top-games" className="nav-link group">
              <span className="relative text-white group-hover:text-game-accent transition-colors duration-300">
                Top Games
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-game-accent group-hover:w-full transition-all duration-300"></span>
              </span>
            </Link>
            <Link href="/new-releases" className="nav-link group">
              <span className="relative text-white group-hover:text-game-accent transition-colors duration-300">
                New Releases
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-game-accent group-hover:w-full transition-all duration-300"></span>
              </span>
            </Link>
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-game-accent/20 blur-sm group-hover:bg-game-accent/30 transition-all duration-300"></div>
              <div className="relative flex items-center bg-game-gray/70 rounded-full px-3 py-2 border border-game-light-gray/30 backdrop-blur-sm overflow-hidden group-hover:border-game-accent/50 transition-all duration-300">
                <Search className="text-gray-400 w-4 h-4 mr-2 group-hover:text-game-accent transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search games..."
                  className="bg-transparent text-white w-40 focus:w-52 focus:outline-none transition-all duration-300"
                />
              </div>
            </div>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center px-3 py-2 rounded-lg bg-game-gray/50 border border-game-light-gray/30 space-x-2">
                  <div className="w-8 h-8 rounded-full bg-game-accent/20 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-game-accent" />
                  </div>
                  <span className="font-medium text-sm">{user.name}</span>
                </div>
                <Link 
                  href="/admin"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-game-gray/30 border border-game-light-gray/30 text-white hover:bg-game-accent/20 hover:border-game-accent/50 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-game-accent">
                    <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z" />
                    <path d="M16 8V5c0-1.1.9-2 2-2" />
                    <path d="M12 13h4" />
                    <path d="M12 18h6a2 2 0 0 1 2 2v1" />
                    <path d="M12 8h8" />
                    <path d="M20.5 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
                    <path d="M16.5 13a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
                    <path d="M20.5 21a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
                    <path d="M18.5 21a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
                  </svg>
                  <span className="font-medium text-sm">Admin</span>
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="btn-primary"
              >
                <UserIcon className="w-4 h-4" />
                <span>Login / Register</span>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative w-10 h-10 flex items-center justify-center focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="absolute inset-0 bg-game-accent/20 rounded-full opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-game-gray">
          <div className="container mx-auto px-4 py-2">
            <div className="flex flex-col space-y-3">
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="Search games..."
                  className="bg-game-dark text-white rounded-full px-4 py-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-game-accent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              <div onClick={handleMobileMenuClose}>
                <Link
                  href="/browse"
                  className="p-3 hover:bg-game-dark transition-colors text-center block"
                >
                  Browse Games
                </Link>
              </div>
              <div onClick={handleMobileMenuClose}>
                <Link
                  href="/top-games"
                  className="p-3 hover:bg-game-dark transition-colors text-center block"
                >
                  Top Games
                </Link>
              </div>
              {user ? (
                <button 
                  onClick={handleSignOut} 
                  className="p-3 hover:bg-game-gray transition-colors text-center w-full"
                >
                  <span className="block">Logout</span>
                  <span className="text-sm text-gray-400">({user.name})</span>
                </button>
              ) : (
                <div onClick={handleMobileMenuClose}>
                  <Link
                    href="/login"
                    className="p-3 bg-game-accent hover:bg-opacity-80 transition-colors text-center block"
                  >
                    Login / Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
