import { useState, useRef } from 'react';
import { X, Upload, Camera, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStorage } from '@/hooks/useStorage';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Category, 
  Occasion, 
  Season, 
  CATEGORIES, 
  OCCASIONS, 
  SEASONS, 
  COLORS 
} from '@/types/closet';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: {
    name: string;
    images: string[];
    category: Category;
    color: string[];
    brand: string;
    size: string;
    price: number;
    occasions: Occasion[];
    seasons: Season[];
    pattern: string;
    purchaseDate: string;
    tags?: Record<string, unknown>;
  }) => void;
}

export function AddItemModal({ isOpen, onClose, onAdd }: AddItemModalProps) {
  const { uploadImage, isUploading } = useStorage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [colors, setColors] = useState<string[]>([]);
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [pattern, setPattern] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [aiTags, setAiTags] = useState<Record<string, unknown> | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setSelectedFile(file);
    
    // Create preview
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processAndUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please select an image first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const base64 = await fileToBase64(selectedFile);

      // Step 1: Analyze the image with AI
      toast({
        title: "Analyzing image...",
        description: "AI is analyzing your clothing item.",
      });

      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-clothing', {
        body: { imageBase64: base64 },
      });

      if (analysisError) {
        console.error('Analysis error:', analysisError);
        toast({
          title: "Analysis failed",
          description: "Could not analyze image, but will continue with upload.",
          variant: "destructive",
        });
      } else if (analysisData?.analysis) {
        const analysis = analysisData.analysis;
        setAiTags(analysis);

        const allowedCategoryValues = new Set(CATEGORIES.map((c) => c.value));
        const allowedColorValues = new Set(COLORS.map((c) => c.value));
        const allowedOccasionValues = new Set(OCCASIONS.map((o) => o.value));
        const allowedSeasonValues = new Set(SEASONS.map((s) => s.value));

        const categoryAliases: Record<string, Category> = {
          hijab: 'hijabs',
          abaya: 'abayas',
          top: 'tops',
          bottom: 'bottoms',
          dress: 'dresses',
          accessory: 'accessories',
          shoe: 'shoes',
        };

        const rawCategory = typeof analysis.category === 'string' ? analysis.category.toLowerCase().trim() : '';
        const normalizedCategory = allowedCategoryValues.has(rawCategory)
          ? rawCategory
          : categoryAliases[rawCategory] ?? '';

        const rawColor = typeof analysis.color === 'string' ? analysis.color.toLowerCase().trim() : '';
        const normalizedColor = allowedColorValues.has(rawColor) ? rawColor : '';

        const normalizedBrand = typeof analysis.brand === 'string' ? analysis.brand.trim() : '';
        const normalizedName = typeof analysis.name === 'string' ? analysis.name.trim() : '';
        const normalizedPattern = typeof analysis.pattern === 'string' ? analysis.pattern.trim() : '';

        const normalizedOccasions: Occasion[] = Array.isArray(analysis.occasion)
          ? analysis.occasion
              .map((o: unknown) => (typeof o === 'string' ? o.toLowerCase().trim() : ''))
              .filter((o): o is Occasion => allowedOccasionValues.has(o as Occasion))
          : [];

        const normalizedSeasons: Season[] = Array.isArray(analysis.season)
          ? analysis.season
              .map((s: unknown) => (typeof s === 'string' ? s.toLowerCase().trim() : ''))
              .filter((s): s is Season => allowedSeasonValues.has(s as Season))
          : [];

        // Auto-fill form fields from AI analysis (validated against allowed values)
        if (normalizedCategory && !category) setCategory(normalizedCategory);
        if (normalizedColor && colors.length === 0) setColors([normalizedColor]);
        if (normalizedBrand && normalizedBrand !== 'Unknown' && !brand) setBrand(normalizedBrand);
        if (normalizedName && !name) setName(normalizedName);
        if (normalizedPattern && !pattern) setPattern(normalizedPattern);
        if (normalizedOccasions.length > 0 && occasions.length === 0) setOccasions(normalizedOccasions);
        if (normalizedSeasons.length > 0 && seasons.length === 0) setSeasons(normalizedSeasons);

        toast({
          title: "Analysis complete!",
          description: "Form fields have been auto-filled.",
        });
      }

      // Step 2: Process image with white background
      toast({
        title: "Processing image...",
        description: "Creating professional product photo.",
      });

      const { data: processData, error: processError } = await supabase.functions.invoke('process-clothing-image', {
        body: { imageBase64: base64 },
      });

      let finalImageUrl: string;

      if (processError || !processData?.processedImage) {
        console.error('Image processing error:', processError);
        toast({
          title: "Using original image",
          description: "Image processing unavailable, uploading original.",
        });
        // Fallback: upload original image
        const url = await uploadImage(selectedFile);
        if (!url) throw new Error('Failed to upload image');
        finalImageUrl = url;
      } else {
        // Upload processed image
        const processedBase64 = processData.processedImage;
        
        // Convert base64 to blob
        const base64Data = processedBase64.replace(/^data:image\/\w+;base64,/, '');
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        const blob = new Blob([binaryData], { type: 'image/png' });
        const processedFile = new File([blob], 'processed-clothing.png', { type: 'image/png' });
        
        const url = await uploadImage(processedFile);
        if (!url) throw new Error('Failed to upload processed image');
        finalImageUrl = url;
      }

      setImages(prev => [...prev, finalImageUrl]);
      setSelectedFile(null);
      setPreviewUrl('');

      toast({
        title: "Image ready!",
        description: "Your clothing item has been processed and uploaded.",
      });

    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: "Processing failed",
        description: "There was an error processing your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddUrlImage = () => {
    if (imageUrl.trim()) {
      setImages(prev => [...prev, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleColor = (color: string) => {
    setColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const toggleOccasion = (occasion: Occasion) => {
    setOccasions(prev => 
      prev.includes(occasion) ? prev.filter(o => o !== occasion) : [...prev, occasion]
    );
  };

  const toggleSeason = (season: Season) => {
    setSeasons(prev => 
      prev.includes(season) ? prev.filter(s => s !== season) : [...prev, season]
    );
  };

  const handleSubmit = () => {
    if (!name || !category || images.length === 0) {
      toast({
        title: "Missing required fields",
        description: "Please add an image, name, and category.",
        variant: "destructive",
      });
      return;
    }

    onAdd({
      name,
      images,
      category: category as Category,
      colors,
      brand,
      size,
      price: parseFloat(price) || 0,
      occasions,
      seasons,
      pattern,
      purchaseDate: purchaseDate || new Date().toISOString().split('T')[0],
      tags: aiTags || undefined,
    });

    // Reset form
    setName('');
    setImages([]);
    setImageUrl('');
    setCategory('');
    setColors([]);
    setBrand('');
    setSize('');
    setPrice('');
    setOccasions([]);
    setSeasons([]);
    setPattern('');
    setPurchaseDate('');
    setAiTags(null);
    setSelectedFile(null);
    setPreviewUrl('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)] px-6">
          <div className="space-y-6 py-4">
            {/* Image Upload Area */}
            <div className="space-y-3">
              <Label>Images *</Label>
              
              {/* Uploaded Images Preview */}
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {images.map((img, index) => (
                    <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected file preview */}
              {previewUrl && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-dashed border-primary">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl('');
                    }}
                    className="absolute top-1 right-1 p-1 bg-background/80 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Upload Buttons */}
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || isProcessing}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Select Image
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.setAttribute('capture', 'environment');
                        fileInputRef.current.click();
                        fileInputRef.current.removeAttribute('capture');
                      }
                    }}
                    disabled={isUploading || isProcessing}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Camera
                  </Button>
                </div>

                {/* Process & Upload Button */}
                {selectedFile && (
                  <Button
                    type="button"
                    onClick={processAndUpload}
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Analyze & Upload
                      </>
                    )}
                  </Button>
                )}

                <p className="text-xs text-muted-foreground">
                  JPEG, PNG, WebP, or GIF (max 5MB)
                </p>
              </div>

              {/* AI Tags Display */}
              {aiTags && (
                <div className="p-3 bg-muted rounded-lg space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    AI Analysis
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {(aiTags.style as string[])?.map((tag: string) => (
                      <span key={tag} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {aiTags.styling_tips && (
                    <p className="text-xs text-muted-foreground">
                      Tip: {(aiTags.styling_tips as string[])[0]}
                    </p>
                  )}
                </div>
              )}

              {/* URL Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Or paste image URL..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddUrlImage()}
                />
                <Button type="button" variant="outline" onClick={handleAddUrlImage}>
                  Add
                </Button>
              </div>
            </div>

            {/* Name */}
            <div>
              <Label>Name *</Label>
              <Input
                placeholder="e.g. Blue Denim Jacket"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Category */}
            <div>
              <Label>Category *</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Brand & Size */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Brand</Label>
                <Input
                  placeholder="e.g. Zara"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Size</Label>
                <Input
                  placeholder="e.g. M"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Price & Pattern */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Pattern</Label>
                <Input
                  placeholder="e.g. Solid, Striped"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Colors */}
            <div>
              <Label>Colors</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {COLORS.map(({ value, label, hex }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleColor(value)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      colors.includes(value)
                        ? 'border-primary scale-110'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                    style={{ backgroundColor: hex }}
                    title={label}
                  />
                ))}
              </div>
            </div>

            {/* Occasions */}
            <div>
              <Label>Occasions</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {OCCASIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleOccasion(value)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      occasions.includes(value)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Seasons */}
            <div>
              <Label>Seasons</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {SEASONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleSeason(value)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      seasons.includes(value)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Purchase Date */}
            <div>
              <Label>Purchase Date</Label>
              <Input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex gap-3 p-6 pt-0">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1" disabled={!name || !category || images.length === 0}>
            Add Item
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
