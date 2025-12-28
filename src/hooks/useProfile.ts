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

  const updateProfile = async (userId: string, updates: Partial<Profile>): Promise<{ error: Error | null }> => {
    const { error } = await supabase
      .from('profile')
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
      hijab_style: string;
      favorite_colors: string[];
      style_personality: string[];
    }
  ): Promise<{ error: Error | null }> => {
    const { error } = await supabase
      .from('profile')
      .update({
        full_name: data.full_name,
        country: data.country,
        city: data.city,
        brands: data.brands.join(', '),
        hijab_styles: data.hijab_style,
        preferred_colors: data.favorite_colors,
        style_personality: data.style_personality,
      })
      .eq('id', userId);

    return { error: error as Error | null };
  };

  return { getProfile, updateProfile, completeOnboarding };
};
