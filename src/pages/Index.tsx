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

// Egyptian Ankh-inspired decorative symbol
const EgyptianSymbol = () => (
  <svg width="24" height="36" viewBox="0 0 24 36" fill="none" className="text-gold">
    <ellipse cx="12" cy="8" rx="8" ry="7" stroke="currentColor" strokeWidth="0.75" />
    <line x1="12" y1="15" x2="12" y2="35" stroke="currentColor" strokeWidth="0.75" />
    <line x1="4" y1="22" x2="20" y2="22" stroke="currentColor" strokeWidth="0.75" />
  </svg>
);

// Lotus-inspired decorative element
const LotusDecoration = () => (
  <svg width="80" height="20" viewBox="0 0 80 20" fill="none" className="text-gold">
    <path d="M40 2 L44 10 L40 8 L36 10 Z" stroke="currentColor" strokeWidth="0.5" fill="none" />
    <path d="M40 8 L40 18" stroke="currentColor" strokeWidth="0.5" />
    <line x1="0" y1="10" x2="32" y2="10" stroke="currentColor" strokeWidth="0.5" />
    <line x1="48" y1="10" x2="80" y2="10" stroke="currentColor" strokeWidth="0.5" />
  </svg>
);

export default memo(function Index() {
  return (
    <AppLayout showBottomNav={true}>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Minimal Zara-Style Header */}
        <header className="absolute top-0 left-0 right-0 z-50">
          <div className="px-8 md:px-16 lg:px-24 py-6 flex items-center justify-between">
            <span className="font-serif text-sm tracking-[0.2em] text-foreground">MODESTA</span>
            <nav className="hidden md:flex items-center gap-16">
              {navItems.map((item) => (
                <Link 
                  key={item.to} 
                  to={item.to}
                  className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <ThemeToggle />
          </div>
          <div className="h-px bg-border/30" />
        </header>

        {/* Full-Width Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center relative min-h-screen">
          {/* Subtle Egyptian pattern background */}
          <div className="absolute inset-0 pattern-egyptian opacity-30" />
          
          {/* Content */}
          <div className="relative z-10 text-center px-8 max-w-5xl mx-auto">
            {/* Top decorative line */}
            <div className="flex justify-center mb-16">
              <LotusDecoration />
            </div>

            {/* Main Typography - Zara-style bold serif */}
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-medium tracking-[0.02em] leading-[0.9] mb-8">
              THE ART OF
              <br />
              <span className="italic">Dressing</span>
            </h1>
            
            {/* Minimal tagline */}
            <p className="text-muted-foreground tracking-[0.2em] uppercase text-xs md:text-sm mb-16">
              Modest Fashion Elevated
            </p>

            {/* Egyptian symbol as accent */}
            <div className="flex justify-center mb-16">
              <EgyptianSymbol />
            </div>

            {/* CTA - Minimal, Zara-style */}
            <Link 
              to="/closet"
              className="inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] text-foreground hover:text-gold transition-colors duration-300 group"
            >
              <span>Discover Collection</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1} />
            </Link>
          </div>

          {/* Bottom gold line accent */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
            <div className="w-px h-16 bg-gradient-to-b from-gold to-transparent" />
          </div>
        </main>

        {/* Minimal Zara-Style Footer */}
        <footer className="absolute bottom-0 left-0 right-0">
          <div className="h-px bg-border/30" />
          <div className="px-8 md:px-16 lg:px-24 py-5 flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">© 2024 Modesta</span>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="text-gold opacity-60">
              <ellipse cx="8" cy="5" rx="5" ry="4.5" stroke="currentColor" strokeWidth="0.5" />
              <line x1="8" y1="9.5" x2="8" y2="23" stroke="currentColor" strokeWidth="0.5" />
              <line x1="3" y1="14" x2="13" y2="14" stroke="currentColor" strokeWidth="0.5" />
            </svg>
            <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">Cairo · Dubai · London</span>
          </div>
        </footer>
      </div>
    </AppLayout>
  );
});