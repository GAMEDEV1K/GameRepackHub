"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../../context/auth-context'
import { isGameOwner, getDownloadLinks, addDownloadLink, updateDownloadLink, deleteDownloadLink } from '../../../../lib/game-service'
import { Game, DownloadLink } from '../../../../types/game'
import { supabase } from '../../../../lib/supabase'

export default function ManageLinksPage({ params }: { params: { id: string } }) {
  const [game, setGame] = useState<Game | null>(null)
  const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>([])
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()
  const gameId = params.id

  const [newLink, setNewLink] = useState({
    name: '',
    url: '',
    type: 'google_drive',
    game_id: gameId
  })

  // Funcție pentru a obține detaliile jocului după ID
  const getGameById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching game:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getGameById:', error);
      return null;
    }
  }

  useEffect(() => {
    // Verifică dacă utilizatorul este autentificat
    if (!user) {
      router.push('/login')
      return
    }

    const loadGameAndLinks = async () => {
      try {
        setLoading(true)
        
        // Verifică dacă utilizatorul este proprietarul jocului
        const ownerStatus = await isGameOwner(gameId, user.id)
        setIsOwner(ownerStatus)
        
        if (!ownerStatus) {
          alert('Nu ai permisiunea de a gestiona link-urile pentru acest joc.')
          router.push('/admin')
          return
        }
        
        // Încarcă detaliile jocului
        const gameData = await getGameById(gameId)
        setGame(gameData)
        
        // Încarcă link-urile de descărcare
        const links = await getDownloadLinks(gameId)
        setDownloadLinks(links)
      } catch (error) {
        console.error('Eroare la încărcarea datelor:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGameAndLinks()
  }, [user, router, gameId])

  const handleNewLinkChange = (e: any) => {
    const { name, value } = e.target
    
    setNewLink(prev => ({
      ...prev,
      [name]: name === 'size_bytes' || name === 'part' || name === 'total_parts' 
        ? Number(value) 
        : value
    }))
  }

  const handleAddLink = async () => {
    if (!newLink.name || !newLink.url) {
      alert('Numele și URL-ul sunt obligatorii!')
      return
    }

    try {
      setLoading(true)
      
      // Adaugă link-ul nou în baza de date
      const addedLink = await addDownloadLink(gameId, {
        name: newLink.name,
        url: newLink.url,
        type: newLink.type as "google_drive" | "mega" | "torrent" | "direct" | "other",
        game_id: gameId
      })
      
      if (addedLink) {
        // Actualizează lista de link-uri
        setDownloadLinks(prev => [...prev, addedLink])
        
        // Resetează formularul
        setNewLink({
          name: '',
          url: '',
          type: 'google_drive',
          game_id: gameId
        })
        
        setShowAddForm(false)
      }
    } catch (error) {
      console.error('Eroare la adăugarea link-ului:', error)
      alert('A apărut o eroare la adăugarea link-ului.')
    } finally {
      setLoading(false)
    }
  }

  const startEditing = (link: DownloadLink) => {
    setEditingLinkId(link.id.toString())
    setNewLink({
      name: link.name,
      url: link.url,
      type: link.type,
      game_id: gameId
    })
  }

  const cancelEditing = () => {
    setEditingLinkId(null)
    setNewLink({
      name: '',
      url: '',
      type: 'google_drive',
      game_id: gameId
    })
  }

  const handleUpdateLink = async (linkId: string) => {
    if (!linkId) return
    
    if (!newLink.name || !newLink.url) {
      alert('Numele și URL-ul sunt obligatorii!')
      return
    }

    try {
      setLoading(true)
      
      // Actualizează link-ul în baza de date
      const updatedLink = await updateDownloadLink(linkId, {
        name: newLink.name,
        url: newLink.url,
        type: newLink.type as "google_drive" | "mega" | "torrent" | "direct" | "other"
      })
      
      if (updatedLink) {
        // Actualizează lista de link-uri
        setDownloadLinks(prev => 
          prev.map(link => 
            link.id.toString() === linkId ? updatedLink : link
          )
        )
        
        // Resetează starea de editare
        setEditingLinkId(null)
        setNewLink({
          name: '',
          url: '',
          type: 'google_drive',
          game_id: gameId
        })
      }
    } catch (error) {
      console.error('Eroare la actualizarea link-ului:', error)
      alert('A apărut o eroare la actualizarea link-ului.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLink = async (linkId: string) => {
    if (confirm('Ești sigur că vrei să ștergi acest link? Această acțiune nu poate fi anulată.')) {
      try {
        setLoading(true)
        
        // Șterge link-ul din baza de date
        const success = await deleteDownloadLink(linkId)
        
        if (success) {
          // Actualizează lista de link-uri
          setDownloadLinks(prev => prev.filter(link => link.id.toString() !== linkId))
        }
      } catch (error) {
        console.error('Eroare la ștergerea link-ului:', error)
        alert('A apărut o eroare la ștergerea link-ului.')
      } finally {
        setLoading(false)
      }
    }
  }

  if (!user || !isOwner) {
    return null // Nu afișa nimic până când redirecționarea are loc
  }



  // Funcție pentru a formata tipul link-ului
  function formatLinkType(type: string) {
    switch (type) {
      case 'google_drive':
        return 'Google Drive'
      case 'mega':
        return 'MEGA'
      case 'mediafire':
        return 'MediaFire'
      case 'torrent':
        return 'Torrent'
      case 'direct':
        return 'Link Direct'
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link
          href="/admin"
          className="mr-4 text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="m12 19-7-7 7-7"/>
            <path d="M19 12H5"/>
          </svg>
        </Link>
        <h1 className="text-3xl font-bold text-white">
          {loading ? 'Se încarcă...' : `Gestionare Link-uri: ${game?.title || ''}`}
        </h1>
      </div>

      {loading && !showAddForm && !editingLinkId ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-game-accent"></div>
        </div>
      ) : (
        <div className="bg-game-gray rounded-lg p-6">
          {/* Buton pentru adăugare link nou */}
          {!showAddForm && !editingLinkId && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-game-accent hover:bg-opacity-80 text-white px-4 py-2 rounded flex items-center mb-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Adaugă Link Nou
            </button>
          )}
          
          {/* Formular pentru adăugare link nou */}
          {showAddForm && (
            <div className="bg-game-darker rounded-lg p-4 mb-6">
              <h2 className="text-xl font-semibold mb-4">Adaugă Link Nou</h2>
              
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nume Link</label>
                  <input
                    type="text"
                    name="name"
                    value={newLink.name}
                    onChange={handleNewLinkChange}
                    placeholder="ex: Google Drive"
                    className="w-full bg-game-gray border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-game-accent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">URL</label>
                  <input
                    type="text"
                    name="url"
                    value={newLink.url}
                    onChange={handleNewLinkChange}
                    placeholder="ex: https://drive.google.com/file/d/abc123/view"
                    className="w-full bg-game-gray border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-game-accent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Tip</label>
                  <select
                    name="type"
                    value={newLink.type}
                    onChange={handleNewLinkChange}
                    className="w-full bg-game-gray border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-game-accent"
                  >
                    <option value="google_drive">Google Drive</option>
                    <option value="mega">MEGA</option>
                    <option value="torrent">Torrent</option>
                    <option value="direct">Link Direct</option>
                    <option value="other">Altul</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Anulează
                </button>
                <button
                  onClick={handleAddLink}
                  className="bg-game-accent hover:bg-opacity-80 text-white px-4 py-2 rounded flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </svg>
                  Salvează
                </button>
              </div>
            </div>
          )}
          
          {/* Lista de link-uri */}
          {downloadLinks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead className="bg-game-darker text-left">
                  <tr>
                    <th className="py-3 px-4">Nume</th>
                    <th className="py-3 px-4">Tip</th>
                    <th className="py-3 px-4">Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {downloadLinks.map(link => (
                    <tr key={link.id} className="border-t border-gray-700">
                      <td className="py-3 px-4">
                        {editingLinkId === link.id.toString() ? (
                          <input
                            type="text"
                            name="name"
                            value={newLink.name}
                            onChange={handleNewLinkChange}
                            className="w-full bg-game-gray border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-game-accent"
                          />
                        ) : (
                          <div>
                            <div className="font-medium">{link.name}</div>
                            <div className="text-gray-400 text-sm truncate max-w-xs">{link.url}</div>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingLinkId === link.id.toString() ? (
                          <select
                            name="type"
                            value={newLink.type}
                            onChange={handleNewLinkChange}
                            className="w-full bg-game-gray border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-game-accent"
                          >
                            <option value="google_drive">Google Drive</option>
                            <option value="mega">MEGA</option>
                            <option value="torrent">Torrent</option>
                            <option value="direct">Link Direct</option>
                            <option value="other">Altul</option>
                          </select>
                        ) : (
                          formatLinkType(link.type)
                        )}
                      </td>
                      
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          {editingLinkId === link.id.toString() ? (
                            <>
                              <button 
                                onClick={cancelEditing}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded flex items-center text-sm"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1">
                                  <path d="M18 6 6 18M6 6l12 12"/>
                                </svg>
                                Anulează
                              </button>
                              <button 
                                onClick={() => handleUpdateLink(link.id.toString())}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center text-sm"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1">
                                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                  <polyline points="17 21 17 13 7 13 7 21"/>
                                  <polyline points="7 3 7 8 15 8"/>
                                </svg>
                                Salvează
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => startEditing(link)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center text-sm"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                                Editează
                              </button>
                              <button 
                                onClick={() => handleDeleteLink(link.id.toString())}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center text-sm"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1">
                                  <path d="M3 6h18"/>
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                  <line x1="10" y1="11" x2="10" y2="17"/>
                                  <line x1="14" y1="11" x2="14" y2="17"/>
                                </svg>
                                Șterge
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              Nu există link-uri de descărcare pentru acest joc. Adaugă primul link folosind butonul de mai sus.
            </div>
          )}
          
          {/* Buton pentru a reveni la pagina jocului */}
          <div className="mt-8 flex justify-end">
            <Link
              href={`/game/${game?.slug}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Vezi Pagina Jocului
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
