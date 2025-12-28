import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  hasCompletedOnboarding: boolean; // Added this
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    // Helper function to fetch onboarding status
    const fetchOnboardingStatus = async (userId: string) => {
      const { data: profile } = await supabase
        .from('profile')
        .select('has_completed_onboarding')
        .eq('id', userId)
        .maybeSingle();
      
      setHasCompletedOnboarding(profile?.has_completed_onboarding ?? false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => { // Made this async
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchOnboardingStatus(session.user.id);
        } else {
          setHasCompletedOnboarding(false);
        }
        
        setLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(() => {
            const pendingData = localStorage.getItem('pendingProfileData');
            if (pendingData) {
              const profileData = JSON.parse(pendingData);
              // Ensure we use 'profile' singular to match your DB
              supabase.from('profile')
                .upsert({ id: session.user.id, ...profileData, has_completed_onboarding: true })
                .then(() => {
                  localStorage.removeItem('pendingProfileData');
                  setHasCompletedOnboarding(true);
                });
            }
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchOnboardingStatus(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: metadata
      }
    });
    return { error };
  };

  const signOut = async () => {
    localStorage.removeItem('onboardingCompleted');
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      hasCompletedOnboarding, // Exposed to the app
      signIn, 
      signUp, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}