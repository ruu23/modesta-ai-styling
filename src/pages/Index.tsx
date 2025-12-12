import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/theme';
import { AppLayout } from '@/components/layout';
import { memo } from 'react';

const navItems = [
  { to: '/closet', label: 'Collection' },
  { to: '/outfit-builder', label: 'Create' },
  { to: '/chat', label: 'Advisor' },
  { to: '/calendar', label: 'Calendar' },
];

// Egyptian Ankh symbol
const AnkhSymbol = ({ className = "" }: { className?: string }) => (
  <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className={className}>
    <ellipse cx="8" cy="5" rx="5" ry="4.5" stroke="currentColor" strokeWidth="0.5" />
    <line x1="8" y1="9.5" x2="8" y2="23" stroke="currentColor" strokeWidth="0.5" />
    <line x1="3" y1="14" x2="13" y2="14" stroke="currentColor" strokeWidth="0.5" />
  </svg>
);

// Thin gold decorative line with Egyptian motif
const EgyptianDivider = () => (
  <div className="flex items-center justify-center gap-4 py-16">
    <div className="w-24 h-px bg-gold/40" />
    <div className="w-1.5 h-1.5 border border-gold/60 rotate-45" />
    <div className="w-24 h-px bg-gold/40" />
  </div>
);

// Corner accent for sections
const CornerAccent = ({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) => {
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0 rotate-90',
    'bottom-left': 'bottom-0 left-0 -rotate-90',
    'bottom-right': 'bottom-0 right-0 rotate-180',
  };
  
  return (
    <svg 
      width="40" 
      height="40" 
      viewBox="0 0 40 40" 
      fill="none" 
      className={`absolute ${positionClasses[position]} text-gold/30`}
    >
      <path d="M0 40 L0 10 L10 0 L40 0" stroke="currentColor" strokeWidth="0.5" fill="none" />
    </svg>
  );
};

// Editorial image placeholder with aspect ratio
const EditorialImage = ({ 
  aspect = "4/5", 
  className = "",
  overlay = false,
  children
}: { 
  aspect?: string;
  className?: string;
  overlay?: boolean;
  children?: React.ReactNode;
}) => (
  <div 
    className={`relative bg-muted overflow-hidden ${className}`}
    style={{ aspectRatio: aspect }}
  >
    {/* Simulated editorial image with gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted-foreground/10 to-muted" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.3)_100%)]" />
    {overlay && (
      <div className="absolute inset-0 bg-background/20" />
    )}
    {children}
  </div>
);

export default memo(function Index() {
  return (
    <AppLayout showBottomNav={true}>
      <div className="min-h-screen bg-background">
        {/* Minimal Zara-Style Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="px-6 md:px-12 lg:px-20 py-5 flex items-center justify-between">
            <span className="font-serif text-sm tracking-[0.2em] text-foreground">MODESTA</span>
            <nav className="hidden md:flex items-center gap-14">
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

        {/* Hero Section - Full Width Editorial */}
        <section className="relative h-screen">
          <EditorialImage aspect="auto" className="absolute inset-0 h-full">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </EditorialImage>
          
          {/* Hero Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-end pb-24 px-6">
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-4">
              The Art of Modest Elegance
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.02em] text-center mb-8">
              <span className="italic">Timeless</span> Grace
            </h1>
            <Link 
              to="/closet"
              className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-foreground hover:text-gold transition-colors duration-300 group"
            >
              <span>View Collection</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1} />
            </Link>
          </div>

          {/* Gold line accent at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        </section>

        {/* Editorial Grid Section 1 */}
        <section className="px-6 md:px-12 lg:px-20 py-24">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Large feature image */}
            <div className="col-span-2 lg:col-span-2 lg:row-span-2 relative group">
              <EditorialImage aspect="3/4" className="w-full">
                <CornerAccent position="top-left" />
                <CornerAccent position="bottom-right" />
              </EditorialImage>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Featured</p>
                <h3 className="font-serif text-xl md:text-2xl">The Essence Collection</h3>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/0 group-hover:bg-gold/40 transition-colors duration-500" />
            </div>

            {/* Smaller grid images */}
            <div className="relative group">
              <EditorialImage aspect="4/5" className="w-full" />
              <div className="absolute bottom-4 left-4">
                <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">Abayas</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/0 group-hover:bg-gold/40 transition-colors duration-500" />
            </div>

            <div className="relative group">
              <EditorialImage aspect="4/5" className="w-full" />
              <div className="absolute bottom-4 left-4">
                <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">Hijabs</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/0 group-hover:bg-gold/40 transition-colors duration-500" />
            </div>
          </div>
        </section>

        {/* Egyptian Divider */}
        <EgyptianDivider />

        {/* Full Width Statement */}
        <section className="px-6 md:px-12 lg:px-20 py-12 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold/70 mb-6">Crafted for You</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-[0.02em] max-w-3xl mx-auto leading-relaxed">
            Where <span className="italic">tradition</span> meets
            <br />contemporary elegance
          </h2>
        </section>

        {/* Editorial Grid Section 2 - Three Column */}
        <section className="px-6 md:px-12 lg:px-20 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { title: 'Modest Dresses', subtitle: 'Evening' },
              { title: 'Layered Sets', subtitle: 'Daily' },
              { title: 'Accessories', subtitle: 'Details' },
            ].map((item, index) => (
              <div key={index} className="relative group">
                <EditorialImage aspect="3/4" className="w-full" />
                <div className="absolute bottom-6 left-6">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/70 mb-1">{item.subtitle}</p>
                  <h3 className="font-serif text-lg">{item.title}</h3>
                </div>
                {/* Gold hover border */}
                <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/30 transition-colors duration-500" />
              </div>
            ))}
          </div>
        </section>

        {/* Wide Editorial Banner */}
        <section className="relative">
          <EditorialImage aspect="21/9" className="w-full">
            <CornerAccent position="top-left" />
            <CornerAccent position="top-right" />
            <CornerAccent position="bottom-left" />
            <CornerAccent position="bottom-right" />
            <div className="absolute inset-0 bg-background/30" />
          </EditorialImage>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-4">New Season</p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl italic">Ramadan Edit</h2>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        </section>

        {/* Lookbook Grid - Masonry Style */}
        <section className="px-6 md:px-12 lg:px-20 py-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-serif text-2xl md:text-3xl">The Lookbook</h2>
            <Link 
              to="/closet"
              className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-gold transition-colors duration-300"
            >
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {/* Varied height cards for editorial feel */}
            <div className="md:row-span-2 relative group">
              <EditorialImage aspect="2/3" className="w-full h-full" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/0 group-hover:bg-gold/50 transition-colors duration-500" />
            </div>
            <div className="relative group">
              <EditorialImage aspect="1/1" className="w-full" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/0 group-hover:bg-gold/50 transition-colors duration-500" />
            </div>
            <div className="relative group">
              <EditorialImage aspect="1/1" className="w-full" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/0 group-hover:bg-gold/50 transition-colors duration-500" />
            </div>
            <div className="md:row-span-2 relative group">
              <EditorialImage aspect="2/3" className="w-full h-full" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/0 group-hover:bg-gold/50 transition-colors duration-500" />
            </div>
            <div className="relative group">
              <EditorialImage aspect="1/1" className="w-full" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/0 group-hover:bg-gold/50 transition-colors duration-500" />
            </div>
            <div className="relative group">
              <EditorialImage aspect="1/1" className="w-full" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/0 group-hover:bg-gold/50 transition-colors duration-500" />
            </div>
          </div>
        </section>

        {/* Egyptian Divider */}
        <EgyptianDivider />

        {/* Call to Action */}
        <section className="px-6 md:px-12 lg:px-20 py-24 text-center relative">
          <AnkhSymbol className="text-gold/40 mx-auto mb-8" />
          <h2 className="font-serif text-3xl md:text-4xl mb-6">Begin Your Journey</h2>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-10 max-w-md mx-auto">
            Discover curated modest fashion crafted with intention
          </p>
          <Link 
            to="/closet"
            className="inline-flex items-center gap-4 px-8 py-4 border border-foreground text-[10px] uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-all duration-300 group"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1} />
          </Link>
        </section>

        {/* Minimal Zara-Style Footer */}
        <footer className="border-t border-border/30">
          <div className="px-6 md:px-12 lg:px-20 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">© 2024 Modesta</span>
            <AnkhSymbol className="text-gold/50" />
            <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">Cairo · Dubai · London</span>
          </div>
        </footer>
      </div>
    </AppLayout>
  );
});
