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
        {/* Minimal Header */}
        <header className="absolute top-0 left-0 right-0 z-50 px-8 md:px-16 lg:px-24 py-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shirt className="w-5 h-5 text-gold" strokeWidth={1} />
            <span className="text-[11px] uppercase tracking-[0.3em] text-foreground">Modesta</span>
          </div>
          <nav className="hidden md:flex items-center gap-12">
            {navItems.map((item) => (
              <Link 
                key={item.to} 
                to={item.to}
                className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
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

        {/* Minimal Footer */}
        <footer className="absolute bottom-0 left-0 right-0 px-8 md:px-16 lg:px-24 py-6 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>© 2024</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-px bg-gold" />
            <div className="w-1.5 h-1.5 border border-gold rotate-45" />
            <div className="w-6 h-px bg-gold" />
          </div>
          <span>Cairo · Dubai · London</span>
        </footer>
      </div>
    </AppLayout>
  );
});