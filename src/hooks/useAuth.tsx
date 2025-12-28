import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    metadata?: { full_name?: string }
  ) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1️⃣ Auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // ✅ FIX: Sync pending profile after login / email confirmation
      if (event === 'SIGNED_IN' && session?.user) {
        setTimeout(() => {
          const pendingProfile = localStorage.getItem('modesta-pending-profile');

          if (pendingProfile) {
            const userData = JSON.parse(pendingProfile);

            supabase
              .from('profile')
              .upsert({
                id: session.user.id,
                full_name: userData.fullName,
                country: userData.country,
                city: userData.city,
                brands: userData.brands,
                hijab_style: userData.hijabStyle,
                favorite_colors: userData.favoriteColors,
                style_personality: userData.stylePersonality,
                updated_at: new Date().toISOString(),
              })
              .then(({ error }) => {
                if (!error) {
                  localStorage.removeItem('modesta-pending-profile');
                  console.log('✅ Pending profile synced successfully');
                } else {
                  console.error('❌ Failed to sync pending profile:', error);
                }
              });
          }
        }, 0);
      }
    });

    // 2️⃣ Check existing session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    metadata?: { full_name?: string }
  ) => {
    const redirectUrl = `${window.location.origin}/home`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata,
      },
    });

    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
