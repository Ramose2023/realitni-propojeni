import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';

// Typy pro kontext
type AuthContextType = {
  supabase: SupabaseClient;
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<any>;
  getCurrentUser: () => Promise<User | null>;
};

// Vytvoření kontextu
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Supabase klient
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Provider komponenta
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Načtení session při inicializaci
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Chyba při načítání session:', error);
      } else {
        setSession(data.session);
        setUser(data.session?.user || null);
      }
      setLoading(false);
    };

    getSession();

    // Nastavení listeneru pro změny autentizace
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    // Cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Registrace uživatele
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Pokud registrace proběhla úspěšně, vytvoříme záznam v tabulce users
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: email,
              user_type: userData.user_type,
              full_name: userData.full_name,
              phone: userData.phone || '',
              status: 'active',
              auth_provider: 'email',
            },
          ]);

        if (profileError) {
          throw profileError;
        }

        // Vytvoření profilu podle typu uživatele
        if (userData.user_type === 'seller') {
          await supabase
            .from('seller_profiles')
            .insert([{ user_id: data.user.id }]);
        } else if (userData.user_type === 'agent') {
          await supabase.from('agent_profiles').insert([
            {
              user_id: data.user.id,
              average_rating: 0,
              successful_transactions: 0,
            },
          ]);

          await supabase.from('agent_credits').insert([
            {
              agent_id: data.user.id,
              balance: 0,
            },
          ]);
        }
      }

      return data;
    } catch (error) {
      console.error('Chyba při registraci:', error);
      throw error;
    }
  };

  // Přihlášení uživatele
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Chyba při přihlášení:', error);
      throw error;
    }
  };

  // Přihlášení přes Google
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Chyba při přihlášení přes Google:', error);
      throw error;
    }
  };

  // Odhlášení uživatele
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Chyba při odhlášení:', error);
      throw error;
    }
  };

  // Získání aktuálního uživatele
  const getCurrentUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        throw error;
      }
      return data.user;
    } catch (error) {
      console.error('Chyba při získávání uživatele:', error);
      return null;
    }
  };

  const value = {
    supabase,
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    getCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook pro použití kontextu
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth musí být použit uvnitř AuthProvider');
  }
  return context;
};
