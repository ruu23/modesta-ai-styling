import { Link } from 'react-router-dom';
import { Shirt, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/theme';
import { AppLayout } from '@/components/layout';
import { memo } from 'react';

const navItems = [
  { to: '/closet', label: 'Collection' },
  { to: '/outfit-builder', label: 'Create' },
  { to: '/chat', label: 'Advisor' },
  { to: '/calendar', label: 'Calendar' },
];

export default memo(function Index() {
  return (
    <AppLayout showBottomNav={true}>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="w-full px-8 md:px-16 py-6 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <Shirt className="w-5 h-5 text-gold" strokeWidth={1} />
            <span className="text-editorial">MODESTA</span>
          </div>
          <ThemeToggle />
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center container-luxury section-spacing">
          {/* Egyptian decorative element */}
          <div className="divider-papyrus max-w-48 mb-16" />
          
          {/* Main headline */}
          <h1 className="text-display text-center mb-8">
            Your Digital
            <br />
            <span className="italic text-gold">Wardrobe</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-muted-foreground text-center text-subhead max-w-lg mb-16">
            Curate your collection with elegance.
            <br />
            Discover your signature style.
          </p>

          {/* Egyptian decorative element */}
          <div className="divider-gold max-w-24 mb-16" />

          {/* CTA Button */}
          <Link to="/closet">
            <button className="btn-luxury-gold group">
              Enter Collection
              <ArrowRight className="w-4 h-4 ml-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </button>
          </Link>

          {/* Navigation Links */}
          <nav className="mt-24 flex flex-wrap justify-center gap-10 md:gap-16">
            {navItems.map((item) => (
              <Link 
                key={item.to} 
                to={item.to}
                className="text-muted-foreground text-editorial hover:text-gold transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </main>

        {/* Footer */}
        <footer className="w-full px-8 md:px-16 py-10 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-muted-foreground text-editorial">
              Modest Fashion Redefined
            </p>
            
            {/* Egyptian-inspired decorative element */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-px bg-gold" />
              <div className="w-2 h-2 border border-gold rotate-45" />
              <div className="w-12 h-px bg-gold" />
            </div>
            
            <p className="text-muted-foreground text-editorial">
              © 2024 Modesta
            </p>
          </div>
        </footer>
      </div>
    </AppLayout>
  );
});