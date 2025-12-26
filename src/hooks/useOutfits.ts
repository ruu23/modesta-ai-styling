import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Outfit {
  id: string;
  name: string;
  items: string[];
  previewImage: string | null;
  occasions: string[];
  seasons: string[];
  favorite: boolean;
  wornCount: number;
  lastWorn: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useOutfits() {
  const { user } = useAuth();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch outfits from Supabase
  const fetchOutfits = useCallback(async () => {
    if (!user) {
      setOutfits([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedOutfits: Outfit[] = (data || []).map(outfit => ({
        id: outfit.id,
        name: outfit.name,
        items: outfit.items || [],
        previewImage: outfit.preview_image,
        occasions: outfit.occasions || [],
        seasons: outfit.seasons || [],
        favorite: outfit.favorite || false,
        wornCount: outfit.worn_count || 0,
        lastWorn: outfit.last_worn,
        createdAt: outfit.created_at,
        updatedAt: outfit.updated_at,
      }));

      setOutfits(transformedOutfits);
    } catch (error) {
      console.error('Error fetching outfits:', error);
      toast.error('Failed to load outfits');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOutfits();
  }, [fetchOutfits]);

  // Add outfit
  const addOutfit = async (outfit: Omit<Outfit, 'id' | 'createdAt' | 'updatedAt' | 'wornCount' | 'lastWorn'>) => {
    if (!user) {
      toast.error('Please sign in to create outfits');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('outfits')
        .insert({
          user_id: user.id,
          name: outfit.name,
          items: outfit.items,
          preview_image: outfit.previewImage,
          occasions: outfit.occasions,
          seasons: outfit.seasons,
          favorite: outfit.favorite,
        })
        .select()
        .single();

      if (error) throw error;

      const newOutfit: Outfit = {
        id: data.id,
        name: data.name,
        items: data.items || [],
        previewImage: data.preview_image,
        occasions: data.occasions || [],
        seasons: data.seasons || [],
        favorite: data.favorite || false,
        wornCount: data.worn_count || 0,
        lastWorn: data.last_worn,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setOutfits(prev => [newOutfit, ...prev]);
      toast.success('Outfit created');
      return newOutfit;
    } catch (error) {
      console.error('Error adding outfit:', error);
      toast.error('Failed to create outfit');
      return null;
    }
  };

  // Update outfit
  const updateOutfit = async (id: string, updates: Partial<Outfit>) => {
    if (!user) return;

    try {
      const dbUpdates: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.items !== undefined) dbUpdates.items = updates.items;
      if (updates.previewImage !== undefined) dbUpdates.preview_image = updates.previewImage;
      if (updates.occasions !== undefined) dbUpdates.occasions = updates.occasions;
      if (updates.seasons !== undefined) dbUpdates.seasons = updates.seasons;
      if (updates.favorite !== undefined) dbUpdates.favorite = updates.favorite;
      if (updates.wornCount !== undefined) dbUpdates.worn_count = updates.wornCount;
      if (updates.lastWorn !== undefined) dbUpdates.last_worn = updates.lastWorn;

      const { error } = await supabase
        .from('outfits')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setOutfits(prev => prev.map(outfit => 
        outfit.id === id ? { ...outfit, ...updates, updatedAt: new Date().toISOString() } : outfit
      ));
    } catch (error) {
      console.error('Error updating outfit:', error);
      toast.error('Failed to update outfit');
    }
  };

  // Delete outfit
  const deleteOutfit = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('outfits')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setOutfits(prev => prev.filter(outfit => outfit.id !== id));
      toast.success('Outfit deleted');
    } catch (error) {
      console.error('Error deleting outfit:', error);
      toast.error('Failed to delete outfit');
    }
  };

  // Toggle favorite
  const toggleFavorite = async (id: string) => {
    const outfit = outfits.find(o => o.id === id);
    if (outfit) {
      await updateOutfit(id, { favorite: !outfit.favorite });
    }
  };

  // Mark as worn
  const markAsWorn = async (id: string) => {
    const outfit = outfits.find(o => o.id === id);
    if (outfit) {
      await updateOutfit(id, {
        wornCount: outfit.wornCount + 1,
        lastWorn: new Date().toISOString(),
      });
    }
  };

  // Get outfit by ID
  const getOutfitById = (id: string) => {
    return outfits.find(outfit => outfit.id === id);
  };

  return {
    outfits,
    isLoading,
    addOutfit,
    updateOutfit,
    deleteOutfit,
    toggleFavorite,
    markAsWorn,
    getOutfitById,
    refetch: fetchOutfits,
  };
}
