import { Link } from 'react-router-dom';
import { Shirt, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme';
import { AppLayout } from '@/components/layout';
import { memo } from 'react';

const navItems = [
  { to: '/closet', label: 'Explore Collection' },
  { to: '/outfit-builder', label: 'Create Outfit' },
  { to: '/chat', label: 'Style Advisor' },
  { to: '/calendar', label: 'Plan Wardrobe' },
];

export default memo(function Index() {
  return (
    <AppLayout showBottomNav={true}>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="w-full px-6 md:px-12 py-6 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <Shirt className="w-6 h-6 text-gold" strokeWidth={1} />
            <span className="text-editorial text-foreground">MODESTA</span>
          </div>
          <ThemeToggle />
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center container-full section-spacing">
          {/* Gold divider */}
          <div className="divider-gold max-w-32 mb-12" />
          
          {/* Main headline */}
          <h1 className="text-display text-center mb-6">
            Your Digital
            <br />
            <span className="italic">Wardrobe</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-muted-foreground text-center text-lg md:text-xl max-w-xl mb-12 tracking-wide">
            Curate. Style. Elevate.
          </p>

          {/* Gold divider */}
          <div className="divider-gold max-w-16 mb-16" />

          {/* CTA Button */}
          <Link to="/closet">
            <button className="btn-luxury-gold group">
              Enter Collection
              <ArrowRight className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>

          {/* Navigation Links */}
          <nav className="mt-20 flex flex-wrap justify-center gap-8 md:gap-12">
            {navItems.map((item) => (
              <Link 
                key={item.to} 
                to={item.to}
                className="text-muted-foreground text-sm uppercase tracking-[0.15em] hover:text-foreground transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </main>

        {/* Footer */}
        <footer className="w-full px-6 md:px-12 py-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-xs uppercase tracking-[0.15em]">
              Modest Fashion Redefined
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-gold" />
              <Shirt className="w-4 h-4 text-gold" strokeWidth={1} />
              <div className="w-8 h-px bg-gold" />
            </div>
            <p className="text-muted-foreground text-xs uppercase tracking-[0.15em]">
              © 2024 Modesta
            </p>
          </div>
        </footer>
      </div>
    </AppLayout>
  );
});