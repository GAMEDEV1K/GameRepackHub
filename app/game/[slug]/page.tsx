"use client"

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Download, HardDrive, Calendar, User, Monitor, ChevronDown } from 'lucide-react'
import { getGameWithDownloadLinks, isGameOwner } from '../../../lib/game-service'
import { Game, DownloadLink } from '../../../types/game'
import { incrementDownloadCount } from '../../../lib/supabase'
import { useAuth } from '../../../context/auth-context'
import DownloadLinkEditor from '../../../components/download-link-editor'
import LoadingSpinner from '../../../components/ui/loading-spinner'

// Function for formatting file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Function for formatting date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Component for download links
const DownloadLinks = ({ links, gameTitle, onDownload, crackFixUrl }: { links: DownloadLink[], gameTitle: string, onDownload: (url: string) => void, crackFixUrl?: string }) => {
  const [activeTab, setActiveTab] = useState<'google_drive' | 'mega' | 'torrent'>('google_drive')
  const [downloadLoading, setDownloadLoading] = useState(false)
  const { user } = useAuth()
  
  // Filter links based on active tab
  const filteredLinks = links.filter(link => link.type === activeTab)
  
  // Find torrent link
  const torrentLink = links.find(link => link.type === 'torrent')

  // Download function with loading animation
  const handleDownload = async (url: string) => {
    try {
      setDownloadLoading(true)
      // Call the download function from the parent component
      onDownload(url)
      // Simulate a short delay to display the loading animation
      await new Promise(resolve => setTimeout(resolve, 800))
      // Open the download link in a new window
      window.open(url, '_blank')
    } catch (error) {
      console.error('Error downloading:', error)
    } finally {
      setDownloadLoading(false)
    }
  }
  
  return (
    <div className="bg-game-gray rounded-lg p-4 mt-6">
      <h3 className="text-xl font-bold mb-4 text-white">Download Links</h3>
      
      {/* Tabs for download types */}
      <div className="flex border-b border-gray-700 mb-4">
        <button 
          className={`px-4 py-2 ${activeTab === 'google_drive' ? 'text-game-accent border-b-2 border-game-accent' : 'text-gray-400'}`}
          onClick={() => setActiveTab('google_drive')}
        >
          Google Drive
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'mega' ? 'text-game-accent border-b-2 border-game-accent' : 'text-gray-400'}`}
          onClick={() => setActiveTab('mega')}
        >
          MEGA
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'torrent' ? 'text-game-accent border-b-2 border-game-accent' : 'text-gray-400'}`}
          onClick={() => setActiveTab('torrent')}
        >
          Torrent
        </button>
      </div>
      
      {/* Display download links */}
      {activeTab !== 'torrent' ? (
        <div className="space-y-3">
          {filteredLinks.length > 0 ? (
            filteredLinks.map(link => (
              <div key={link.id} className="flex flex-col sm:flex-row justify-between items-center bg-game-dark p-4 rounded-lg hover:bg-game-darker transition-colors">
                <div className="flex items-center mb-3 sm:mb-0 w-full sm:w-auto">
                  <div className="bg-game-accent bg-opacity-20 p-2 rounded-full mr-3">
                    <Download className="text-game-accent w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-medium text-white">{link.name === 'Link de descărcare' ? 'Download Link' : link.name}</span>
                    {link.type && (
                      <span className="ml-2 text-xs text-gray-400 px-2 py-0.5 bg-gray-700 rounded">{link.type === 'direct' ? 'Direct Download' : link.type}</span>
                    )}
                    {link.size_bytes && (
                      <span className="ml-2 text-sm text-gray-400">({formatFileSize(link.size_bytes)})</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(link.url)}
                  disabled={downloadLoading}
                  className="w-full sm:w-auto bg-game-accent hover:bg-opacity-80 text-white px-6 py-3 rounded-lg flex items-center justify-center disabled:opacity-70 transition-all duration-200 hover:shadow-lg"
                >
                  {downloadLoading ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <Download className="w-5 h-5 mr-2" />
                  )}
                  <span className="font-medium">{user ? 'Download Now' : 'Login to Download'}</span>
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-4">No {activeTab === 'google_drive' ? 'Google Drive' : 'MEGA'} links available for this game.</p>
          )}
          {/* Crack Fix Link is now included in the main download links list */}
        </div>
      ) : (
        <div>
          {torrentLink ? (
            <div className="flex flex-col sm:flex-row justify-between items-center bg-game-dark p-4 rounded-lg hover:bg-game-darker transition-colors">
              <div className="flex items-center mb-3 sm:mb-0 w-full sm:w-auto">
                <div className="bg-game-accent bg-opacity-20 p-2 rounded-full mr-3">
                  <Download className="text-game-accent w-5 h-5" />
                </div>
                <div>
                  <span className="font-medium text-white">{torrentLink.name}</span>
                  {torrentLink.size_bytes && (
                    <span className="ml-2 text-sm text-gray-400">({formatFileSize(torrentLink.size_bytes || 0)})</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => torrentLink.url && handleDownload(torrentLink.url)}
                disabled={downloadLoading}
                className="w-full sm:w-auto bg-game-accent hover:bg-opacity-80 text-white px-6 py-3 rounded-lg flex items-center justify-center disabled:opacity-70 transition-all duration-200 hover:shadow-lg"
              >
                {downloadLoading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <Download className="w-5 h-5 mr-2" />
                )}
                <span className="font-medium">Download Torrent</span>
              </button>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">No torrent links available for this game.</p>
          )}
        </div>
      )}
      
      {/* Message for non-authenticated users */}
      {!user && (
        <div className="mt-4 p-4 bg-blue-900 bg-opacity-30 text-blue-300 rounded-lg border border-blue-800">
          <div className="flex items-start">
            <div className="mr-3 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <p>You need to be logged in to download this game. <Link href="/login" className="text-blue-400 hover:text-blue-300 underline font-medium">Login</Link> or <Link href="/login" className="text-blue-400 hover:text-blue-300 underline font-medium">Register</Link> to access download links.</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Component for system requirements
const SystemRequirements = ({ requirements }: { requirements: Game['system_requirements'] }) => {
  if (!requirements) return null
  
  return (
    <div className="bg-game-gray rounded-lg p-4 mt-6">
      <h3 className="text-xl font-bold mb-4 text-white">System Requirements</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold mb-2 text-game-accent">Minimum</h4>
          <ul className="space-y-2">
            <li className="flex">
              <span className="text-gray-400 w-24">OS:</span>
              <span>{requirements.minimum.os}</span>
            </li>
            <li className="flex">
              <span className="text-gray-400 w-24">Processor:</span>
              <span>{requirements.minimum.processor}</span>
            </li>
            <li className="flex">
              <span className="text-gray-400 w-24">Memory:</span>
              <span>{requirements.minimum.memory}</span>
            </li>
            <li className="flex">
              <span className="text-gray-400 w-24">Graphics:</span>
              <span>{requirements.minimum.graphics}</span>
            </li>
            <li className="flex">
              <span className="text-gray-400 w-24">DirectX:</span>
              <span>{requirements.minimum.directx}</span>
            </li>
            <li className="flex">
              <span className="text-gray-400 w-24">Storage:</span>
              <span>{requirements.minimum.storage}</span>
            </li>
            {requirements.minimum.additional_notes && (
              <li className="flex">
                <span className="text-gray-400 w-24">Notes:</span>
                <span>{requirements.minimum.additional_notes}</span>
              </li>
            )}
          </ul>
        </div>
        
        {requirements.recommended && (
          <div>
            <h4 className="text-lg font-semibold mb-2 text-game-accent">Recommended</h4>
            <ul className="space-y-2">
              <li className="flex">
                <span className="text-gray-400 w-24">OS:</span>
                <span>{requirements.recommended.os}</span>
              </li>
              <li className="flex">
                <span className="text-gray-400 w-24">Processor:</span>
                <span>{requirements.recommended.processor}</span>
              </li>
              <li className="flex">
                <span className="text-gray-400 w-24">Memory:</span>
                <span>{requirements.recommended.memory}</span>
              </li>
              <li className="flex">
                <span className="text-gray-400 w-24">Graphics:</span>
                <span>{requirements.recommended.graphics}</span>
              </li>
              <li className="flex">
                <span className="text-gray-400 w-24">DirectX:</span>
                <span>{requirements.recommended.directx}</span>
              </li>
              <li className="flex">
                <span className="text-gray-400 w-24">Storage:</span>
                <span>{requirements.recommended.storage}</span>
              </li>
              {requirements.recommended.additional_notes && (
                <li className="flex">
                  <span className="text-gray-400 w-24">Notes:</span>
                  <span>{requirements.recommended.additional_notes}</span>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default function GamePage() {
  const { slug } = useParams<{ slug: string }>()
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const [isOwner, setIsOwner] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  
  useEffect(() => {
    const loadGame = async () => {
      if (!slug) return
      
      try {
        const gameData = await getGameWithDownloadLinks(slug as string)
        setGame(gameData)
        
        // Check if the user is the owner of the game
        if (user && gameData) {
          const ownerStatus = await isGameOwner(user.id, gameData.id.toString())
          setIsOwner(ownerStatus)
        }
      } catch (error) {
        console.error('Error loading game:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadGame()
  }, [slug, user])
  
  const handleDownload = async (url: string) => {
    try {
      setDownloadLoading(true)
      
      // Increment download counter only if we have a valid ID
      if (game?.id) {
        await incrementDownloadCount(game.id.toString())
      }
      
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Open the download link in a new window
      window.open(url, '_blank')
    } catch (error) {
      console.error('Error downloading:', error)
    } finally {
      setDownloadLoading(false)
    }
  }
  
  const handleLinksUpdated = async () => {
    // Reload the game to get updated links
    if (!slug) return
    try {
      const gameData = await getGameWithDownloadLinks(slug)
      setGame(gameData)
    } catch (error) {
      console.error('Error refreshing game data:', error)
    }
  }
  
  if (loading) {
    return (
      <div className="bg-game-darker min-h-screen flex justify-center items-center">
        <LoadingSpinner size="large" text="Loading game..." />
      </div>
    )
  }
  
  if (!game) {
    return (
      <div className="bg-game-darker min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="bg-game-gray rounded-xl shadow-xl p-8 max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4 text-white">Game Not Found</h1>
            <p className="mb-6 text-gray-300">The game you are looking for does not exist or has been removed.</p>
            <Link href="/browse" className="bg-game-accent hover:bg-opacity-80 text-white px-6 py-3 rounded-lg inline-flex items-center justify-center transition-all duration-200 hover:shadow-lg">
              Browse Games
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-game-darker min-h-screen pb-12">
      {/* Hero Section with Game Banner */}
      <div className="relative w-full h-[50vh] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image 
            src={game.image} 
            alt={game.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-game-darker via-game-darker/80 to-transparent"></div>
        </div>
        
        {/* Game Logo/Title Container - Positioned at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
          <div className="flex items-center">
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm text-gray-300 mb-4">
              <Link href="/" className="hover:text-game-accent transition-colors">Home</Link>
              <ChevronDown className="w-4 h-4 mx-1 rotate-270" />
              <Link href="/browse" className="hover:text-game-accent transition-colors">Games</Link>
              <ChevronDown className="w-4 h-4 mx-1 rotate-270" />
              <span className="text-white">{game.title}</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">{game.title}</h1>
          
          {/* Game Tags/Genres */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Array.isArray(game.genre) ? (
              game.genre.map((g, i) => (
                <span key={i} className="bg-game-accent bg-opacity-20 text-game-accent text-xs px-2 py-1 rounded-md">{g}</span>
              ))
            ) : game.genre ? (
              <span className="bg-game-accent bg-opacity-20 text-game-accent text-xs px-2 py-1 rounded-md">{game.genre}</span>
            ) : null}
            {game.version && (
              <span className="bg-blue-900 bg-opacity-30 text-blue-400 text-xs px-2 py-1 rounded-md">{game.version}</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-6">
        <div className="bg-game-gray rounded-xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Game Cover and Info */}
            <div className="lg:w-1/4">
              <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden shadow-lg border border-gray-700">
                <Image 
                  src={game.image} 
                  alt={game.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Game Info Cards */}
              <div className="mt-6 space-y-4">
                <div className="bg-game-dark rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Game Details</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <HardDrive className="text-game-accent w-5 h-5 mr-3" />
                      <div>
                        <p className="text-xs text-gray-400">Size</p>
                        <p className="text-white font-medium">{formatFileSize(game.size_bytes)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="text-game-accent w-5 h-5 mr-3" />
                      <div>
                        <p className="text-xs text-gray-400">Release Date</p>
                        <p className="text-white font-medium">{formatDate(game.release_date)}</p>
                      </div>
                    </div>
            
                    {game.developer && (
                      <div className="flex items-center">
                        <User className="text-game-accent w-5 h-5 mr-3" />
                        <div>
                          <p className="text-xs text-gray-400">Developer</p>
                          <p className="text-white font-medium">{game.developer}</p>
                        </div>
                      </div>
                    )}
                    
                    {game.publisher && (
                      <div className="flex items-center">
                        <User className="text-game-accent w-5 h-5 mr-3" />
                        <div>
                          <p className="text-xs text-gray-400">Publisher</p>
                          <p className="text-white font-medium">{game.publisher}</p>
                        </div>
                      </div>
                    )}
                    
                    {Array.isArray(game.genre) && game.genre.length > 0 && (
                      <div className="flex items-center">
                        <div className="text-game-accent w-5 h-5 mr-3 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Genre</p>
                          <p className="text-white font-medium">{Array.isArray(game.genre) ? game.genre.join(', ') : game.genre}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Game Description, Screenshots, and Download Links */}
            <div className="lg:w-3/4">
              {/* About This Game */}
              <div className="bg-game-dark rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">About This Game</h2>
                <p className="text-gray-300 whitespace-pre-line leading-relaxed">{game.description}</p>
              </div>
              
              {/* Screenshots */}
              {game.screenshots && game.screenshots.length > 0 && (
                <div className="bg-game-dark rounded-lg p-6 mb-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Screenshots</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {game.screenshots.map((screenshot, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-game-darker border border-gray-700 shadow-md hover:shadow-lg transition-shadow">
                        {/* Folosim o imagine placeholder u00een loc de screenshot-uri reale */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center p-4">
                            <p className="text-lg text-gray-400 font-medium">{game.title} Screenshot {index + 1}</p>
                            <p className="text-sm text-gray-500 mt-2">Image not available</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* System Requirements */}
              {game.system_requirements && (
                <div className="bg-game-dark rounded-lg p-6 mb-6">
                  <h2 className="text-2xl font-bold text-white mb-4">System Requirements</h2>
                  <SystemRequirements requirements={game.system_requirements} />
                </div>
              )}
              
              {/* Download Links Section */}
              <div className="bg-game-dark rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Download Links</h2>
                {game.download_links && game.download_links.length > 0 ? (
                  <DownloadLinks 
                    links={[
                      ...game.download_links,
                      // Add crack fix as a direct download link if available
                      ...(game.metadata?.crack_download_url ? [{
                        id: 'crack-fix',
                        game_id: game.id,
                        name: 'Crack Fix',
                        url: game.metadata.crack_download_url,
                        type: 'direct' as 'direct' // Explicit type casting to match DownloadLink type
                      }] : [])
                    ]} 
                    gameTitle={game.title}
                    onDownload={handleDownload}
                  />
                ) : (
                  <p className="text-gray-400 text-center py-4">No download links available for this game.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      

    </div>
  )
}
