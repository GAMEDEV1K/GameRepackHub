"use client"

import { useState, useEffect } from 'react'
import GameGrid from '../../components/game-grid'
import TopGamesList from '../../components/top-games-list'
import { Trophy, Download, Star, Clock } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function TopGamesPage() {
  const [totalGames, setTotalGames] = useState(0)
  
  // Get the total number of games
  useEffect(() => {
    const getTotalGames = async () => {
      try {
        const { count } = await supabase
          .from('games')
          .select('*', { count: 'exact' })
        
        setTotalGames(count || 0)
      } catch (error) {
        console.error('Error fetching total games count:', error)
      }
    }
    
    getTotalGames()
  }, [])
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Trophy className="w-8 h-8 text-yellow-400" />
        <h1 className="text-3xl font-bold">Top PC Games</h1>
      </div>
      
      <p className="text-gray-300 max-w-3xl">
        Discover the most popular and highly-rated games on GameRepackHub. All games are pre-installed and ready to play after download.
      </p>
      
      {/* Top games stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TopGamesList 
          type="downloads" 
          title="Most Downloaded" 
          icon={<Download className="w-5 h-5 text-game-blue" />} 
        />
        
        <TopGamesList 
          type="rating" 
          title="Most Popular" 
          icon={<Star className="w-5 h-5 text-yellow-400" />} 
        />
        
        <TopGamesList 
          type="newest" 
          title="Newest Games" 
          badge={{ text: "New", color: "green-500" }} 
        />
        
        <TopGamesList 
          type="requested" 
          title="Most Requested" 
          badge={{ text: "Hot", color: "game-blue" }} 
        />
      </div>
      
      {/* Top 20 games */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Top 20 PC Games</h2>
        <GameGrid type="popular" limit={20} />
      </div>
      
      {/* Categories */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Top Games by Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports', 'Racing', 'Indie'].map((category) => (
            <a 
              key={category}
              href={`/browse?category=${category.toLowerCase()}`}
              className="bg-game-gray hover:bg-gray-700 rounded-lg p-4 text-center transition-colors"
            >
              <h3 className="font-medium mb-1">{category}</h3>
              <p className="text-sm text-gray-400">Top {category} Games</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
