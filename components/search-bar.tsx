"use client"

import { useState } from 'react'
import { Search } from 'lucide-react'

const SearchBar = () => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would redirect to search results
    window.location.href = `/browse?search=${encodeURIComponent(query)}`
  }

  return (
    <form onSubmit={handleSubmit} className="relative max-w-xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for games..."
          className="w-full bg-game-darker border border-gray-700 rounded-lg py-3 px-4 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-game-blue focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <button 
          type="submit"
          className="absolute right-2 top-2 bottom-2 bg-game-blue hover:bg-blue-600 text-white px-4 rounded transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  )
}

export default SearchBar
