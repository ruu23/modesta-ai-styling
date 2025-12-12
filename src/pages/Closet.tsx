import { useState, useMemo, useCallback, Suspense } from 'react';
import { useCloset } from '@/hooks/useCloset';
import { ClosetHeader } from '@/components/closet/ClosetHeader';
import { ClosetItemCard } from '@/components/closet/ClosetItemCard';
import { BulkActionBar } from '@/components/closet/BulkActionBar';
import { EmptyCloset } from '@/components/closet/EmptyCloset';
import { ClosetSkeleton } from '@/components/closet/ClosetSkeleton';
import { ClosetItem } from '@/types/closet';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme';
import { AppLayout } from '@/components/layout';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { LazyLoad } from '@/components/ui/LazyLoad';
import { LazyFilterSidebar, LazyItemDetailModal, LazyAddItemModal } from '@/lib/lazyComponents';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export default function Closet() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
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

  const handleViewItem = useCallback((item: ClosetItem) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  }, []);

  const handleEditItem = useCallback(() => {
    toast({
      title: "Edit Item",
      description: "Edit functionality coming soon!",
    });
  }, [toast]);

  const handleDeleteItem = useCallback((id?: string) => {
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
  }, [selectedItem?.id, deleteItem, toast]);

  const handleBulkDelete = useCallback(() => {
    deleteItems(selectedItems);
    toast({
      title: "Items Deleted",
      description: `${selectedItems.length} items have been removed.`,
    });
  }, [deleteItems, selectedItems, toast]);

  const handleCreateOutfit = useCallback(() => {
    toast({
      title: "Create Outfit",
      description: "Outfit maker coming soon!",
    });
  }, [toast]);

  const handleBulkMove = useCallback(() => {
    toast({
      title: "Move Items",
      description: "Move functionality coming soon!",
    });
  }, [toast]);

  const handleBulkTag = useCallback(() => {
    toast({
      title: "Tag Items",
      description: "Tagging functionality coming soon!",
    });
  }, [toast]);

  const handleBulkExport = useCallback(() => {
    toast({
      title: "Export Items",
      description: "Export functionality coming soon!",
    });
  }, [toast]);

  const handleAddItem = useCallback((item: Parameters<typeof addItem>[0]) => {
    addItem(item);
    toast({
      title: "Item Added",
      description: "Your new item has been added to the closet!",
    });
  }, [addItem, toast]);

  const similarItems = useMemo(() => 
    selectedItem ? findSimilarItems(selectedItem) : [], 
    [selectedItem, findSimilarItems]
  );

  return (
    <AppLayout showBottomNav={true}>
      <div className="min-h-screen bg-background">
        {/* Theme Toggle - Desktop */}
        <div className="fixed top-4 right-4 z-50 hidden md:block">
          <ThemeToggle />
        </div>
        
        <div className="container max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-8">
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
            <div className="mt-3 md:mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span>Showing {items.length} items</span>
            </div>
          )}

          {/* Content */}
          <div className="mt-4 md:mt-8">
            {isLoading ? (
              <ClosetSkeleton />
            ) : items.length === 0 ? (
              <EmptyCloset
                onAddClick={() => setIsAddOpen(true)}
                hasFilters={activeFilterCount > 0}
                onClearFilters={clearFilters}
              />
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
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
                    className="animate-fade-in flex items-center gap-3 md:gap-4 p-3 md:p-4 glass rounded-xl shadow-soft hover:shadow-glow transition-all cursor-pointer min-h-[72px]"
                    style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
                    onClick={() => handleViewItem(item)}
                  >
                    <OptimizedImage
                      src={item.images[0]}
                      alt={item.name}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate text-sm md:text-base">{item.name}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">{item.brand}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 md:mt-1">Worn {item.wornCount}x</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground text-sm md:text-base">${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter - Bottom Sheet */}
        {isMobile ? (
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0">
              <LazyLoad minHeight="400px">
                <Suspense fallback={<div className="p-4">Loading filters...</div>}>
                  <LazyFilterSidebar
                    isOpen={true}
                    onClose={() => setIsFilterOpen(false)}
                    filters={filters}
                    setFilters={setFilters}
                    categoryCounts={categoryCounts}
                    brands={brands}
                    onClearFilters={clearFilters}
                  />
                </Suspense>
              </LazyLoad>
            </SheetContent>
          </Sheet>
        ) : (
          isFilterOpen && (
            <Suspense fallback={<div className="p-4">Loading filters...</div>}>
              <LazyFilterSidebar
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                setFilters={setFilters}
                categoryCounts={categoryCounts}
                brands={brands}
                onClearFilters={clearFilters}
              />
            </Suspense>
          )
        )}

        {/* Item Detail Modal - Lazy loaded */}
        {isDetailOpen && (
          <Suspense fallback={null}>
            <LazyItemDetailModal
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
          </Suspense>
        )}

        {/* Add Item Modal - Lazy loaded */}
        {isAddOpen && (
          <Suspense fallback={null}>
            <LazyAddItemModal
              isOpen={isAddOpen}
              onClose={() => setIsAddOpen(false)}
              onAdd={handleAddItem}
            />
          </Suspense>
        )}

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
    </AppLayout>
  );
}
