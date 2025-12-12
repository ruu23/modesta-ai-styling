import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCloset } from '@/hooks/useCloset';
import { ClosetPanel } from '@/components/outfit-builder/ClosetPanel';
import { OutfitCanvas, CanvasItem } from '@/components/outfit-builder/OutfitCanvas';
import { AISuggestionsPanel } from '@/components/outfit-builder/AISuggestionsPanel';
import { OutfitToolbar } from '@/components/outfit-builder/OutfitToolbar';
import { ClosetItem } from '@/types/closet';
import { ThemeToggle } from '@/components/theme';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function OutfitBuilder() {
  const { toast } = useToast();
  const { allItems } = useCloset();

  // Canvas state
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [background, setBackground] = useState('white');
  
  // History for undo/redo
  const [history, setHistory] = useState<CanvasItem[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Outfit metadata
  const [outfitName, setOutfitName] = useState('');
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);

  // Tutorial
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

  // Show tutorial on first visit
  useEffect(() => {
    const seen = localStorage.getItem('outfit-builder-tutorial-seen');
    if (!seen) {
      setShowTutorial(true);
      setHasSeenTutorial(false);
    } else {
      setHasSeenTutorial(true);
    }
  }, []);

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('outfit-builder-tutorial-seen', 'true');
    setHasSeenTutorial(true);
  };

  // Track history
  const updateCanvasWithHistory = useCallback((newItems: CanvasItem[]) => {
    setCanvasItems(newItems);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newItems]);
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const handleSetCanvasItems: React.Dispatch<React.SetStateAction<CanvasItem[]>> = useCallback((action) => {
    setCanvasItems(prev => {
      const newItems = typeof action === 'function' ? action(prev) : action;
      // Don't update history on every drag move, only on significant changes
      if (newItems.length !== prev.length) {
        setHistory(h => [...h.slice(0, historyIndex + 1), newItems]);
        setHistoryIndex(i => i + 1);
      }
      return newItems;
    });
  }, [historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setCanvasItems(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setCanvasItems(history[historyIndex + 1]);
    }
  };

  const handleClear = () => {
    updateCanvasWithHistory([]);
    setSelectedItemId(null);
    toast({ title: 'Canvas cleared' });
  };

  const handleSaveDraft = () => {
    localStorage.setItem('outfit-draft', JSON.stringify({
      items: canvasItems,
      name: outfitName,
      occasions: selectedOccasions,
      seasons: selectedSeasons,
      background,
    }));
    toast({ title: 'Draft saved!' });
  };

  const handleSave = () => {
    if (canvasItems.length === 0) {
      toast({ title: 'Add some items first', variant: 'destructive' });
      return;
    }

    const outfit = {
      id: Date.now().toString(),
      name: outfitName || `Outfit ${new Date().toLocaleDateString()}`,
      items: canvasItems.map(ci => ci.item.id),
      occasions: selectedOccasions,
      seasons: selectedSeasons,
      createdAt: new Date().toISOString(),
    };

    const savedOutfits = JSON.parse(localStorage.getItem('saved-outfits') || '[]');
    savedOutfits.push(outfit);
    localStorage.setItem('saved-outfits', JSON.stringify(savedOutfits));

    toast({ title: 'Outfit saved!', description: outfit.name });
  };

  const handleShare = () => {
    toast({ title: 'Share', description: 'Sharing coming soon!' });
  };

  const handleTryAvatar = () => {
    toast({ title: 'Avatar', description: 'Avatar preview coming soon!' });
  };

  const handleDragStart = (item: ClosetItem) => {
    // Optional: add visual feedback
  };

  const handleAddItem = (item: ClosetItem) => {
    const newCanvasItem: CanvasItem = {
      id: `${item.id}-${Date.now()}`,
      item,
      x: 150 + Math.random() * 50,
      y: 100 + Math.random() * 50,
      width: 120,
      height: 150,
      zIndex: canvasItems.length,
    };
    handleSetCanvasItems(prev => [...prev, newCanvasItem]);
    toast({ title: `Added ${item.name}` });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          handleUndo();
        } else if (e.key === 'y') {
          e.preventDefault();
          handleRedo();
        } else if (e.key === 's') {
          e.preventDefault();
          handleSaveDraft();
        }
      }
      if (e.key === 'Delete' && selectedItemId) {
        handleSetCanvasItems(prev => prev.filter(ci => ci.id !== selectedItemId));
        setSelectedItemId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemId, historyIndex]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/closet">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Outfit Builder</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowTutorial(true)}
          >
            <HelpCircle className="w-5 h-5" />
          </Button>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Closet */}
        <div className="w-72 flex-shrink-0">
          <ClosetPanel items={allItems} onDragStart={handleDragStart} />
        </div>

        {/* Center - Canvas */}
        <div className="flex-1">
          <OutfitCanvas
            canvasItems={canvasItems}
            setCanvasItems={handleSetCanvasItems}
            selectedItemId={selectedItemId}
            setSelectedItemId={setSelectedItemId}
            background={background}
            setBackground={setBackground}
          />
        </div>

        {/* Right Panel - AI Suggestions */}
        <div className="w-72 flex-shrink-0">
          <AISuggestionsPanel
            canvasItems={canvasItems}
            allItems={allItems}
            outfitName={outfitName}
            setOutfitName={setOutfitName}
            selectedOccasions={selectedOccasions}
            setSelectedOccasions={setSelectedOccasions}
            selectedSeasons={selectedSeasons}
            setSelectedSeasons={setSelectedSeasons}
            onSave={handleSave}
            onAddItem={handleAddItem}
          />
        </div>
      </div>

      {/* Bottom Toolbar */}
      <OutfitToolbar
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onSaveDraft={handleSaveDraft}
        onShare={handleShare}
        onTryAvatar={handleTryAvatar}
        itemCount={canvasItems.length}
      />

      {/* Tutorial Dialog */}
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Welcome to Outfit Builder! ✨</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">1</div>
              <div>
                <h4 className="font-medium text-foreground">Drag items from your closet</h4>
                <p className="text-sm text-muted-foreground">Browse categories on the left and drag items onto the canvas</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">2</div>
              <div>
                <h4 className="font-medium text-foreground">Position and resize</h4>
                <p className="text-sm text-muted-foreground">Click items to select, drag to move, use corners to resize</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">3</div>
              <div>
                <h4 className="font-medium text-foreground">Get AI suggestions</h4>
                <p className="text-sm text-muted-foreground">Click "Get AI Help" for styling tips and compatibility scores</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">4</div>
              <div>
                <h4 className="font-medium text-foreground">Save your creation</h4>
                <p className="text-sm text-muted-foreground">Name your outfit, add tags, and save it to your collection</p>
              </div>
            </div>
            <div className="pt-2 text-xs text-muted-foreground">
              <strong>Keyboard shortcuts:</strong> Ctrl+Z (Undo), Ctrl+Y (Redo), Ctrl+S (Save), Delete (Remove item)
            </div>
          </div>
          <Button onClick={closeTutorial} className="w-full gradient-rose text-primary-foreground border-0">
            Got it, let's build!
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
