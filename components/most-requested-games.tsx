"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useToast } from './ui/simple-toast'
import { supabase } from '../lib/supabase'

interface RequestedGame {
  id: string
  title: string
  request_count: number
  slug?: string
}

export default function MostRequestedGames() {
  const [requestedGames, setRequestedGames] = useState<RequestedGame[]>([])
  const [loading, setLoading] = useState(true)
  
  // Load most requested games from Supabase
  useEffect(() => {
    const loadRequestedGames = async () => {
      try {
        setLoading(true)
        
        // Query games ordered by request count
        const { data, error } = await supabase
          .from('games')
          .select('id, title, request_count, slug')
          .order('request_count', { ascending: false })
          .limit(5)  // Limit to top 5 games
        
        if (error) {
          console.error('Error loading most requested games:', error)
          return
        }
        
        // If we have data, use it; otherwise use empty array
        setRequestedGames(data || [])
      } catch (error) {
        console.error('Error in loadRequestedGames:', error)
      } finally {
        setLoading(false)
      }
    }
    
    // Call the function to load games
    loadRequestedGames()
    
    // Set up a subscription for real-time updates
    const subscription = supabase
      .channel('requested-games-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'games' }, () => {
        // Reload games when there are changes
        loadRequestedGames()
      })
      .subscribe()
    
    // Clean up subscription when component unmounts
    return () => {
      subscription.unsubscribe()
    }
  }, [])
  
  return (
    <div className="bg-game-gray rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Most Requested Games</h2>
      
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-game-accent"></div>
        </div>
      ) : requestedGames.length > 0 ? (
        <ol className="space-y-3">
          {requestedGames.map((game, index) => (
            <li key={game.id} className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-game-dark text-sm font-medium">
                {index + 1}
              </span>
              {game.slug ? (
                <Link href={`/game/${game.slug}`} className="text-gray-300 hover:text-white transition-colors">
                  {game.title}
                </Link>
              ) : (
                <span className="text-gray-300">{game.title}</span>
              )}
              <span className="text-xs bg-game-dark text-gray-400 px-2 py-1 rounded ml-auto">
                {game.request_count || 0} requests
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-gray-400 text-center py-4">No requested games yet.</p>
      )}
    </div>
  )
}
