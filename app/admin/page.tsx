"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../context/auth-context'
import { deleteGame } from '../../lib/game-service'
import { Game } from '../../types/game'
import { supabase } from '../../lib/supabase'
import { useToast } from '../../components/ui/simple-toast'
import LoadingSpinner from '../../components/ui/loading-spinner'

export default function AdminPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()
  const { showToast } = useToast()

  // Function to delete a game
  const handleDeleteGame = async (gameId: string, gameTitle: string) => {
    if (confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
      try {
        showToast(`Deleting game ${gameTitle}`, 'info', 'Deleting game...');
        
        // First delete the download links associated with the game
        const { error: linksError } = await supabase
          .from('download_links')
          .delete()
          .eq('game_id', gameId);
        
        if (linksError) {
          console.error('Error deleting download links:', linksError);
          showToast('An error occurred while deleting download links.', 'error', 'Error');
          return;
        }
        
        // Then delete the game
        const { error: gameError } = await supabase
          .from('games')
          .delete()
          .eq('id', gameId);
        
        if (gameError) {
          console.error('Error deleting game:', gameError);
          showToast('An error occurred while deleting the game.', 'error', 'Error');
          return;
        }
        
        showToast(`Game ${gameTitle} has been successfully deleted!`, 'success', 'Success!');
        
        // Update the game list without reloading the page
        setGames(games.filter(game => game.id !== parseInt(gameId)));
      } catch (error) {
        console.error('Error deleting game:', error);
        showToast('An error occurred while deleting the game.', 'error', 'Error');
      }
    }
  }

  useEffect(() => {
    // Check if the user is authenticated
    if (!user) {
      router.push('/login')
      return
    }

    // Load games
    const loadGames = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .limit(100);
          
        if (error) {
          console.error('Error loading games:', error)
          return
        }
        
        setGames(data || [])
      } catch (error) {
        console.error('Error loading games:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGames()
  }, [user, router])

  if (!user) {
    return null // Don't display anything until redirection occurs
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <Link
          href="/admin/add-game"
          className="bg-game-accent hover:bg-opacity-80 text-white px-4 py-2 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          Add New Game
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="medium" text="Loading games..." />
        </div>
      ) : games.length === 0 ? (
        <p className="text-gray-400">You haven't added any games yet.</p>
      ) : (
        <>
          <div className="bg-game-gray rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Games</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-700">
                  <tr>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Image</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game) => (
                    <tr key={game.id} className="border-b border-gray-800 hover:bg-game-darker">
                      <td className="py-3 px-4">
                        <Link href={`/game/${game.slug}`} className="text-game-accent hover:underline">
                          {game.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <img src={game.image} alt={game.title} className="w-16 h-10 object-cover rounded" />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/edit-game/${game.id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </Link>
                          <Link
                            href={`/admin/manage-links/${game.id}`}
                            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDeleteGame(String(game.id), game.title)}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                            title="Delete game"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// Funcție pentru a formata dimensiunea în bytes într-un format lizibil
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
