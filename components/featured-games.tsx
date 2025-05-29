"use client"

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// Mock data for featured games
const featuredGames = [
  {
    id: 1,
    title: 'Forza Horizon 5',
    slug: 'forza-horizon-5',
    image: '/images/forza-horizon-5.jpg',
    genre: 'Racing',
    size: '90.4 GB',
    version: 'v1.520.0 + All DLCs'
  },
  {
    id: 2,
    title: 'Grand Theft Auto V',
    slug: 'grand-theft-auto-v',
    image: '/images/gta-v.jpg',
    genre: 'Action, Adventure',
    size: '105.6 GB',
    version: 'v1.58 + Online'
  },
  {
    id: 3,
    title: 'Call of Duty: Modern Warfare',
    slug: 'call-of-duty-modern-warfare',
    image: '/images/cod-mw.jpg',
    genre: 'FPS, Action',
    size: '175.2 GB',
    version: 'v1.4.2 + Warzone'
  },
  {
    id: 4,
    title: 'BeamNG.drive',
    slug: 'beamng-drive',
    image: '/images/beamng.jpg',
    genre: 'Simulation, Racing',
    size: '18.5 GB',
    version: 'v0.30.0'
  },
  {
    id: 5,
    title: 'Euro Truck Simulator 2',
    slug: 'euro-truck-simulator-2',
    image: '/images/ets2.jpg',
    genre: 'Simulation, Driving',
    size: '25.3 GB',
    version: 'v1.47.3.0 + All DLCs'
  },
  {
    id: 6,
    title: 'Car Simulator',
    slug: 'car-simulator',
    image: '/images/car-simulator.jpg',
    genre: 'Simulation, Racing',
    size: '4.2 GB',
    version: 'v2.3.0'
  }
]

const FeaturedGames = () => {
  return (
    <div className="featured-carousel relative">
      <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
        {featuredGames.map((game) => (
          <Link 
            href={`/game/${game.slug}`} 
            key={game.id}
            className="relative flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-xl overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-[1.02] border border-gray-800"
          >
            <div className="aspect-[16/9] relative">
              <Image
                src={game.image}
                alt={game.title}
                width={600}
                height={338}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                priority
              />
              
              {/* Game size badge */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
                {game.size}
              </div>
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-game-accent bg-opacity-20 text-game-accent text-xs px-2 py-1 rounded-md">{game.genre}</span>
                  <span className="bg-blue-900 bg-opacity-30 text-blue-400 text-xs px-2 py-1 rounded-md">{game.version}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">View Details</span>
                  <div className="bg-game-accent rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-80">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Navigation dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {featuredGames.map((_, index) => (
          <button 
            key={index}
            className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-game-blue' : 'bg-gray-600'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default FeaturedGames
