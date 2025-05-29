"use client"

import { useState, useEffect } from 'react'
import GameGrid from '../../components/game-grid'
import { Filter, SortDesc, Search } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function BrowsePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalGames, setTotalGames] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const gamesPerPage = 10
  
  // Function to get the total number of games
  useEffect(() => {
    const getTotalGames = async () => {
      try {
        // Construim query-ul de bază
        let query = supabase
          .from('games')
          .select('*', { count: 'exact' })
        
        // Aplicăm filtrul pentru categorie dacă există
        if (selectedCategory) {
          query = query.contains('genre', [selectedCategory])
        }
        
        // Aplicăm filtrul pentru căutare dacă există
        if (searchQuery) {
          query = query.ilike('title', `%${searchQuery}%`)
        }
        
        // Executăm query-ul
        const { count } = await query
        
        setTotalGames(count || 0)
        setTotalPages(Math.ceil((count || 0) / gamesPerPage))
      } catch (error) {
        console.error('Error fetching total games count:', error)
      }
    }
    
    getTotalGames()
  }, [selectedCategory, searchQuery])
  
  // Function to change the page
  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }
  
  // Function to reset filters
  const resetFilters = () => {
    setSelectedCategory('')
    setSearchQuery('')
    setSortBy('newest')
    setCurrentPage(1)
  }
  
  // Function to change the category
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category)
    setCurrentPage(1)
  }
  
  // Function to change sorting
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value)
    setCurrentPage(1)
  }
  
  // Function to search games
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }
  
  return (
    <div className="space-y-8">
      {/* Header with decorative elements */}
      <div className="relative mb-6">
        <div className="absolute -top-6 -left-6 w-32 h-32 bg-game-accent/10 rounded-full blur-xl"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-game-neon/10 rounded-full blur-xl"></div>
        
        <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-game-accent via-game-accent-light to-game-neon">Browse Games</h1>
          
          {/* Modern search bar */}
          <div className="relative max-w-md w-full group">
            <div className="absolute inset-0 bg-game-accent/5 rounded-lg blur-sm group-focus-within:bg-game-accent/10 transition-all duration-300"></div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="w-5 h-5 text-game-accent group-focus-within:text-game-neon transition-colors duration-300" />
              </div>
              <input
                type="text"
                className="w-full bg-game-darker/70 backdrop-blur-sm border border-game-light-gray/30 rounded-lg py-3 px-4 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-game-accent focus:border-transparent relative z-10"
                placeholder="Search games..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters and sorting with modern design */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters - Left side */}
        <div className="md:col-span-1 glass-card p-6 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-game-accent/5 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-game-accent/20 rounded-full flex items-center justify-center">
                  <Filter className="w-4 h-4 text-game-accent" />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-game-accent to-game-neon">Filters</span>
              </h2>
              <button 
                className="px-3 py-1.5 text-sm bg-game-darker/50 backdrop-blur-sm border border-game-light-gray/20 rounded-full text-gray-300 hover:text-white hover:border-game-accent/50 transition-all duration-300"
                onClick={resetFilters}
              >
                Reset
              </button>
            </div>
          
          {/* Categories with modern design */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 text-game-accent-light">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {['Action', 'Adventure', 'RPG', 'Simulation', 'Strategy', 'Sports', 'Racing', 'Indie'].map((category) => (
                <button
                  key={category}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-game-accent/30 border border-game-accent/50 text-white'
                      : 'bg-game-darker/50 backdrop-blur-sm border border-game-light-gray/20 text-gray-300 hover:border-game-accent/30 hover:text-white'
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Size range with modern design */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 text-game-accent-light">Size</h3>
            <div className="bg-game-darker/30 backdrop-blur-sm rounded-lg p-4 border border-game-light-gray/20">
              {['Under 1GB', '1GB to 5GB', '5GB to 20GB', '20GB to 50GB', 'Over 50GB'].map((size) => (
                <div key={size} className="flex items-center py-2 border-b border-game-light-gray/10 last:border-0">
                  <div className="w-5 h-5 rounded-full border border-game-light-gray/30 flex items-center justify-center mr-3 group-hover:border-game-accent/50 transition-colors">
                    <div className="w-3 h-3 rounded-full bg-game-accent/0 group-hover:bg-game-accent/30 transition-colors"></div>
                  </div>
                  <label
                    className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {size}
                  </label>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
        
        {/* Main content - Right side with modern design */}
        <div className="md:col-span-3 space-y-8">
          {/* Sorting and results count with glass effect */}
          <div className="glass-card p-6 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-game-neon/5 rounded-full blur-xl"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-gray-300 bg-game-darker/40 backdrop-blur-sm px-4 py-2 rounded-lg border border-game-light-gray/20">
                Showing <span className="font-medium text-white">{totalGames}</span> games
              </div>
              
              <div className="flex items-center gap-3 group">
                <div className="flex items-center gap-2">
                  <SortDesc className="w-5 h-5 text-game-accent" />
                  <label htmlFor="sort-by" className="text-sm text-gray-300">Sort by:</label>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-game-accent/5 rounded-lg blur-sm group-focus-within:bg-game-accent/10 transition-all duration-300"></div>
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={handleSortChange}
                    className="bg-game-darker/70 backdrop-blur-sm border border-game-light-gray/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-game-accent focus:border-transparent relative z-10 appearance-none pr-10"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="size-asc">Size (Small to Large)</option>
                    <option value="size-desc">Size (Large to Small)</option>
                    <option value="popular">Most Popular</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-game-accent">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Games grid with modern styling */}
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-game-accent/5 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-game-neon/5 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <GameGrid 
                type="all" 
                limit={gamesPerPage} 
                category={selectedCategory}
                page={currentPage}
              />
            </div>
          </div>
          
          {/* Pagination with modern design */}
          {totalGames > 0 && (
            <div className="mt-16 mb-8 pt-8 border-t border-gray-700/30 flex justify-center">
              <nav className="flex items-center gap-2">
                <button 
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                    currentPage === 1 
                      ? 'bg-game-darker/50 text-gray-500 cursor-not-allowed' 
                      : 'bg-game-darker/70 backdrop-blur-sm border border-game-light-gray/30 text-gray-300 hover:border-game-accent/50 hover:text-white'
                  }`}
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                  Anterior
                </button>
                
                {/* Generăm butoanele pentru paginație cu design modern */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Calculăm pagina pentru acest buton
                  let pageNumber;
                  
                  if (totalPages <= 5) {
                    // Dacă avem 5 sau mai puține pagini, afișăm toate paginile
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    // Dacă suntem la începutul listei
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    // Dacă suntem la sfârșitul listei
                    pageNumber = totalPages - 4 + i;
                  } else {
                    // Dacă suntem undeva la mijloc
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <button 
                      key={pageNumber}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        pageNumber === currentPage 
                          ? 'bg-gradient-to-br from-game-accent to-game-neon text-white shadow-lg shadow-game-accent/20' 
                          : 'bg-game-darker/70 backdrop-blur-sm border border-game-light-gray/30 text-gray-300 hover:border-game-accent/50 hover:text-white'
                      }`}
                      onClick={() => changePage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button 
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                    currentPage === totalPages 
                      ? 'bg-game-darker/50 text-gray-500 cursor-not-allowed' 
                      : 'bg-game-darker/70 backdrop-blur-sm border border-game-light-gray/30 text-gray-300 hover:border-game-accent/50 hover:text-white'
                  }`}
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Următor
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
