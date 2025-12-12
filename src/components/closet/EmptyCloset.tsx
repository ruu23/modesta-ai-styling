import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/EmptyState';
import { WardrobeIllustration, SearchEmptyIllustration } from '@/components/ui/Illustrations';

interface EmptyClosetProps {
  onAddClick: () => void;
  hasFilters: boolean;
  onClearFilters: () => void;
}

export function EmptyCloset({ onAddClick, hasFilters, onClearFilters }: EmptyClosetProps) {
  if (hasFilters) {
    return (
      <EmptyState
        illustration={<SearchEmptyIllustration />}
        title="No items match your filters"
        description="Try adjusting your filters or search to see more items from your wardrobe"
        action={{
          label: 'Clear All Filters',
          onClick: onClearFilters,
          variant: 'outline',
        }}
      />
    );
  }

  return (
    <EmptyState
      illustration={<WardrobeIllustration />}
      title="Your closet is empty"
      description="Start adding your favorite pieces to build your digital wardrobe and get personalized outfit suggestions"
      action={{
        label: 'Add Your First Item',
        onClick: onAddClick,
        icon: <Plus className="w-4 h-4 mr-2" />,
      }}
    />
  );
}
