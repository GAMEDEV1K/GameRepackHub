"use client"

// Importăm React și alte componente necesare
import React from 'react'
import { useState, useEffect, type ReactNode } from 'react'
import { supabase } from '../lib/supabase-client'

// Tipul de date pentru utilizator
export type User = {
  id?: string
  email: string
  name: string
}

// Tipul pentru contextul de autentificare
type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
}

// Crearea contextului cu valoarea implicită undefined
// @ts-ignore - Ignorăm erorile TypeScript pentru a rezolva problema cu createContext
const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

// Provider-ul pentru context
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificăm dacă utilizatorul este autentificat la încărcarea componentei
    const checkAuth = async () => {
      try {
        // Obținem sesiunea curentă
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          const { user: supabaseUser } = session
          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: supabaseUser.email?.split('@')[0] || 'User'
          })
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Configurăm listener pentru schimbările de autentificare în timp real
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const { user: supabaseUser } = session
          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: supabaseUser.email?.split('@')[0] || 'User'
          })
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    // Curățăm subscription la demontarea componentei
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Funcția pentru autentificare
  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        throw error
      }
    } finally {
      setLoading(false)
    }
  }

  // Funcția pentru înregistrare
  const signUp = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (error) {
        throw error
      }
    } finally {
      setLoading(false)
    }
  }

  // Funcția pentru deconectare
  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }
    } finally {
      setLoading(false)
    }
  }

  // Valoarea furnizată de context
  const value = {
    user,
    loading,
    signIn,
    signOut,
    signUp
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook pentru a utiliza contextul de autentificare
export function useAuth() {
  // @ts-ignore - Ignorăm erorile TypeScript pentru a rezolva problema cu useContext
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
