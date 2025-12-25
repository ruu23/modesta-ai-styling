import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  country: string | null;
  city: string | null;
  brands: string[];
  hijab_styles: string[];
  preferred_colors: string[];
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const getProfile = async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  };

  const updateProfile = async (userId: string, updates: Partial<Profile>): Promise<{ error: Error | null }> => {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
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
      hijab_styles: string[];
      preferred_colors: string[];
    }
  ): Promise<{ error: Error | null }> => {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: data.full_name,
        country: data.country,
        city: data.city,
        brands: data.brands,
        hijab_styles: data.hijab_styles,
        preferred_colors: data.preferred_colors,
      })
      .eq('id', userId);

    return { error: error as Error | null };
  };

  return { getProfile, updateProfile, completeOnboarding };
};
