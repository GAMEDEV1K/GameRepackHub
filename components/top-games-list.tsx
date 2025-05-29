"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import { Game } from '../types/game'

interface TopGamesListProps {
  type: 'downloads' | 'rating' | 'newest' | 'requested'
  title: string
  icon?: React.ReactNode
  badge?: {
    text: string
    color: string
  }
}

export default function TopGamesList({ type, title, icon, badge }: TopGamesListProps) {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true)
      try {
        let query = supabase
          .from('games')
          .select('*')
          .limit(5)
        
        // Aplicăm sortarea în funcție de tip
        if (type === 'downloads') {
          query = query.order('download_count', { ascending: false })
        } else if (type === 'rating') {
          // Presupunem că avem un câmp 'rating' în tabelul games
          query = query.order('rating', { ascending: false })
        } else if (type === 'newest') {
          query = query.order('created_at', { ascending: false })
        } else if (type === 'requested') {
          // Aici am putea avea un câmp 'request_count' sau similar
          // Pentru acum, vom folosi aceeași sortare ca pentru downloads
          query = query.order('download_count', { ascending: false })
        }
        
        const { data, error } = await query
        
        if (error) {
          console.error(`Error fetching ${type} games:`, error)
          return
        }
        
        setGames(data || [])
      } catch (error) {
        console.error(`Error in fetchGames for ${type}:`, error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchGames()
  }, [type])
  
  // We no longer use fallback games - we only display real games from the database
  
  return (
    <div className="bg-game-gray rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">{title}</h3>
        {badge ? (
          <span className={`text-xs bg-${badge.color}/20 text-${badge.color} px-2 py-1 rounded-full`}>
            {badge.text}
          </span>
        ) : (
          icon
        )}
      </div>
      
      {loading ? (
        <div className="py-4 flex justify-center">
          <div className="w-5 h-5 border-t-2 border-b-2 border-game-blue rounded-full animate-spin"></div>
        </div>
      ) : games.length > 0 ? (
        <ol className="space-y-3">
          {games.map((game, index) => (
            <li key={game.id} className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-game-darker text-sm font-medium">
                {index + 1}
              </span>
              <Link href={`/game/${game.slug}`} className="text-gray-300 hover:text-white transition-colors">
                {game.title}
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <div className="py-4 text-center text-gray-400">
          <p>No games available at the moment.</p>
          <p className="text-sm mt-1">Games will appear here when they are added to the database.</p>
        </div>
      )}
    </div>
  )
}
