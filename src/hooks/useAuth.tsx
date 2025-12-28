import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  hasCompletedOnboarding: boolean;
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

  // --- HELPER: Fetch onboarding status with better error handling ---
  const fetchOnboardingStatus = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profile')
        .select('has_completed_onboarding')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) throw error;
      setHasCompletedOnboarding(profile?.has_completed_onboarding ?? false);
    } catch (err) {
      console.error("Error fetching onboarding status:", err);
      setHasCompletedOnboarding(false);
    }
  };

  useEffect(() => {
    // 1. Check current session immediately on mount
    const initAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      if (initialSession?.user) {
        setSession(initialSession);
        setUser(initialSession.user);
        await fetchOnboardingStatus(initialSession.user.id);
      }
      // Only stop loading AFTER profile check is done
      setLoading(false);
    };

    initAuth();

    // 2. Listen for Auth Changes (Sign in, Sign out, Password recovery, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Re-fetch status if the user changes or signs in
          await fetchOnboardingStatus(currentSession.user.id);
          
          // Handle LocalStorage sync if data exists from onboarding flow
          if (event === 'SIGNED_IN') {
            const pendingData = localStorage.getItem('modesta-pending-profile'); // Match key in Onboarding.tsx
            if (pendingData) {
              const profileData = JSON.parse(pendingData);
              const { error } = await supabase
                .from('profile')
                .upsert({ 
                  id: currentSession.user.id, 
                  ...profileData, 
                  has_completed_onboarding: true 
                });
              
              if (!error) {
                localStorage.removeItem('modesta-pending-profile');
                setHasCompletedOnboarding(true);
              }
            }
          }
        } else {
          setHasCompletedOnboarding(false);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: metadata
      }
    });
  };

  const signOut = async () => {
    // Clean up all local states
    localStorage.removeItem('modesta-pending-profile');
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      hasCompletedOnboarding, 
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
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}