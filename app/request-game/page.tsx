"use client"

import { useState } from 'react'
import { Send } from 'lucide-react'
// Using inline SVG for GameController icon
import { useToast } from '../../components/ui/simple-toast'
import MostRequestedGames from '../../components/most-requested-games'

export default function RequestGamePage() {
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    gameName: '',
    releaseYear: '',
    publisher: '',
    reason: '',
    email: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      showToast(`Your request for ${formData.gameName} has been submitted!`, 'success')
      setFormData({
        gameName: '',
        releaseYear: '',
        publisher: '',
        reason: '',
        email: ''
      })
      setIsSubmitting(false)
    }, 1500)
  }
  
  // Generate years for the dropdown (from 2000 to current year)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-game-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <circle cx="6" cy="12" r="2" />
          <circle cx="18" cy="12" r="2" />
          <line x1="12" y1="6" x2="12" y2="18" />
          <line x1="2" y1="12" x2="22" y2="12" />
        </svg>
        <h1 className="text-3xl font-bold">Request a Game</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-game-gray rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="gameName" className="block text-sm font-medium mb-2">Game Name *</label>
                <input
                  type="text"
                  id="gameName"
                  name="gameName"
                  value={formData.gameName}
                  onChange={handleChange}
                  required
                  className="w-full bg-game-dark border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-game-accent"
                  placeholder="Enter the full name of the game"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="releaseYear" className="block text-sm font-medium mb-2">Release Year</label>
                  <select
                    id="releaseYear"
                    name="releaseYear"
                    value={formData.releaseYear}
                    onChange={handleChange}
                    className="w-full bg-game-dark border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-game-accent"
                  >
                    <option value="">Select year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                    <option value="unreleased">Unreleased/Coming Soon</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="publisher" className="block text-sm font-medium mb-2">Publisher/Developer</label>
                  <input
                    type="text"
                    id="publisher"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleChange}
                    className="w-full bg-game-dark border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-game-accent"
                    placeholder="e.g. Rockstar Games, EA"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="reason" className="block text-sm font-medium mb-2">Why do you want this game? *</label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full bg-game-dark border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-game-accent resize-none"
                  placeholder="Tell us why you want this game to be added to GameRipple"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email (optional)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-game-dark border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-game-accent"
                  placeholder="We'll notify you when the game is available"
                />
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-game-accent hover:bg-opacity-80 text-white font-medium py-3 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div>
          <div className="bg-game-gray rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">About Game Requests</h2>
            <p className="text-gray-300 mb-4">
              Can't find the game you're looking for? Request it here and we'll do our best to add it to our collection.
            </p>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-game-accent">•</span>
                <span>We prioritize requests based on popularity and availability</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-game-accent">•</span>
                <span>Providing accurate information helps us process your request faster</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-game-accent">•</span>
                <span>You can optionally provide your email to get notified when the game is available</span>
              </li>
            </ul>
          </div>
          
          <div>
            <MostRequestedGames />
          </div>
        </div>
      </div>
    </div>
  )
}
