"use client"

import { useState } from 'react'
import Link from 'next/link'
import GameGrid from './game-grid'

// Mock categories
const categories = [
  { id: 'action', name: 'Action' },
  { id: 'adventure', name: 'Adventure' },
  { id: 'rpg', name: 'RPG' },
  { id: 'simulation', name: 'Simulation' },
  { id: 'strategy', name: 'Strategy' },
  { id: 'sports', name: 'Sports' },
  { id: 'racing', name: 'Racing' },
  { id: 'indie', name: 'Indie' }
]

const CategoryTabs = () => {
  const [activeTab, setActiveTab] = useState('action')

  return (
    <div>
      {/* Category tabs */}
      <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === category.id
                  ? 'bg-game-blue text-white'
                  : 'bg-game-gray text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Games for selected category */}
      <GameGrid type="all" limit={5} category={activeTab} />
      
      {/* View more link */}
      <div className="mt-4 text-center">
        <Link 
          href={`/browse?category=${activeTab}`}
          className="inline-block px-6 py-2 border border-game-blue text-game-blue hover:bg-game-blue hover:text-white rounded-lg transition-colors"
        >
          View More {categories.find(c => c.id === activeTab)?.name} Games
        </Link>
      </div>
    </div>
  )
}

export default CategoryTabs
