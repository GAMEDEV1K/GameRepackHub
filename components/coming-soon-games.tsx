"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useToast } from './ui/simple-toast'
import { supabase } from '../lib/supabase'
import { config } from '../lib/config'

interface UpcomingGame {
  id: string
  title: string
  image: string
  release_date: string
  description: string
  publisher?: string
  genre?: string
}

export default function ComingSoonGames() {
  const { showToast } = useToast()
  const [notifiedGames, setNotifiedGames] = useState<string[]>([])
  const [upcomingGames, setUpcomingGames] = useState<UpcomingGame[]>([])
  const [loading, setLoading] = useState(true)
  
  // Load upcoming games from Supabase
  useEffect(() => {
    const loadUpcomingGames = async () => {
      try {
        setLoading(true)
        
        // Get current date in ISO format
        const today = new Date().toISOString().split('T')[0]
        
        // Query games with release dates in the future
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .gt('release_date', today)  // Only get games with release dates in the future
          .order('release_date', { ascending: true })
          .limit(4)  // Limit to 4 games
        
        if (error) {
          console.error('Error loading upcoming games:', error)
          return
        }
        
        // If we have data, use it; otherwise use empty array
        setUpcomingGames(data || [])
      } catch (error) {
        console.error('Error in loadUpcomingGames:', error)
      } finally {
        setLoading(false)
      }
    }
    
    // Call the function to load games
    loadUpcomingGames()
    
    // Set up a subscription for real-time updates
    const subscription = supabase
      .channel('upcoming-games-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'games' }, () => {
        // Reload games when there are changes
        loadUpcomingGames()
      })
      .subscribe()
    
    // Clean up subscription when component unmounts
    return () => {
      subscription.unsubscribe()
    }
  }, [])
  
  const handleNotifyClick = async (gameId: string, gameTitle: string) => {
    if (notifiedGames.includes(gameId)) {
      showToast('You are already subscribed to notifications for this game', 'info')
      return
    }
    
    try {
      // În aplicația reală, aici s-ar trimite un email sau s-ar salva în baza de date
      // Pentru acum, doar simulăm acest comportament
      const { error } = await supabase
        .from('game_notifications')
        .insert([
          { 
            game_id: gameId, 
            game_title: gameTitle,
            email: config.contactEmail, // Folosim adresa de email din configurări
            created_at: new Date().toISOString()
          }
        ])
      
      if (error) {
        console.error('Error saving notification:', error)
        showToast('Could not subscribe to notifications. Please try again.', 'error')
        return
      }
      
      // Actualizăm starea locală
      setNotifiedGames([...notifiedGames, gameId])
      showToast(`You will be notified at ${config.contactEmail} when ${gameTitle} is available`, 'success')
    } catch (error) {
      console.error('Error in handleNotifyClick:', error)
      showToast('An error occurred. Please try again.', 'error')
    }
  }
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBA'  // Handle missing dates
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  
  return (
    <div className="py-12 bg-game-dark">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-game-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <h2 className="text-2xl font-bold">Upcoming Games</h2>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-game-accent"></div>
          </div>
        ) : upcomingGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingGames.map((game) => (
              <div key={game.id} className="bg-game-gray rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-[1.02] border border-gray-800">
                <div className="relative aspect-video bg-game-darker">
                  <Image 
                    src={game.image || '/images/placeholder-game.jpg'} 
                    alt={game.title}
                    width={600}
                    height={338}
                    className="w-full h-full object-cover"
                    priority
                  />
                  
                  {/* Release date badge */}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
                    {formatDate(game.release_date)}
                  </div>
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{game.title}</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {game.genre && (
                      <span className="bg-game-accent bg-opacity-20 text-game-accent text-xs px-2 py-1 rounded-md">{game.genre}</span>
                    )}
                    {game.publisher && (
                      <span className="bg-blue-900 bg-opacity-30 text-blue-400 text-xs px-2 py-1 rounded-md">{game.publisher}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-game-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>Release: {formatDate(game.release_date)}</span>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-4">{game.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Get notified on release</span>
                    <button
                      onClick={() => handleNotifyClick(String(game.id), game.title)}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${notifiedGames.includes(String(game.id)) ? 'bg-gray-700 text-gray-300' : 'bg-game-accent hover:bg-opacity-80 text-white hover:shadow-lg'}`}
                    >
                      <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        {notifiedGames.includes(String(game.id)) && (
                          <span className="absolute -top-1 -right-1 bg-green-500 rounded-full w-2 h-2"></span>
                        )}
                      </div>
                      <span className="font-medium">{notifiedGames.includes(String(game.id)) ? 'Notified' : 'Notify Me'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>No upcoming games found.</p>
            <p className="text-sm mt-2">Add games with future release dates in the Admin Dashboard.</p>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <a 
            href="/request-game" 
            className="inline-flex items-center gap-2 bg-transparent border border-game-accent text-game-accent hover:bg-game-accent/10 px-6 py-3 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
              <path d="M12 11v4"></path>
              <path d="M9 14h6"></path>
            </svg>
            <span>Request a Game</span>
          </a>
        </div>
      </div>
    </div>
  )
}
