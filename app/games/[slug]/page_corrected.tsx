'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Download, HardDrive, Monitor, Cpu, Calendar, Star, ArrowRight as ArrowLeftIcon } from 'lucide-react';
import LoadingSpinner from '../../../components/ui/loading-spinner';
import { formatBytes } from '../../../lib/utils';
import { supabase } from '../../../lib/supabase-client';

// Definim interfețele pentru tipurile de date
interface DownloadLink {
  id: string;
  game_id: string;
  url: string;
  host: string;
  type?: string;
}

interface SystemRequirements {
  os?: string;
  processor?: string;
  memory?: string;
  graphics?: string;
  storage?: string;
  [key: string]: string | undefined;
}

interface Game {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  genre?: string[];
  release_date: string;
  size_bytes?: number;
  developer?: string;
  publisher?: string;
  version?: string;
  screenshots?: string[];
  minimum_requirements?: SystemRequirements;
  recommended_requirements?: SystemRequirements;
}

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  
  useEffect(() => {
    async function fetchGameData() {
      try {
        // Fetch game data
        const { data: gameData, error: gameError } = await supabase
          .from('games')
          .select('*')
          .eq('slug', params.slug)
          .single();
        
        if (gameError) throw gameError;
        
        if (gameData) {
          setGame(gameData as Game);
          
          // Fetch download links
          const { data: linksData, error: linksError } = await supabase
            .from('download_links')
            .select('*')
            .eq('game_id', gameData.id);
          
          if (linksError) throw linksError;
          
          setDownloadLinks(linksData as DownloadLink[] || []);
        }
      } catch (error) {
        console.error('Error fetching game data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (params.slug) {
      fetchGameData();
    }
  }, [params.slug]);
  
  // Simulate download click
  const handleDownload = (link: DownloadLink) => {
    setDownloadLoading(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      setDownloadLoading(false);
      window.open(link.url, '_blank');
    }, 1000);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" text="Loading game details..." />
      </div>
    );
  }
  
  if (!game) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-red-500">Game Not Found</h1>
        <p className="mb-4">The requested game could not be found.</p>
        <Link href="/browse" className="text-game-accent hover:underline flex items-center gap-2">
          <ArrowLeftIcon size={16} />
          Back to Browse
        </Link>
      </div>
    );
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link href="/browse" className="text-gray-300 hover:text-white flex items-center gap-2 w-fit transition-colors duration-300">
          <ArrowLeftIcon size={16} />
          <span>Back to Browse</span>
        </Link>
      </div>
      
      {/* Game header with decorative elements */}
      <div className="relative mb-12">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-game-accent/10 rounded-full blur-xl"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-game-neon/10 rounded-full blur-xl"></div>
        
        <div className="relative z-10">
          {/* Game image with glass effect */}
          <div className="relative rounded-xl overflow-hidden glass-card">
            <div className="absolute inset-0 bg-gradient-to-t from-game-darker via-transparent to-transparent z-10"></div>
            <Image 
              src={game.image || '/images/placeholder.jpg'} 
              alt={game.title} 
              width={1200} 
              height={600} 
              className="w-full h-72 md:h-96 object-cover transition-transform duration-700 hover:scale-105" 
            />
            
            {/* Game title overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-lg">
                    {game.title}
                  </h1>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {game.genre && game.genre.map((genre, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 rounded-full text-sm bg-game-accent/30 border border-game-accent/50 text-white"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-game-darker/70 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-game-light-gray/30">
                    <Calendar className="w-4 h-4 text-game-accent" />
                    <span className="text-sm text-gray-300">{new Date(game.release_date).getFullYear()}</span>
                  </div>
                  {game.size_bytes && (
                    <div className="flex items-center gap-1.5 bg-game-darker/70 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-game-light-gray/30">
                      <HardDrive className="w-4 h-4 text-game-accent" />
                      <span className="text-sm text-gray-300">{formatBytes(game.size_bytes)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - Left side */}
        <div className="lg:col-span-2 space-y-8">
          {/* About section */}
          <section className="glass-card p-6 relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-game-accent/5 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-game-accent via-game-accent-light to-game-neon">About This Game</span>
              </h2>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{game.description || 'No description available for this game.'}</p>
              </div>
            </div>
          </section>
          
          {/* Screenshots section */}
          {game.screenshots && game.screenshots.length > 0 && (
            <section className="glass-card p-6 relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-game-neon/5 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-game-accent via-game-accent-light to-game-neon">Screenshots</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {game.screenshots.map((screenshot, index) => (
                    <div key={index} className="rounded-lg overflow-hidden border border-game-light-gray/30 hover:border-game-accent/50 transition-all duration-300 group">
                      <Image 
                        src={screenshot} 
                        alt={`${game.title} screenshot ${index + 1}`} 
                        width={600} 
                        height={338} 
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
        
        {/* Sidebar - Right side */}
        <div className="space-y-8">
          {/* Download section */}
          <section className="glass-card p-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-game-accent/5 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-game-accent via-game-accent-light to-game-neon">Download</span>
              </h2>
              
              <div className="space-y-4">
                {downloadLoading && (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner size="medium" text="Preparing download..." />
                  </div>
                )}
                
                {!downloadLoading && downloadLinks && downloadLinks.length > 0 ? (
                  downloadLinks.map((link, index) => (
                    <button 
                      key={index}
                      onClick={() => handleDownload(link)}
                      className="flex items-center justify-between w-full px-4 py-3 bg-game-darker/70 backdrop-blur-sm rounded-lg border border-game-light-gray/30 hover:border-game-accent/50 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-game-accent/20 flex items-center justify-center group-hover:bg-game-accent/30 transition-all duration-300">
                          <Download className="w-5 h-5 text-game-accent" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{link.host || 'Direct Download'}</div>
                          {game.size_bytes && (
                            <div className="text-sm text-gray-400">{formatBytes(game.size_bytes)}</div>
                          )}
                        </div>
                      </div>
                      <div className="bg-game-accent/20 px-3 py-1 rounded-full text-xs font-medium text-game-accent-light group-hover:bg-game-accent/30 transition-all duration-300">
                        Download
                      </div>
                    </button>
                  ))
                ) : !downloadLoading && (
                  <div className="flex items-center justify-center h-20 bg-game-darker/50 rounded-lg border border-game-light-gray/20">
                    <p className="text-gray-400">No download links available</p>
                  </div>
                )}
              </div>
            </div>
          </section>
          
          {/* System requirements section */}
          {(game.minimum_requirements || game.recommended_requirements) && (
            <section className="glass-card p-6 relative overflow-hidden">
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-game-neon/5 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-game-accent via-game-accent-light to-game-neon">System Requirements</span>
                </h2>
                
                <div className="space-y-6">
                  {/* Minimum requirements */}
                  {game.minimum_requirements && Object.keys(game.minimum_requirements).length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-game-accent-light">Minimum</h3>
                      <ul className="space-y-3">
                        {Object.entries(game.minimum_requirements).map(([key, value]) => (
                          <li key={key} className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {key === 'os' && <Monitor className="w-4 h-4 text-game-accent" />}
                              {key === 'processor' && <Cpu className="w-4 h-4 text-game-accent" />}
                              {key === 'memory' && <HardDrive className="w-4 h-4 text-game-accent" />}
                              {key === 'graphics' && <Star className="w-4 h-4 text-game-accent" />}
                              {key === 'storage' && <HardDrive className="w-4 h-4 text-game-accent" />}
                            </div>
                            <div>
                              <span className="text-sm font-medium text-white capitalize">{key}: </span>
                              <span className="text-sm text-gray-300">{value}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Recommended requirements */}
                  {game.recommended_requirements && Object.keys(game.recommended_requirements).length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-game-accent-light">Recommended</h3>
                      <ul className="space-y-3">
                        {Object.entries(game.recommended_requirements).map(([key, value]) => (
                          <li key={key} className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {key === 'os' && <Monitor className="w-4 h-4 text-game-accent" />}
                              {key === 'processor' && <Cpu className="w-4 h-4 text-game-accent" />}
                              {key === 'memory' && <HardDrive className="w-4 h-4 text-game-accent" />}
                              {key === 'graphics' && <Star className="w-4 h-4 text-game-accent" />}
                              {key === 'storage' && <HardDrive className="w-4 h-4 text-game-accent" />}
                            </div>
                            <div>
                              <span className="text-sm font-medium text-white capitalize">{key}: </span>
                              <span className="text-sm text-gray-300">{value}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
          
          {/* Game details section */}
          <section className="glass-card p-6 relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-game-accent/5 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-game-accent via-game-accent-light to-game-neon">Game Details</span>
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Developer</span>
                  <span className="text-white font-medium">{game.developer || 'Unknown'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Publisher</span>
                  <span className="text-white font-medium">{game.publisher || 'Unknown'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Release Date</span>
                  <span className="text-white font-medium">{new Date(game.release_date).toLocaleDateString()}</span>
                </div>
                {game.version && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Version</span>
                    <span className="text-white font-medium">{game.version}</span>
                  </div>
                )}
                {game.size_bytes && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Size</span>
                    <span className="text-white font-medium">{formatBytes(game.size_bytes)}</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
