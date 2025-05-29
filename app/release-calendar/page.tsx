"use client"

import { useState } from 'react'
// Using inline SVG icons instead of Lucide React
import { useToast } from '../../components/ui/simple-toast'

interface CalendarGame {
  id: string
  title: string
  releaseDate: string
  description: string
  publisher: string
  genre: string
}

export default function ReleaseCalendarPage() {
  const { showToast } = useToast()
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [notifiedGames, setNotifiedGames] = useState<string[]>([])
  
  // Sample upcoming games data for the next 12 months
  const upcomingGames: CalendarGame[] = [
    {
      id: 'game1',
      title: 'GTA 6',
      releaseDate: '2025-10-15',
      description: 'The next chapter in the Grand Theft Auto series.',
      publisher: 'Rockstar Games',
      genre: 'Action, Adventure'
    },
    {
      id: 'game2',
      title: 'The Elder Scrolls VI',
      releaseDate: '2026-01-20',
      description: 'The long-awaited sequel to Skyrim.',
      publisher: 'Bethesda',
      genre: 'RPG'
    },
    {
      id: 'game3',
      title: 'Dragon Age: Dreadwolf',
      releaseDate: '2025-07-30',
      description: 'The next installment in the Dragon Age series.',
      publisher: 'BioWare',
      genre: 'RPG'
    },
    {
      id: 'game4',
      title: 'Fable',
      releaseDate: '2025-09-05',
      description: 'A reboot of the beloved Fable franchise.',
      publisher: 'Playground Games',
      genre: 'RPG, Adventure'
    },
    {
      id: 'game5',
      title: 'Assassin\'s Creed Shadows',
      releaseDate: '2025-06-15',
      description: 'The next chapter in the Assassin\'s Creed franchise.',
      publisher: 'Ubisoft',
      genre: 'Action, Adventure'
    },
    {
      id: 'game6',
      title: 'Call of Duty: Black Ops 6',
      releaseDate: '2025-11-10',
      description: 'The next installment in the Black Ops series.',
      publisher: 'Activision',
      genre: 'FPS'
    },
    {
      id: 'game7',
      title: 'Horizon Zero Dawn 3',
      releaseDate: '2025-08-22',
      description: 'The third chapter in Aloy\'s journey.',
      publisher: 'Sony Interactive Entertainment',
      genre: 'Action, RPG'
    },
    {
      id: 'game8',
      title: 'Starfield: Shattered Space',
      releaseDate: '2025-12-05',
      description: 'Major expansion for Starfield.',
      publisher: 'Bethesda',
      genre: 'RPG, Space Sim'
    }
  ]
  
  const handleNotifyClick = (gameId: string, gameTitle: string) => {
    if (notifiedGames.includes(gameId)) {
      showToast('You are already subscribed to notifications for this game', 'info')
      return
    }
    
    // In a real app, this would send the subscription to a backend
    setNotifiedGames([...notifiedGames, gameId])
    showToast(`You will be notified when ${gameTitle} is available`, 'success')
  }
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }
  
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }
  
  // Filter games for the current month and year
  const gamesForCurrentMonth = upcomingGames.filter(game => {
    const releaseDate = new Date(game.releaseDate)
    return releaseDate.getMonth() === currentMonth && releaseDate.getFullYear() === currentYear
  })
  
  // Sort games by release date
  const sortedGames = [...gamesForCurrentMonth].sort((a, b) => {
    return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
  })
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  
  // Get day of month
  const getDayOfMonth = (dateString: string) => {
    return new Date(dateString).getDate()
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-game-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <h1 className="text-3xl font-bold">Release Calendar</h1>
      </div>
      
      <div className="bg-game-gray rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-game-dark transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <h2 className="text-xl font-bold">{monthNames[currentMonth]} {currentYear}</h2>
          
          <button 
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-game-dark transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        
        {sortedGames.length > 0 ? (
          <div className="space-y-4">
            {sortedGames.map(game => (
              <div key={game.id} className="flex border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                <div className="flex-shrink-0 w-16 h-16 bg-game-dark rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl font-bold">{getDayOfMonth(game.releaseDate)}</span>
                </div>
                
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">{game.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-xs bg-game-dark text-gray-300 px-2 py-1 rounded">{game.publisher}</span>
                    <span className="text-xs bg-game-dark text-gray-300 px-2 py-1 rounded">{game.genre}</span>
                  </div>
                  <p className="text-sm text-gray-400">{game.description}</p>
                </div>
                
                <div className="flex-shrink-0 ml-4 flex items-start">
                  <button
                    onClick={() => handleNotifyClick(game.id, game.title)}
                    className={`flex items-center gap-1 px-3 py-1 rounded transition-colors ${notifiedGames.includes(game.id) ? 'bg-gray-600 text-gray-300' : 'bg-game-accent hover:bg-opacity-80 text-white'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    <span>{notifiedGames.includes(game.id) ? 'Notified' : 'Notify Me'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>No game releases scheduled for {monthNames[currentMonth]} {currentYear}.</p>
            <p className="text-sm mt-2">Try checking another month or <a href="/request-game" className="text-game-accent hover:underline">request a game</a>.</p>
          </div>
        )}
      </div>
      
      <div className="bg-game-gray rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Upcoming Releases</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4">Game</th>
                <th className="text-left py-3 px-4">Release Date</th>
                <th className="text-left py-3 px-4">Publisher</th>
                <th className="text-left py-3 px-4">Genre</th>
                <th className="text-left py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {upcomingGames.map(game => (
                <tr key={game.id} className="border-b border-gray-700 last:border-0 hover:bg-game-dark/50">
                  <td className="py-3 px-4 font-medium">{game.title}</td>
                  <td className="py-3 px-4 text-gray-400">{formatDate(game.releaseDate)}</td>
                  <td className="py-3 px-4 text-gray-400">{game.publisher}</td>
                  <td className="py-3 px-4 text-gray-400">{game.genre}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleNotifyClick(game.id, game.title)}
                      className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-colors ${notifiedGames.includes(game.id) ? 'bg-gray-600 text-gray-300' : 'bg-game-accent hover:bg-opacity-80 text-white'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
                      <span>{notifiedGames.includes(game.id) ? 'Notified' : 'Notify Me'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
