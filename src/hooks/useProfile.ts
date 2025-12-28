import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  country: string | null;
  city: string | null;
  brands: string[];
  hijab_style: string;
  favorite_colors: string[];
  style_personality: string[];
  has_completed_onboarding: boolean;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const getProfile = async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  };

  const updateProfile = async (
    userId: string,
    updates: Partial<Profile>
  ): Promise<{ error: Error | null }> => {
    const { error } = await supabase
      .from('profile')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    return { error: error as Error | null };
  };

  const completeOnboarding = async (
    userId: string,
    data: {
      full_name: string;
      country: string;
      city: string;
      brands: string[];
      hijab_style: string;
      favorite_colors: string[];
      style_personality: string[];
    }
  ): Promise<{ error: Error | null }> => {
    // 1. Perform the UPSERT to Supabase
    const { error } = await supabase
      .from('profile')
      .upsert({
        id: userId,
        ...data,
        has_completed_onboarding: true,
        updated_at: new Date().toISOString(),
      });

    if (!error) {
      // 2. Clean up the PENDING data (from useAuth and Onboarding)
      // We use the same key here as we do in useAuth to stay consistent
      localStorage.removeItem('modesta-pending-profile');
      
      // 3. Mark completion locally for instant Route Guard reaction
      localStorage.setItem('onboardingCompleted', 'true');
    }

    return { error: error as Error | null };
  };

  return { getProfile, updateProfile, completeOnboarding };
};