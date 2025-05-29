"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../context/auth-context'
import { supabase } from '../../../lib/supabase'
import { Game } from '../../../types/game'
import { useToast } from '../../../components/ui/simple-toast'
import LoadingSpinner from '../../../components/ui/loading-spinner'

export default function AddGamePage() {
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  // CSV import functionality has been removed
  const { user } = useAuth()
  const router = useRouter()
  const { showToast } = useToast()

  // State for form data
  const [formData, setFormData] = useState({
    title: 'Call of Duty Modern Warfare II',
    description: 'Call of Duty: Modern Warfare II is a first-person shooter video game developed by Infinity Ward and published by Activision. It is a direct sequel to Call of Duty: Modern Warfare from 2019.',
    genre: ['FPS', 'Action', 'Shooter'],
    release_date: '2022-10-28', // October 28, 2022
    developer: 'Infinity Ward',
    publisher: 'Activision',
    version: '1.0',
    image_url: 'https://v13.net/wp-content/uploads/call_of_duty_modern_warfare_ii.jpg',
    download_url: 'https://example.com/download/call-of-duty-mw2.zip',
    size_bytes: 125 * 1024 * 1024 * 1024, // 125 GB
    cracked_by: 'GOLDBERG',
    steam_url: 'https://store.steampowered.com/app/1938090/Call_of_Duty_Modern_Warfare_II/',
    is_crack_fix: false,
    parent_game: '',
    crack_download_url: ''
  })

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleImageUrlChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    // Actualizăm previzualizarea imaginii
    if (name === 'image_url') {
      if (value) {
        try {
          // Dacă URL-ul nu începe cu http, adăugăm https://
          const imageUrl = value.startsWith('http') ? value : `https://${value}`
          console.log('Setting image preview to:', imageUrl)
          
          // Forțăm re-renderingul imaginii adăugând un timestamp
          setImagePreview(`${imageUrl}?t=${Date.now()}`)
          
          // Preload image to check if it's valid
          const img = new Image()
          img.onload = () => {
            console.log('Image loaded successfully')
          }
          img.onerror = () => {
            console.error('Error loading image')
            // Keep the preview but log the error
          }
          img.src = imageUrl
        } catch (error) {
          console.error('Error setting image preview:', error)
          setImagePreview(null)
        }
      } else {
        setImagePreview(null)
      }
    } else {
      setImagePreview(null)
    }
  }
  
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    
    if (!user) {
      showToast('You must be logged in to add a game.', 'error', 'Error')
      return
    }
    
    if (!formData.title || !formData.download_url) {
      showToast('Please fill in all required fields.', 'error', 'Error')
      return
    }
    
    try {
      setLoading(true)
      
      showToast(`Adding game ${formData.title}`, 'info', 'Adding game...')
      
      // Prepare game data
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-')
      
      // Use the image URL entered by the user or a placeholder image if not specified
      let imagePath = formData.image_url || '/images/games/placeholder.jpg'
      
      // Check if the image URL is valid
      if (formData.image_url && !formData.image_url.startsWith('http')) {
        // If it doesn't start with http, add https:// at the beginning
        imagePath = 'https://' + formData.image_url
      }
      
      // Create the game in the database with all required fields
      // Remove the user_id field which doesn't exist in the database schema
      const newGame: Partial<Game> = {
        title: formData.title,
        slug,
        image: imagePath,
        genre: formData.genre.length > 0 ? formData.genre : ['Game'], // Use entered genres or default value
        release_date: formData.release_date || new Date().toISOString().split('T')[0],
        size_bytes: formData.size_bytes || 1024 * 1024 * 1024, // 1 GB as default value if not specified
        download_count: 0, // Initially, no downloads
        featured: false, // By default, not featured
        description: formData.description || `Download ${formData.title} for free`,
        developer: formData.developer || 'Unknown',
        publisher: formData.publisher || 'Unknown',
        version: formData.version || '1.0',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Adăugăm metadatele pentru Game Details
        metadata: {
          cracked_by: formData.cracked_by || 'GOLDBERG',
          steam_url: formData.steam_url || '',
          is_crack_fix: formData.is_crack_fix || false,
          parent_game: formData.is_crack_fix ? formData.parent_game : '',
          crack_download_url: formData.crack_download_url || ''
        }
      }
      
      console.log('Sending game to Supabase:', newGame)
      
      // Insert the game into Supabase database
      const { data, error } = await supabase
        .from('games')
        .insert([newGame])
        .select()
        .single()
      
      if (error) {
        console.error('Error inserting game:', error)
        throw new Error(`Error inserting game: ${error.message}`)
      }
      
      if (!data || !data.id) {
        throw new Error('Game was created, but no valid ID was returned')
      }
      
      console.log('Game added successfully:', data)
      
      // Add download link
      const downloadLink = {
        game_id: data.id,
        name: 'Download link',
        url: formData.download_url,
        type: 'direct'
      }
      
      console.log('Adding download link:', downloadLink)
      
      const { error: linkError } = await supabase
        .from('download_links')
        .insert([downloadLink])
      
      if (linkError) {
        console.error('Error adding download link:', linkError)
        // Continue even if the link was not added, the game already exists
        showToast('The game was added, but there was an error adding the download link.', 'info', 'Warning')
      } else {
        showToast(`Game ${formData.title} was added successfully!`, 'success', 'Success!')
      }
      
      router.push('/admin')
    } catch (error: any) {
      console.error('Error adding game:', error)
      showToast(`An error occurred while adding the game: ${error.message || 'Unknown error'}`, 'error', 'Error')
      // Display more details in console for debugging
      if (error.details) console.error('Error details:', error.details)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null // Nu afișa nimic până când redirecționarea are loc
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page header with decorative elements */}
      <div className="relative mb-12">
        <div className="absolute -top-6 -left-6 w-32 h-32 bg-game-accent/10 rounded-full blur-xl"></div>
        <div className="flex items-center justify-between relative z-10">
          <Link href="/admin" className="flex items-center gap-2 px-4 py-2 bg-game-gray/50 rounded-lg border border-game-light-gray/30 text-gray-300 hover:border-game-accent/50 hover:text-game-accent transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"/>
              <path d="M12 19l-7-7 7-7"/>
            </svg>
            <span>Back to Admin</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-game-accent via-game-accent-light to-game-neon">Add New Game</h1>
        </div>
      </div>
      
      {/* CSV import functionality has been removed */}

      <form onSubmit={handleSubmit} className="glass-card p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-game-accent/5 rounded-full blur-xl"></div>
        <div className="absolute -left-16 -top-16 w-48 h-48 bg-game-neon/5 rounded-full blur-xl"></div>
        {loading && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card p-8 relative overflow-hidden">
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-game-accent/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -left-16 -top-16 w-48 h-48 bg-game-neon/10 rounded-full blur-xl animate-pulse"></div>
            <div className="relative z-10">
              <LoadingSpinner size="large" text="Adding game..." />
            </div>
          </div>
        </div>
      )}
          <div className="mb-10 relative z-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <div className="w-8 h-8 bg-game-accent/20 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-game-accent">
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                  <polyline points="17 2 12 7 7 2"></polyline>
                </svg>
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-game-accent via-game-accent-light to-game-neon">Game Information</span>
            </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-5 group">
              <label className="block text-sm font-medium mb-2 text-gray-300 group-focus-within:text-game-accent transition-colors">Game Title <span className="text-game-accent">*</span></label>
              <div className="relative">
                <div className="absolute inset-0 bg-game-accent/5 rounded-lg blur-sm group-focus-within:bg-game-accent/10 transition-all duration-300"></div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-game-darker/70 backdrop-blur-sm border border-game-light-gray/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-game-accent focus:border-transparent relative z-10"
                />
              </div>
            </div>
            
            <div className="mb-5 group">
              <label className="block text-sm font-medium mb-2 text-gray-300 group-focus-within:text-game-accent transition-colors">Version</label>
              <div className="relative">
                <div className="absolute inset-0 bg-game-accent/5 rounded-lg blur-sm group-focus-within:bg-game-accent/10 transition-all duration-300"></div>
                <input
                  type="text"
                  name="version"
                  value={formData.version}
                  onChange={handleChange}
                  placeholder="ex: 1.0"
                  className="w-full bg-game-darker/70 backdrop-blur-sm border border-game-light-gray/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-game-accent focus:border-transparent relative z-10"
                />
              </div>
            </div>

            <div className="mb-5 group">
              <label className="block text-sm font-medium mb-2 text-gray-300 group-focus-within:text-game-accent transition-colors">Developer</label>
              <div className="relative">
                <div className="absolute inset-0 bg-game-accent/5 rounded-lg blur-sm group-focus-within:bg-game-accent/10 transition-all duration-300"></div>
                <input
                  type="text"
                  name="developer"
                  value={formData.developer}
                  onChange={handleChange}
                  placeholder="ex: Rockstar Games"
                  className="w-full bg-game-darker/70 backdrop-blur-sm border border-game-light-gray/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-game-accent focus:border-transparent relative z-10"
                />
              </div>
            </div>

            <div className="mb-5 group">
              <label className="block text-sm font-medium mb-2 text-gray-300 group-focus-within:text-game-accent transition-colors">Publisher</label>
              <div className="relative">
                <div className="absolute inset-0 bg-game-accent/5 rounded-lg blur-sm group-focus-within:bg-game-accent/10 transition-all duration-300"></div>
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  placeholder="ex: Electronic Arts"
                  className="w-full bg-game-darker/70 backdrop-blur-sm border border-game-light-gray/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-game-accent focus:border-transparent relative z-10"
                />
              </div>
            </div>

            <div className="mb-5 group">
              <label className="block text-sm font-medium mb-2 text-gray-300 group-focus-within:text-game-accent transition-colors">Release Date</label>
              <div className="relative">
                <div className="absolute inset-0 bg-game-accent/5 rounded-lg blur-sm group-focus-within:bg-game-accent/10 transition-all duration-300"></div>
                <input
                  type="date"
                  name="release_date"
                  value={formData.release_date}
                  onChange={handleChange}
                  className="w-full bg-game-darker/70 backdrop-blur-sm border border-game-light-gray/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-game-accent focus:border-transparent relative z-10"
                />
              </div>
            </div>
            
            <div className="mb-5 group">
              <label className="block text-sm font-medium mb-2 text-gray-300 group-focus-within:text-game-accent transition-colors">Genres (comma separated)</label>
              <div className="relative">
                <div className="absolute inset-0 bg-game-accent/5 rounded-lg blur-sm group-focus-within:bg-game-accent/10 transition-all duration-300"></div>
                <input
                  type="text"
                  name="genre_input"
                  value={formData.genre.join(', ')}
                  onChange={(e) => {
                    const genres = e.target.value.split(',').map(g => g.trim()).filter(g => g !== '');
                    setFormData({
                      ...formData,
                      genre: genres
                    });
                  }}
                  placeholder="ex: Action, Adventure, RPG"
                  className="w-full bg-game-darker/70 backdrop-blur-sm border border-game-light-gray/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-game-accent focus:border-transparent relative z-10"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.genre.map((genre, index) => (
                  <span key={index} className="bg-game-accent/20 text-white text-xs px-3 py-1 rounded-full">
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-5 md:col-span-2 group">
              <label className="block text-sm font-medium mb-2 text-gray-300 group-focus-within:text-game-accent transition-colors">Description</label>
              <div className="relative">
                <div className="absolute inset-0 bg-game-accent/5 rounded-lg blur-sm group-focus-within:bg-game-accent/10 transition-all duration-300"></div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter a description for the game..."
                  className="w-full bg-game-darker/70 backdrop-blur-sm border border-game-light-gray/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-game-accent focus:border-transparent relative z-10"
                ></textarea>
              </div>
            </div>
            
            <div className="mb-5 md:col-span-2 group">
              <label className="block text-sm font-medium mb-2 text-gray-300 group-focus-within:text-game-accent transition-colors">Download Link <span className="text-game-accent">*</span></label>
              <div className="relative">
                <div className="absolute inset-0 bg-game-accent/5 rounded-lg blur-sm group-focus-within:bg-game-accent/10 transition-all duration-300"></div>
                <input
                  type="text"
                  name="download_url"
                  value={formData.download_url}
                  onChange={handleChange}
                  placeholder="ex: https://example.com/download/game.zip"
                  required
                  className="w-full bg-game-darker/70 backdrop-blur-sm border border-game-light-gray/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-game-accent focus:border-transparent relative z-10"
                />
              </div>
            </div>
            
            <div className="mb-5 md:col-span-2 group">
              <label className="block text-sm font-medium mb-2 text-gray-300 group-focus-within:text-game-accent transition-colors">CRACK FIX Download Link</label>
              <div className="relative">
                <div className="absolute inset-0 bg-game-accent/5 rounded-lg blur-sm group-focus-within:bg-game-accent/10 transition-all duration-300"></div>
                <input
                  type="text"
                  name="crack_download_url"
                  value={formData.crack_download_url}
                  onChange={handleChange}
                  placeholder="ex: https://example.com/download/crack_fix.zip"
                  className="w-full bg-game-darker/70 backdrop-blur-sm border border-game-light-gray/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-game-accent focus:border-transparent relative z-10"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 ml-1">Link for downloading a separate CRACK FIX for this game</p>
            </div>
            
            <div className="mb-5 md:col-span-2 group">
              <label className="block text-sm font-medium mb-2 text-gray-300 group-focus-within:text-game-accent transition-colors">Game Image URL <span className="text-game-accent">*</span></label>
              <div className="relative">
                <div className="absolute inset-0 bg-game-accent/5 rounded-lg blur-sm group-focus-within:bg-game-accent/10 transition-all duration-300"></div>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleImageUrlChange}
                  placeholder="ex: https://example.com/images/game.jpg"
                  className="w-full bg-game-darker/70 backdrop-blur-sm border border-game-light-gray/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-game-accent focus:border-transparent relative z-10"
                />
              </div>
              
              {imagePreview && (
                <div className="mt-4 relative">
                  <div className="absolute inset-0 bg-game-accent/10 rounded-lg blur-md"></div>
                  <div className="border-2 border-dashed border-game-light-gray/30 rounded-lg p-4 text-center backdrop-blur-sm relative z-10">
                    <div className="relative">
                      <div className="bg-game-darker/70 p-2 rounded-lg overflow-hidden shadow-lg">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mx-auto max-h-48 rounded object-contain transition-all duration-300 hover:scale-105"
                          onError={(e) => {
                            // If image fails to load, show a placeholder
                            e.currentTarget.src = 'https://placehold.co/600x400/1f2937/FFFFFF/png?text=Image+Error';
                            console.error('Image failed to load:', imagePreview);
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({...formData, image_url: ''})
                          setImagePreview(null)
                        }}
                        className="absolute -top-2 -right-2 bg-gradient-to-r from-game-accent to-game-neon text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mb-5 group">
              <label className="block text-sm font-medium mb-2 text-gray-300 group-focus-within:text-game-accent transition-colors">Game Size (GB) <span className="text-game-accent">*</span></label>
              <div className="relative">
                <div className="absolute inset-0 bg-game-accent/5 rounded-lg blur-sm group-focus-within:bg-game-accent/10 transition-all duration-300"></div>
                <input
                  type="number"
                  name="size_gb"
                  value={formData.size_bytes / (1024 * 1024 * 1024)}
                  onChange={(e) => {
                    const sizeGb = parseFloat(e.target.value) || 0;
                    setFormData({
                      ...formData,
                      size_bytes: sizeGb * 1024 * 1024 * 1024 // Convert from GB to bytes
                    });
                  }}
                  step="0.1"
                  min="0.1"
                  placeholder="ex: 50.5"
                  required
                  className="w-full bg-game-darker/70 backdrop-blur-sm border border-game-light-gray/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-game-accent focus:border-transparent relative z-10"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 ml-1">Game size in GB (gigabytes)</p>
            </div>
            
            <div className="mb-5 group">
              <label className="block text-sm font-medium mb-2 text-gray-300 group-focus-within:text-game-accent transition-colors">Cracked By</label>
              <div className="relative">
                <div className="absolute inset-0 bg-game-accent/5 rounded-lg blur-sm group-focus-within:bg-game-accent/10 transition-all duration-300"></div>
                <input
                  type="text"
                  name="cracked_by"
                  value={formData.cracked_by}
                  onChange={handleChange}
                  placeholder="ex: GOLDBERG, CODEX, EMPRESS"
                  className="w-full bg-game-darker/70 backdrop-blur-sm border border-game-light-gray/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-game-accent focus:border-transparent relative z-10"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 ml-1">Group that cracked the game (shown in Game Details)</p>
            </div>
            
            <div className="mb-5 group">
              <label className="block text-sm font-medium mb-2 text-gray-300 group-focus-within:text-game-accent transition-colors">Steam URL</label>
              <div className="relative">
                <div className="absolute inset-0 bg-game-accent/5 rounded-lg blur-sm group-focus-within:bg-game-accent/10 transition-all duration-300"></div>
                <input
                  type="text"
                  name="steam_url"
                  value={formData.steam_url}
                  onChange={handleChange}
                  placeholder="ex: https://store.steampowered.com/app/1938090/Call_of_Duty_Modern_Warfare_II/"
                  className="w-full bg-game-darker/70 backdrop-blur-sm border border-game-light-gray/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-game-accent focus:border-transparent relative z-10"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 ml-1">Official Steam store page URL for "Support Developers" link</p>
            </div>
            

          </div>
        </div>
        
        <div className="mt-12 flex justify-end relative z-10">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary group disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <LoadingSpinner size="small" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
            )}
            Save Game
          </button>
        </div>
      </form>
    </div>
  )
}
