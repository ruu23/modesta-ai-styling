import { Link } from 'react-router-dom';
import { Shirt, Sparkles, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Index() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-8 px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-rose mb-4">
          <Shirt className="w-10 h-10 text-primary-foreground" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground">
            Your Digital Closet
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Organize your wardrobe, plan outfits, and discover your style
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="gradient-rose text-primary-foreground border-0 hover:opacity-90">
            <Link to="/closet">
              <Sparkles className="w-5 h-5 mr-2" />
              Explore Your Closet
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/outfit-builder">
              <Palette className="w-5 h-5 mr-2" />
              Build an Outfit
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
