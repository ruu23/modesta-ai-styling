import { useState } from 'react';
import { useCloset } from '@/hooks/useCloset';
import { ClosetHeader } from '@/components/closet/ClosetHeader';
import { FilterSidebar } from '@/components/closet/FilterSidebar';
import { ClosetItemCard } from '@/components/closet/ClosetItemCard';
import { ItemDetailModal } from '@/components/closet/ItemDetailModal';
import { BulkActionBar } from '@/components/closet/BulkActionBar';
import { EmptyCloset } from '@/components/closet/EmptyCloset';
import { ClosetSkeleton } from '@/components/closet/ClosetSkeleton';
import { AddItemModal } from '@/components/closet/AddItemModal';
import { ClosetItem } from '@/types/closet';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme';

export default function Closet() {
  const { toast } = useToast();
  const {
    items,
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
    deleteItem,
    deleteItems,
    toggleSelectItem,
    clearSelection,
    clearFilters,
  } = useCloset();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClosetItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleViewItem = (item: ClosetItem) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const handleEditItem = () => {
    toast({
      title: "Edit Item",
      description: "Edit functionality coming soon!",
    });
  };

  const handleDeleteItem = (id?: string) => {
    const itemId = id || selectedItem?.id;
    if (itemId) {
      deleteItem(itemId);
      setIsDetailOpen(false);
      setSelectedItem(null);
      toast({
        title: "Item Deleted",
        description: "The item has been removed from your closet.",
      });
    }
  };

  const handleBulkDelete = () => {
    deleteItems(selectedItems);
    toast({
      title: "Items Deleted",
      description: `${selectedItems.length} items have been removed.`,
    });
  };

  const handleCreateOutfit = () => {
    toast({
      title: "Create Outfit",
      description: "Outfit maker coming soon!",
    });
  };

  const handleBulkMove = () => {
    toast({
      title: "Move Items",
      description: "Move functionality coming soon!",
    });
  };

  const handleBulkTag = () => {
    toast({
      title: "Tag Items",
      description: "Tagging functionality coming soon!",
    });
  };

  const handleBulkExport = () => {
    toast({
      title: "Export Items",
      description: "Export functionality coming soon!",
    });
  };

  const handleAddItem = (item: Parameters<typeof addItem>[0]) => {
    addItem(item);
    toast({
      title: "Item Added",
      description: "Your new item has been added to the closet!",
    });
  };

  const similarItems = selectedItem ? findSimilarItems(selectedItem) : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <ClosetHeader
          stats={stats}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
          activeFilterCount={activeFilterCount}
          onFilterClick={() => setIsFilterOpen(true)}
          onAddClick={() => setIsAddOpen(true)}
        />

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Showing {items.length} items</span>
          </div>
        )}

        {/* Content */}
        <div className="mt-8">
          {isLoading ? (
            <ClosetSkeleton />
          ) : items.length === 0 ? (
            <EmptyCloset
              onAddClick={() => setIsAddOpen(true)}
              hasFilters={activeFilterCount > 0}
              onClearFilters={clearFilters}
            />
          ) : viewMode === 'grid' ? (
            <div className="masonry">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <ClosetItemCard
                    item={item}
                    isSelected={selectedItems.includes(item.id)}
                    onSelect={() => toggleSelectItem(item.id)}
                    onView={() => handleViewItem(item)}
                    onEdit={handleEditItem}
                    onDelete={() => handleDeleteItem(item.id)}
                    onCreateOutfit={handleCreateOutfit}
                    selectionMode={selectedItems.length > 0}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-fade-in flex items-center gap-4 p-4 glass rounded-xl shadow-soft hover:shadow-glow transition-all cursor-pointer"
                  style={{ animationDelay: `${index * 30}ms` }}
                  onClick={() => handleViewItem(item)}
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.brand}</p>
                    <p className="text-xs text-muted-foreground mt-1">Worn {item.wornCount}x</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        categoryCounts={categoryCounts}
        brands={brands}
        onClearFilters={clearFilters}
      />

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedItem(null);
        }}
        onEdit={handleEditItem}
        onDelete={() => handleDeleteItem()}
        onCreateOutfit={handleCreateOutfit}
        similarItems={similarItems}
        onViewSimilar={(item) => {
          setSelectedItem(item);
        }}
      />

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddItem}
      />

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedItems.length}
        onClearSelection={clearSelection}
        onDelete={handleBulkDelete}
        onMove={handleBulkMove}
        onTag={handleBulkTag}
        onExport={handleBulkExport}
        onCreateOutfit={handleCreateOutfit}
      />
    </div>
  );
}
