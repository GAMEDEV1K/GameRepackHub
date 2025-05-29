import GameGrid from '../../components/game-grid'
import { Clock, Calendar, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default function NewReleasesPage() {
  // In a real app, this would be fetched from the database
  const releaseCalendar = [
    { date: '2023-06-15', games: ['Game Title 1', 'Game Title 2'] },
    { date: '2023-06-10', games: ['Game Title 3'] },
    { date: '2023-06-05', games: ['Game Title 4', 'Game Title 5', 'Game Title 6'] },
    { date: '2023-06-01', games: ['Game Title 7'] },
    { date: '2023-05-28', games: ['Game Title 8', 'Game Title 9'] },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Clock className="w-8 h-8 text-game-blue" />
        <h1 className="text-3xl font-bold">New Releases</h1>
      </div>
      
      <p className="text-gray-300 max-w-3xl">
        Check out the latest games added to GameRepackHub. We update our collection regularly with the newest titles, all pre-installed and ready to play.
      </p>
      
      {/* Latest releases */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Latest Additions</h2>
        <GameGrid type="latest" limit={15} />
      </div>
      
      {/* Release calendar */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Release Calendar
          </h2>
          <Link 
            href="/request-game" 
            className="flex items-center gap-1 text-game-blue hover:underline"
          >
            Request a game
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {releaseCalendar.map((item, index) => (
            <div key={index} className="bg-game-gray rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{new Date(item.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</h3>
                <span className="text-xs bg-game-blue/20 text-game-blue px-2 py-1 rounded-full">
                  {item.games.length} {item.games.length === 1 ? 'game' : 'games'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {item.games.map((game, gameIndex) => (
                  <Link 
                    key={gameIndex} 
                    href={`/game/${game.toLowerCase().replace(/\s+/g, '-')}`}
                    className="bg-game-darker hover:bg-gray-800 p-3 rounded-lg transition-colors"
                  >
                    <span className="text-white">{game}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Coming soon */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Coming Soon</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-game-gray rounded-lg overflow-hidden">
              <div className="aspect-video bg-game-darker relative flex items-center justify-center">
                <span className="text-lg text-gray-500">Game {item} Thumbnail</span>
                <div className="absolute top-2 right-2 bg-yellow-500/90 text-black text-xs font-bold px-2 py-1 rounded">
                  COMING SOON
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-1">Upcoming Game Title {item}</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Release: Q3 2023</span>
                  <button className="text-game-blue hover:underline">Notify Me</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Subscribe section */}
      <div className="bg-game-gray rounded-lg p-6 mt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
            <p className="text-gray-300">
              Subscribe to our newsletter to get notified when new games are added.
            </p>
          </div>
          
          <div className="flex-shrink-0 w-full md:w-auto">
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full md:w-64 bg-game-darker border border-gray-700 rounded-l-lg py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-game-blue focus:border-transparent"
              />
              <button className="bg-game-blue hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
