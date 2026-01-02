import { useState, useEffect, useMemo, useCallback } from 'react';
import { ClosetItem, ClosetFilters, SortOption, Category } from '@/types/closet';
import { supabase } from '@/integrations/supabase';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useCloset() {
  const { user } = useAuth();
  const [items, setItems] = useState<ClosetItem[]>([]);
  const [filters, setFilters] = useState<ClosetFilters>({
    categories: [],
    colors: [],
    occasions: [],
    seasons: [],
    brands: [],
    searchQuery: '',
  });
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch items from Supabase
  const fetchItems = useCallback(async () => {
    if (!user) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('closet_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform from DB format to app format
      const transformedItems: ClosetItem[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        images: item.images || [],
        category: item.category as Category,
        colors: item.colors || [],
        brand: item.brand || '',
        size: item.size || '',
        price: Number(item.price) || 0,
        occasions: item.occasions || [],
        seasons: item.seasons || [],
        pattern: item.pattern || '',
        wornCount: item.worn_count || 0,
        lastWorn: item.last_worn,
        purchaseDate: item.purchase_date || '',
        createdAt: item.created_at,
      }));

      setItems(transformedItems);
    } catch (error) {
      console.error('Error fetching closet items:', error);
      toast.error('Failed to load closet items');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load items on mount and when user changes
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let result = [...items];

    if (filters.categories.length > 0) {
      result = result.filter(item => filters.categories.includes(item.category));
    }
    if (filters.colors.length > 0) {
      result = result.filter(item => 
        item.colors.some(c => filters.colors.includes(c))
      );
    }
    if (filters.occasions.length > 0) {
      result = result.filter(item => 
        item.occasions.some(o => filters.occasions.includes(o))
      );
    }
    if (filters.seasons.length > 0) {
      result = result.filter(item => 
        item.seasons.some(s => filters.seasons.includes(s))
      );
    }
    if (filters.brands.length > 0) {
      result = result.filter(item => filters.brands.includes(item.brand));
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'mostWorn':
        result.sort((a, b) => b.wornCount - a.wornCount);
        break;
      case 'color':
        result.sort((a, b) => (a.colors[0] || '').localeCompare(b.colors[0] || ''));
        break;
      case 'category':
        result.sort((a, b) => a.category.localeCompare(b.category));
        break;
    }

    return result;
  }, [items, filters, sortBy]);

  // Stats
  const stats = useMemo(() => {
    const uniqueCategories = new Set(items.map(item => item.category));
    const totalValue = items.reduce((sum, item) => sum + item.price, 0);
    return {
      totalItems: items.length,
      categories: uniqueCategories.size,
      totalValue,
    };
  }, [items]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      hijabs: 0,
      abayas: 0,
      tops: 0,
      bottoms: 0,
      dresses: 0,
      outerwear: 0,
      accessories: 0,
      shoes: 0,
    };
    items.forEach(item => {
      counts[item.category]++;
    });
    return counts;
  }, [items]);

  // Brand list
  const brands = useMemo(() => {
    return [...new Set(items.map(item => item.brand))].sort();
  }, [items]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    return (
      filters.categories.length +
      filters.colors.length +
      filters.occasions.length +
      filters.seasons.length +
      filters.brands.length
    );
  }, [filters]);

  // Find similar items
  const findSimilarItems = (item: ClosetItem): ClosetItem[] => {
    return items
      .filter(i => i.id !== item.id)
      .filter(i => 
        i.category === item.category ||
        i.colors.some(c => item.colors.includes(c))
      )
      .slice(0, 6);
  };

  // Add item
  const addItem = async (
    item: Omit<ClosetItem, 'id' | 'createdAt' | 'wornCount' | 'lastWorn'>
  ): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to add items');
      return false;
    }

    try {
      // Ensure numeric fields are never empty strings
      const priceValue = typeof item.price === 'number' && !isNaN(item.price) ? item.price : 0;
      
      const { data, error } = await supabase
        .from('closet_items')
        .insert({
          user_id: user.id,
          name: item.name,
          images: item.images,
          category: item.category,
          colors: item.colors,
          brand: item.brand || null,
          size: item.size || null,
          price: priceValue,
          occasions: item.occasions,
          seasons: item.seasons,
          pattern: item.pattern || null,
          purchase_date: item.purchaseDate || null,
        })
        .select()
        .single();

      if (error) throw error;

      const newItem: ClosetItem = {
        id: data.id,
        name: data.name,
        images: data.images || [],
        category: data.category as Category,
        colors: data.colors || [],
        brand: data.brand || '',
        size: data.size || '',
        price: Number(data.price) || 0,
        occasions: data.occasions || [],
        seasons: data.seasons || [],
        pattern: data.pattern || '',
        wornCount: data.worn_count || 0,
        lastWorn: data.last_worn,
        purchaseDate: data.purchase_date || '',
        createdAt: data.created_at,
      };

      setItems(prev => [newItem, ...prev]);
      toast.success('Item added to closet');
      return true;
    } catch (error) {
      console.error('Error adding item:', error);
      const err = error as { message?: string; details?: string; hint?: string };
      const description = [err?.message, err?.details, err?.hint].filter(Boolean).join(' — ');
      toast.error('Failed to add item', description ? { description } : undefined);
      return false;
    }
  };

  // Update item
  const updateItem = async (id: string, updates: Partial<ClosetItem>) => {
    if (!user) return;

    try {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.images !== undefined) dbUpdates.images = updates.images;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.colors !== undefined) dbUpdates.colors = updates.colors;
      if (updates.brand !== undefined) dbUpdates.brand = updates.brand;
      if (updates.size !== undefined) dbUpdates.size = updates.size;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.occasions !== undefined) dbUpdates.occasions = updates.occasions;
      if (updates.seasons !== undefined) dbUpdates.seasons = updates.seasons;
      if (updates.pattern !== undefined) dbUpdates.pattern = updates.pattern;
      if (updates.wornCount !== undefined) dbUpdates.worn_count = updates.wornCount;
      if (updates.lastWorn !== undefined) dbUpdates.last_worn = updates.lastWorn;
      if (updates.purchaseDate !== undefined) dbUpdates.purchase_date = updates.purchaseDate;

      const { error } = await supabase
        .from('closet_items')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    }
  };

  // Delete item
  const deleteItem = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('closet_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== id));
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
      toast.success('Item deleted');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  // Delete multiple items
  const deleteItems = async (ids: string[]) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('closet_items')
        .delete()
        .in('id', ids)
        .eq('user_id', user.id);

      if (error) throw error;

      setItems(prev => prev.filter(item => !ids.includes(item.id)));
      setSelectedItems([]);
      toast.success(`${ids.length} items deleted`);
    } catch (error) {
      console.error('Error deleting items:', error);
      toast.error('Failed to delete items');
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedItems(filteredItems.map(item => item.id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      colors: [],
      occasions: [],
      seasons: [],
      brands: [],
      searchQuery: '',
    });
  };

  const markAsWorn = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      await updateItem(id, {
        wornCount: item.wornCount + 1,
        lastWorn: new Date().toISOString(),
      });
    }
  };

  return {
    items: filteredItems,
    allItems: items,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    selectedItems,
    isLoading,
    stats,
    categoryCounts,
    brands,
    activeFilterCount,
    findSimilarItems,
    addItem,
    updateItem,
    deleteItem,
    deleteItems,
    toggleSelectItem,
    selectAll,
    clearSelection,
    clearFilters,
    markAsWorn,
    refetch: fetchItems,
  };
}
