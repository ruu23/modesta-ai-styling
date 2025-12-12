import { useState } from 'react';
import { Eye, Wand2, Pencil, Trash2, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ClosetItem, CATEGORIES, COLORS } from '@/types/closet';

interface ClosetItemCardProps {
  item: ClosetItem;
  isSelected: boolean;
  onSelect: () => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCreateOutfit: () => void;
  selectionMode: boolean;
}

export function ClosetItemCard({
  item,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onDelete,
  onCreateOutfit,
  selectionMode,
}: ClosetItemCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const categoryLabel = CATEGORIES.find(c => c.value === item.category)?.label || item.category;
  const primaryColor = COLORS.find(c => c.value === item.colors[0]);

  return (
    <div
      className={`masonry-item group relative rounded-xl overflow-hidden bg-card shadow-soft transition-all duration-300 cursor-pointer ${
        isHovered ? 'shadow-glow scale-[1.02]' : ''
      } ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => selectionMode ? onSelect() : onView()}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={item.images[0]}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Selection Checkbox */}
        {(selectionMode || isSelected) && (
          <div
            className={`absolute top-3 left-3 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
              isSelected 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-card/80 backdrop-blur-sm border border-border'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            {isSelected && <Check className="w-4 h-4" />}
          </div>
        )}

        {/* Category Badge */}
        <Badge className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm text-foreground border-0 text-xs">
          {categoryLabel}
        </Badge>

        {/* Color Dot */}
        {primaryColor && (
          <div
            className="absolute bottom-3 left-3 w-5 h-5 rounded-full border-2 border-card shadow-sm"
            style={{ backgroundColor: primaryColor.hex }}
            title={primaryColor.label}
          />
        )}

        {/* Worn Count */}
        {item.wornCount > 0 && (
          <Badge className="absolute bottom-3 right-3 bg-card/80 backdrop-blur-sm text-foreground border-0 text-xs">
            Worn {item.wornCount}x
          </Badge>
        )}

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-foreground/60 backdrop-blur-sm flex items-center justify-center gap-2 transition-opacity duration-300 ${
            isHovered && !selectionMode ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className="w-10 h-10 rounded-full bg-card text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreateOutfit();
            }}
            className="w-10 h-10 rounded-full bg-card text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            title="Create Outfit"
          >
            <Wand2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="w-10 h-10 rounded-full bg-card text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-10 h-10 rounded-full bg-card text-foreground flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Item Name (visible in list view) */}
      <div className="p-3 hidden group-[.list-view]:block">
        <h3 className="font-medium text-foreground truncate">{item.name}</h3>
        <p className="text-sm text-muted-foreground">{item.brand}</p>
      </div>
    </div>
  );
}
