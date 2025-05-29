import { Game, DownloadLink } from '../types/game';
import { supabase, getGameBySlug } from './supabase';

// Function to get a game with download links
export async function getGameWithDownloadLinks(slug: string): Promise<Game | null> {
  try {
    // Get the game by slug
    const game = await getGameBySlug(slug);
    
    if (!game) {
      return null;
    }
    
    // Get download links for the game from Supabase
    const { data: downloadLinks, error } = await supabase
      .from('download_links')
      .select('*')
      .eq('game_id', game.id)
      .order('type', { ascending: true })
      .order('part', { ascending: true });
    
    if (error) {
      console.error('Error fetching download links:', error);
      return { ...game, download_links: [] };
    }
    
    // Combine the game with download links
    const gameWithDetails: Game = {
      ...game,
      download_links: downloadLinks || [],
      description: getGameDescription(slug),
      screenshots: getGameScreenshots(slug),
      system_requirements: getGameSystemRequirements(slug)
    };
    
    return gameWithDetails;
  } catch (error) {
    console.error('Error in getGameWithDownloadLinks:', error);
    return null;
  }
}

// Function to get a game description
function getGameDescription(slug: string): string {
  const descriptions: Record<string, string> = {
    'forza-horizon-5': 'Your Ultimate Horizon Adventure awaits! Explore the vibrant open world landscapes of Mexico with limitless, fun driving action in the world\'s greatest cars. Lead breathtaking expeditions across the vibrant and ever-evolving open world landscapes of Mexico with limitless, fun driving action in hundreds of the world\'s greatest cars.\n\nThis is an open world racing game set in Mexico, featuring over 500 cars to collect and race. The game includes various race types, challenges, and a dynamic weather system that affects gameplay.',
    'grand-theft-auto-v': 'When a young street hustler, a retired bank robber, and a terrifying psychopath find themselves entangled with some of the most frightening and deranged elements of the criminal underworld, the U.S. government, and the entertainment industry, they must pull off a series of dangerous heists to survive in a ruthless city in which they can trust nobody — least of all each other.\n\nGrand Theft Auto V offers players the option to explore the award-winning world of Los Santos and Blaine County in resolutions of up to 4k and beyond, as well as the chance to experience the game running at 60 frames per second.'
  };
  
  return descriptions[slug] || 'No description available.';
}

// Function to get game screenshots
function getGameScreenshots(slug: string): string[] {
  const screenshots: Record<string, string[]> = {
    'forza-horizon-5': [
      '/images/games/forza-horizon-5-screenshot-1.jpg',
      '/images/games/forza-horizon-5-screenshot-2.jpg',
      '/images/games/forza-horizon-5-screenshot-3.jpg',
      '/images/games/forza-horizon-5-screenshot-4.jpg'
    ],
    'grand-theft-auto-v': [
      '/images/games/gta-v-screenshot-1.jpg',
      '/images/games/gta-v-screenshot-2.jpg',
      '/images/games/gta-v-screenshot-3.jpg',
      '/images/games/gta-v-screenshot-4.jpg'
    ]
  };
  
  return screenshots[slug] || [];
}

// Function to get system requirements for a game
function getGameSystemRequirements(slug: string) {
  const requirements: Record<string, any> = {
    'forza-horizon-5': {
      minimum: {
        os: 'Windows 10 version 15063.0 or higher',
        processor: 'Intel i5-4460 or AMD Ryzen 3 1200',
        memory: '8 GB RAM',
        graphics: 'NVidia GTX 970 OR AMD RX 470',
        directx: 'DirectX 12',
        storage: '110 GB available space'
      },
      recommended: {
        os: 'Windows 10 version 15063.0 or higher',
        processor: 'Intel i5-8400 or AMD Ryzen 5 1500X',
        memory: '16 GB RAM',
        graphics: 'NVidia GTX 1070 OR AMD RX 590',
        directx: 'DirectX 12',
        storage: '110 GB available space'
      }
    },
    'grand-theft-auto-v': {
      minimum: {
        os: 'Windows 10 64 Bit, Windows 8.1 64 Bit, Windows 8 64 Bit, Windows 7 64 Bit Service Pack 1',
        processor: 'Intel Core 2 Quad CPU Q6600 @ 2.40GHz (4 CPUs) / AMD Phenom 9850 Quad-Core Processor (4 CPUs) @ 2.5GHz',
        memory: '4 GB RAM',
        graphics: 'NVIDIA 9800 GT 1GB / AMD HD 4870 1GB (DX 10, 10.1, 11)',
        directx: 'Version 10',
        storage: '72 GB available space'
      },
      recommended: {
        os: 'Windows 10 64 Bit, Windows 8.1 64 Bit, Windows 8 64 Bit, Windows 7 64 Bit Service Pack 1',
        processor: 'Intel Core i5 3470 @ 3.2GHz (4 CPUs) / AMD X8 FX-8350 @ 4GHz (8 CPUs)',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GTX 660 2GB / AMD HD 7870 2GB',
        directx: 'Version 11',
        storage: '72 GB available space'
      }
    }
  };
  
  return requirements[slug] || {
    minimum: {
      os: 'Not specified',
      processor: 'Not specified',
      memory: 'Not specified',
      graphics: 'Not specified',
      directx: 'Not specified',
      storage: 'Not specified'
    }
  };
}

// Function to check if a user is the owner of a game
export async function isGameOwner(gameId: string, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('user_id')
      .eq('id', gameId)
      .single();
    
    if (error || !data) {
      console.error('Error checking game ownership:', error);
      return false;
    }
    
    return data.user_id === userId;
  } catch (error) {
    console.error('Error in isGameOwner:', error);
    return false;
  }
}

// Function to add a new download link
export async function addDownloadLink(gameId: string, downloadLink: Omit<Omit<DownloadLink, 'id'>, 'game_id'> & { game_id?: string | number }): Promise<DownloadLink | null> {
  try {
    // Încearcă să adauge link-ul de descărcare
    const { data, error } = await supabase
      .from('download_links')
      .insert([{
        ...downloadLink,
        game_id: gameId
      }])
      .select()
      .single();
    
    // Dacă tabelul nu există, creăm un obiect manual
    if (error && error.code === '42P01') {
      console.log('Tabelul download_links nu există încă. Vom returna un obiect manual.');
      
      // Returnează un obiect manual cu datele link-ului
      return {
        id: '1',
        game_id: gameId,
        name: downloadLink.name,
        url: downloadLink.url,
        type: downloadLink.type || 'direct',
        part: downloadLink.part || 1
      };
    }
    
    if (error) {
      console.error('Error adding download link:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in addDownloadLink:', error);
    return null;
  }
}

// Function to update an existing download link
export async function updateDownloadLink(linkId: string, downloadLink: Partial<DownloadLink>): Promise<DownloadLink | null> {
  try {
    const { data, error } = await supabase
      .from('download_links')
      .update(downloadLink)
      .eq('id', linkId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating download link:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateDownloadLink:', error);
    return null;
  }
}

// Function to delete a download link
export async function deleteDownloadLink(linkId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('download_links')
      .delete()
      .eq('id', linkId);
    
    if (error) {
      console.error('Error deleting download link:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteDownloadLink:', error);
    return false;
  }
}

// Function to get all download links for a game
export async function getDownloadLinks(gameId: string): Promise<DownloadLink[]> {
  try {
    // Încearcă să obțină link-urile de descărcare
    const { data, error } = await supabase
      .from('download_links')
      .select('*')
      .eq('game_id', gameId)
      .order('type', { ascending: true })
      .order('part', { ascending: true });
    
    // Dacă tabelul nu există, returnează un array gol
    if (error && error.code === '42P01') {
      console.log('Tabelul download_links nu există încă. Vom returna un array gol.');
      return [];
    }
    
    if (error) {
      console.error('Error fetching download links:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getDownloadLinks:', error);
    return [];
  }
}

// Function to delete a game and all its download links
export async function deleteGame(gameId: string): Promise<boolean> {
  try {
    // Mai întâi ștergem toate link-urile de descărcare asociate jocului
    const { error: linksError } = await supabase
      .from('download_links')
      .delete()
      .eq('game_id', gameId);
    
    if (linksError) {
      console.error('Error deleting game download links:', linksError);
      return false;
    }
    
    // Apoi ștergem jocul
    const { error: gameError } = await supabase
      .from('games')
      .delete()
      .eq('id', gameId);
    
    if (gameError) {
      console.error('Error deleting game:', gameError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteGame:', error);
    return false;
  }
}
