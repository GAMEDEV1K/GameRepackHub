// Data type for games
export type Game = {
  id: number | string;
  title: string;
  slug: string;
  image: string;
  genre: string[];
  release_date: string;
  size_bytes: number;
  download_count: number;
  featured: boolean;
  description?: string;
  screenshots?: string[];
  developer?: string;
  publisher?: string;
  version?: string;
  download_links?: DownloadLink[];
  system_requirements?: SystemRequirements;
  metadata?: {
    cracked_by?: string;
    steam_id?: string;
    [key: string]: any;
  };
  // We removed the user_id field which doesn't exist in the database schema
  created_at?: string; // Date when the game was posted
  updated_at?: string; // Date of the last update
  rating?: number; // Game rating (optional)
};

// Data type for download links
export type DownloadLink = {
  id: number | string;
  game_id?: number | string; // ID of the game associated with the download link
  name: string;
  url: string;
  type: 'direct' | 'torrent' | 'google_drive' | 'mega' | 'other';
  size_bytes?: number;
  part?: number;
  total_parts?: number;
};

// Data type for system requirements
export type SystemRequirements = {
  minimum: {
    os: string;
    processor: string;
    memory: string;
    graphics: string;
    directx: string;
    storage: string;
    additional_notes?: string;
  };
  recommended?: {
    os: string;
    processor: string;
    memory: string;
    graphics: string;
    directx: string;
    storage: string;
    additional_notes?: string;
  };
};
