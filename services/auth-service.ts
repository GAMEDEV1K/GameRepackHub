import { supabase } from '../lib/supabase-client';

// Tipul de date pentru utilizator
export type User = {
  email: string;
  name: string;
  id?: string;
};

// Clasa de serviciu pentru autentificare
class AuthService {
  // Verifică dacă utilizatorul este autentificat
  async isAuthenticated(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    const { data, error } = await supabase.auth.getSession();
    return data.session !== null;
  }

  // Obține utilizatorul curent
  async getCurrentUser(): Promise<User | null> {
    if (typeof window === 'undefined') return null;
    
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      return null;
    }
    
    const user = data.session.user;
    return {
      id: user.id,
      email: user.email || '',
      name: user.email?.split('@')[0] || 'User'
    };
  }

  // Autentifică utilizatorul
  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (!data.user) {
      throw new Error('No user returned from authentication');
    }
    
    return {
      id: data.user.id,
      email: data.user.email || '',
      name: data.user.email?.split('@')[0] || 'User'
    };
  }

  // Înregistrează un utilizator nou
  async register(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (!data.user) {
      throw new Error('No user returned from registration');
    }
    
    return {
      id: data.user.id,
      email: data.user.email || '',
      name: data.user.email?.split('@')[0] || 'User'
    };
  }

  // Deconectează utilizatorul
  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new Error(error.message);
    }
  }
}

// Exportăm o instanță a serviciului
export const authService = new AuthService();
