import { Shirt, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyClosetProps {
  onAddClick: () => void;
  hasFilters: boolean;
  onClearFilters: () => void;
}

export function EmptyCloset({ onAddClick, hasFilters, onClearFilters }: EmptyClosetProps) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
          <Shirt className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No items match your filters</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Try adjusting your filters to see more items
        </p>
        <Button variant="outline" onClick={onClearFilters}>
          Clear All Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-32 h-32 rounded-full gradient-rose/20 flex items-center justify-center mb-6 relative">
        <div className="w-24 h-24 rounded-full bg-card flex items-center justify-center shadow-soft">
          <Shirt className="w-12 h-12 text-primary" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full gradient-rose flex items-center justify-center shadow-glow">
          <Plus className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>
      <h3 className="text-2xl font-semibold text-foreground mb-2">Your closet is empty</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Start adding your favorite pieces to build your digital wardrobe
      </p>
      <Button onClick={onAddClick} className="gradient-rose text-primary-foreground border-0 hover:opacity-90">
        <Plus className="w-4 h-4 mr-2" />
        Add Your First Item
      </Button>
    </div>
  );
}
