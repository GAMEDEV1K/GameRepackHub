import { createClient } from '@supabase/supabase-js';
import { Game, DownloadLink } from '../types/game';

// Configurare pentru Supabase (în producție, aceste valori ar trebui să fie în variabile de mediu)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// Creăm clientul Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

// Funcție pentru a obține un joc după slug
export async function getGameBySlug(slug: string): Promise<Game | null> {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('slug', slug)
      .single();
      
    if (error) {
      console.error('Error fetching game by slug:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getGameBySlug:', error);
    return null;
  }
};

// Funcție pentru a obține jocuri
export async function getGames({ limit = 10, category = '', sort = 'newest' }: { limit?: number; category?: string; sort?: string }) {
  try {
    let query = supabase.from('games').select('*');
    
    // Apply category filter
    if (category) {
      query = query.contains('genre', [category]);
    }
    
    // Apply sorting
    switch (sort) {
      case 'newest':
        query = query.order('release_date', { ascending: false });
        break;
      case 'oldest':
        query = query.order('release_date', { ascending: true });
        break;
      case 'name-asc':
        query = query.order('title', { ascending: true });
        break;
      case 'name-desc':
        query = query.order('title', { ascending: false });
        break;
      case 'size-asc':
        query = query.order('size_bytes', { ascending: true });
        break;
      case 'size-desc':
        query = query.order('size_bytes', { ascending: false });
        break;
      case 'popular':
        query = query.order('download_count', { ascending: false });
        break;
      default:
        query = query.order('release_date', { ascending: false });
    }
    
    // Apply limit
    query = query.limit(limit);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching games:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error in getGames:', error);
    return [];
  }
}



export async function getFeaturedGames() {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('featured', true)
      .limit(5);
    
    if (error) {
      console.error('Error fetching featured games:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error in getFeaturedGames:', error);
    return [];
  }
}

export async function searchGames(query: string) {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .ilike('title', `%${query}%`)
      .limit(10);
    
    if (error) {
      console.error('Error searching games:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error in searchGames:', error);
    return [];
  }
}

export async function getGameComments(gameId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles(username)')
    .eq('game_id', gameId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
  
  return data;
}

export async function addGameComment(gameId: string, userId: string, comment: string) {
  const { data, error } = await supabase
    .from('comments')
    .insert([
      { game_id: gameId, user_id: userId, comment }
    ])
  
  if (error) {
    console.error('Error adding comment:', error)
    return null
  }
  
  return data
}

export async function incrementDownloadCount(gameId: string) {
  const { data, error } = await supabase.rpc('increment_download_count', {
    game_id: gameId
  })
  
  if (error) {
    console.error('Error incrementing download count:', error)
    return false
  }
  
  return true
}
