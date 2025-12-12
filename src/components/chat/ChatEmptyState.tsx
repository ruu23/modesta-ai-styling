import { Sparkles, MessageSquare } from 'lucide-react';

export function ChatEmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 rounded-full gradient-rose flex items-center justify-center mb-6 shadow-glow">
        <Sparkles className="w-10 h-10 text-primary-foreground" />
      </div>
      
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Hi! I'm Modesta AI ✨
      </h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Your personal AI stylist. I can help you create outfits, 
        plan your wardrobe, and give you fashion advice tailored to your style.
      </p>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Available 24/7</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span>Quick responses</span>
        </div>
      </div>
    </div>
  );
}
