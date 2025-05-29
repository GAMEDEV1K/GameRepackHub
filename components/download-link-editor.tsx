"use client"

import React, { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import { DownloadLink } from '../types/game'
import { addDownloadLink, updateDownloadLink, deleteDownloadLink } from '../lib/game-service'
import { useAuth } from '../context/auth-context'

interface DownloadLinkEditorProps {
  gameId: string | number;
  downloadLinks: DownloadLink[];
  isOwner: boolean;
  onLinksUpdated: () => void;
}

const DownloadLinkEditor: React.FC<DownloadLinkEditorProps> = ({ 
  gameId, 
  downloadLinks, 
  isOwner,
  onLinksUpdated 
}) => {
  const { user } = useAuth();
  const [links, setLinks] = useState<DownloadLink[]>(downloadLinks);
  const [editingLinkId, setEditingLinkId] = useState<string | number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLink, setNewLink] = useState<Omit<DownloadLink, 'id'>>({
    name: '',
    url: '',
    type: 'google_drive',
    size_bytes: 0,
    part: 1,
    total_parts: 1
  });
  const [editLink, setEditLink] = useState<DownloadLink | null>(null);

  useEffect(() => {
    setLinks(downloadLinks);
  }, [downloadLinks]);

  // Verificăm dacă utilizatorul este autentificat și este proprietarul jocului
  if (!user || !isOwner) {
    return null;
  }

  const handleAddLink = async () => {
    if (!newLink.name || !newLink.url) {
      alert('Numele și URL-ul sunt obligatorii!');
      return;
    }

    try {
      await addDownloadLink(gameId.toString(), newLink);
      setShowAddForm(false);
      setNewLink({
        name: '',
        url: '',
        type: 'google_drive',
        size_bytes: 0,
        part: 1,
        total_parts: 1
      });
      onLinksUpdated();
    } catch (error) {
      console.error('Eroare la adăugarea link-ului:', error);
      alert('A apărut o eroare la adăugarea link-ului.');
    }
  };

  const handleUpdateLink = async () => {
    if (!editLink || !editLink.name || !editLink.url) {
      alert('Numele și URL-ul sunt obligatorii!');
      return;
    }

    try {
      await updateDownloadLink(editLink.id.toString(), editLink);
      setEditingLinkId(null);
      setEditLink(null);
      onLinksUpdated();
    } catch (error) {
      console.error('Eroare la actualizarea link-ului:', error);
      alert('A apărut o eroare la actualizarea link-ului.');
    }
  };

  const handleDeleteLink = async (linkId: string | number) => {
    if (!confirm('Sigur doriți să ștergeți acest link?')) {
      return;
    }

    try {
      await deleteDownloadLink(linkId.toString());
      onLinksUpdated();
    } catch (error) {
      console.error('Eroare la ștergerea link-ului:', error);
      alert('A apărut o eroare la ștergerea link-ului.');
    }
  };

  const startEditing = (link: DownloadLink) => {
    setEditingLinkId(link.id);
    setEditLink({ ...link });
  };

  const cancelEditing = () => {
    setEditingLinkId(null);
    setEditLink(null);
  };

  return (
    <div className="mt-8 bg-game-gray rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Gestionare Link-uri de Descărcare</h3>
        {!showAddForm && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-game-accent hover:bg-opacity-80 text-white px-3 py-2 rounded flex items-center"
          >
            + 
            Adaugă Link
          </button>
        )}
      </div>

      {/* Formular pentru adăugarea unui link nou */}
      {showAddForm && (
        <div className="bg-game-darker p-4 rounded mb-4">
          <h4 className="text-lg font-medium mb-3">Adaugă Link Nou</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nume</label>
              <input
                type="text"
                value={newLink.name}
                onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                className="w-full bg-game-gray border border-gray-700 rounded py-2 px-3 text-white"
                placeholder="ex: Google Drive - Part 1"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">URL</label>
              <input
                type="text"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                className="w-full bg-game-gray border border-gray-700 rounded py-2 px-3 text-white"
                placeholder="ex: https://drive.google.com/file/..."
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Tip</label>
              <select
                value={newLink.type}
                onChange={(e) => setNewLink({ ...newLink, type: e.target.value as any })}
                className="w-full bg-game-gray border border-gray-700 rounded py-2 px-3 text-white"
              >
                <option value="google_drive">Google Drive</option>
                <option value="mega">MEGA</option>
                <option value="torrent">Torrent</option>
                <option value="direct">Direct</option>
                <option value="other">Altele</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Dimensiune (bytes)</label>
              <input
                type="number"
                value={newLink.size_bytes || ''}
                onChange={(e) => setNewLink({ ...newLink, size_bytes: parseInt(e.target.value) || 0 })}
                className="w-full bg-game-gray border border-gray-700 rounded py-2 px-3 text-white"
                placeholder="ex: 10737418240"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Parte</label>
              <input
                type="number"
                value={newLink.part || 1}
                onChange={(e) => setNewLink({ ...newLink, part: parseInt(e.target.value) || 1 })}
                className="w-full bg-game-gray border border-gray-700 rounded py-2 px-3 text-white"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Total Părți</label>
              <input
                type="number"
                value={newLink.total_parts || 1}
                onChange={(e) => setNewLink({ ...newLink, total_parts: parseInt(e.target.value) || 1 })}
                className="w-full bg-game-gray border border-gray-700 rounded py-2 px-3 text-white"
                min="1"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
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
              
              Salvează
            </button>
          </div>
        </div>
      )}

      {/* Lista de link-uri existente */}
      <div className="space-y-3">
        {links.map((link) => (
          <div key={link.id} className="bg-game-darker p-3 rounded">
            {editingLinkId === link.id ? (
              // Modul de editare
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nume</label>
                  <input
                    type="text"
                    value={editLink?.name || ''}
                    onChange={(e) => setEditLink(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="w-full bg-game-gray border border-gray-700 rounded py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">URL</label>
                  <input
                    type="text"
                    value={editLink?.url || ''}
                    onChange={(e) => setEditLink(prev => prev ? { ...prev, url: e.target.value } : null)}
                    className="w-full bg-game-gray border border-gray-700 rounded py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Tip</label>
                  <select
                    value={editLink?.type || 'google_drive'}
                    onChange={(e) => setEditLink(prev => prev ? { ...prev, type: e.target.value as any } : null)}
                    className="w-full bg-game-gray border border-gray-700 rounded py-2 px-3 text-white"
                  >
                    <option value="google_drive">Google Drive</option>
                    <option value="mega">MEGA</option>
                    <option value="torrent">Torrent</option>
                    <option value="direct">Direct</option>
                    <option value="other">Altele</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Dimensiune (bytes)</label>
                  <input
                    type="number"
                    value={editLink?.size_bytes || ''}
                    onChange={(e) => setEditLink(prev => prev ? { ...prev, size_bytes: parseInt(e.target.value) || 0 } : null)}
                    className="w-full bg-game-gray border border-gray-700 rounded py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Parte</label>
                  <input
                    type="number"
                    value={editLink?.part || 1}
                    onChange={(e) => setEditLink(prev => prev ? { ...prev, part: parseInt(e.target.value) || 1 } : null)}
                    className="w-full bg-game-gray border border-gray-700 rounded py-2 px-3 text-white"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Total Părți</label>
                  <input
                    type="number"
                    value={editLink?.total_parts || 1}
                    onChange={(e) => setEditLink(prev => prev ? { ...prev, total_parts: parseInt(e.target.value) || 1 } : null)}
                    className="w-full bg-game-gray border border-gray-700 rounded py-2 px-3 text-white"
                    min="1"
                  />
                </div>
              </div>
            ) : (
              // Modul de vizualizare
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Download className="text-game-accent mr-3" />
                  <div>
                    <span className="block">{link.name}</span>
                    <span className="text-sm text-gray-400 block truncate max-w-md">{link.url}</span>
                    <div className="flex text-xs text-gray-500 mt-1">
                      <span className="mr-3">Tip: {link.type}</span>
                      {link.part && link.total_parts && (
                        <span className="mr-3">Parte: {link.part}/{link.total_parts}</span>
                      )}
                      {link.size_bytes && (
                        <span>Dimensiune: {(link.size_bytes / (1024 * 1024 * 1024)).toFixed(2)} GB</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end mt-3 space-x-2">
              {editingLinkId === link.id ? (
                <>
                  <button 
                    onClick={cancelEditing}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded flex items-center text-sm"
                  >
                    
                    Anulează
                  </button>
                  <button 
                    onClick={handleUpdateLink}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center text-sm"
                  >
                    
                    Salvează
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => startEditing(link)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center text-sm"
                  >
                    
                    Editează
                  </button>
                  <button 
                    onClick={() => handleDeleteLink(link.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center text-sm"
                  >
                    
                    Șterge
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {links.length === 0 && (
          <div className="text-center py-6 text-gray-400">
            Nu există link-uri de descărcare. Adaugă primul link folosind butonul de mai sus.
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadLinkEditor;
