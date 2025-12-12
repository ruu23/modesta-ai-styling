import { Shirt, Tag, DollarSign, Plus, Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SortOption } from '@/types/closet';

interface ClosetHeaderProps {
  stats: {
    totalItems: number;
    categories: number;
    totalValue: number;
  };
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  activeFilterCount: number;
  onFilterClick: () => void;
  onAddClick: () => void;
}

export function ClosetHeader({
  stats,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  activeFilterCount,
  onFilterClick,
  onAddClick,
}: ClosetHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-rose flex items-center justify-center">
            <Shirt className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">My Closet</h1>
        </div>
        <Button onClick={onAddClick} className="gradient-rose text-primary-foreground border-0 hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Add Items
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shirt className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">{stats.totalItems}</p>
              <p className="text-sm text-muted-foreground">Total Items</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-xl p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <Tag className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">{stats.categories}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-xl p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                ${stats.totalValue.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Value Estimate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center glass rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-[180px] glass border-0">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Added</SelectItem>
              <SelectItem value="mostWorn">Most Worn</SelectItem>
              <SelectItem value="color">Color</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter Button */}
        <Button
          variant="outline"
          onClick={onFilterClick}
          className="glass border-0 relative"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center gradient-rose text-primary-foreground border-0">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );
}
