"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Download } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Game } from '../types/game'
import { formatBytes } from '../lib/utils'

interface GameGridProps {
  type: 'latest' | 'popular' | 'all'
  limit?: number
  category?: string
  page?: number
  sortBy?: string
}

const GameGrid = ({ type, limit = 10, category, page = 1, sortBy = 'newest' }: GameGridProps) => {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [totalGames, setTotalGames] = useState(0)
  
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true)
      try {
        // Calculăm offset-ul pentru paginație
        const offset = (page - 1) * limit
        
        // Construim query-ul de bază
        let query = supabase
          .from('games')
          .select('*', { count: 'exact' })
        
        // Aplicăm sortarea în funcție de parametrul sortBy
        if (sortBy === 'newest') {
          query = query.order('created_at', { ascending: false })
        } else if (sortBy === 'oldest') {
          query = query.order('created_at', { ascending: true })
        } else if (sortBy === 'name-asc') {
          query = query.order('title', { ascending: true })
        } else if (sortBy === 'name-desc') {
          query = query.order('title', { ascending: false })
        } else if (sortBy === 'downloads') {
          query = query.order('download_count', { ascending: false })
        } else if (type === 'latest') {
          // Fallback la tipul de grid dacă sortBy nu este specificat
          query = query.order('created_at', { ascending: false })
        } else if (type === 'popular') {
          query = query.order('download_count', { ascending: false })
        }
        
        // Aplicăm filtrul pentru categorie dacă există
        if (category) {
          query = query.contains('genre', [category])
        }
        
        // Aplicăm paginația
        query = query.range(offset, offset + limit - 1)
        
        // Executăm query-ul
        const { data, error, count } = await query
        
        if (error) {
          console.error('Error fetching games:', error)
          return
        }
        
        setGames(data || [])
        setTotalGames(count || 0)
      } catch (error) {
        console.error('Error in fetchGames:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchGames()
  }, [type, limit, category, page])
  
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-game-accent"></div>
      </div>
    )
  }
  
  if (games.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-500">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <path d="M12 12h.01" />
            <path d="M17 12h.01" />
            <path d="M7 12h.01" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Games Available</h3>
        <p className="text-gray-400">We couldn't find any games in the database. Add games from the admin panel.</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="games-grid">
        {games.map((game) => (
          <div key={game.id} className="game-card bg-game-gray rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-[1.02] border border-gray-800">
            <Link href={`/games/${game.slug}`} className="block">
              <div className="relative aspect-video bg-game-darker">
                <Image
                  src={game.image || 'https://placehold.co/600x400/1f2937/FFFFFF/png?text=No+Image'}
                  alt={game.title}
                  width={600}
                  height={338}
                  className="w-full h-full object-cover"
                  priority
                />
                
                {/* Game size badge */}
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
                  {formatBytes(game.size_bytes, 2, true)}
                </div>
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{game.title}</h3>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {Array.isArray(game.genre) && game.genre.length > 0 ? (
                    game.genre.slice(0, 2).map((g, i) => (
                      <span key={i} className="bg-game-accent bg-opacity-20 text-game-accent text-xs px-2 py-1 rounded-md">{g}</span>
                    ))
                  ) : (
                    <span className="bg-game-accent bg-opacity-20 text-game-accent text-xs px-2 py-1 rounded-md">Game</span>
                  )}
                  {game.version && (
                    <span className="bg-blue-900 bg-opacity-30 text-blue-400 text-xs px-2 py-1 rounded-md">{game.version}</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">View Details</span>
                  <div className="flex-shrink-0 bg-game-accent hover:bg-opacity-80 text-white p-2 rounded-full transition-colors hover:shadow-lg">
                    <Download className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      {/* Expose total number of games for pagination */}
      <div className="hidden">
        <span id="total-games">{totalGames}</span>
      </div>
    </div>
  )
}

export default GameGrid
