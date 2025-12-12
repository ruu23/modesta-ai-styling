import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Scan, CalendarDays, ShoppingBag, Home, Shirt, Calendar, Users, User } from 'lucide-react';
import { ThemeToggle } from '@/components/theme';
import { AppLayout } from '@/components/layout';
import { memo } from 'react';

const navItems = [
  { to: '/closet', label: 'Collection' },
  { to: '/outfit-builder', label: 'Create' },
  { to: '/chat', label: 'Advisor' },
  { to: '/calendar', label: 'Calendar' },
];

const featureCards = [
  { icon: Sparkles, title: 'AI Stylist', description: 'Personal styling advice' },
  { icon: Scan, title: 'Body Scan', description: 'Perfect measurements' },
  { icon: CalendarDays, title: 'Plan Outfits', description: 'Schedule your looks' },
  { icon: ShoppingBag, title: 'Shop', description: 'Curated selections' },
];

const partnerBrands = [
  'ZARA', 'MODANISA', 'ASOS', 'SHEIN', 'H&M', 'MANGO', 'MASSIMO DUTTI', 'COS'
];

const bottomNavItems = [
  { icon: Home, label: 'Home', to: '/' },
  { icon: Shirt, label: 'Closet', to: '/closet' },
  { icon: Calendar, label: 'Calendar', to: '/calendar' },
  { icon: Users, label: 'Friends', to: '/chat' },
  { icon: ShoppingBag, label: 'Shop', to: '/closet' },
  { icon: User, label: 'Profile', to: '/settings' },
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
    <AppLayout showBottomNav={false}>
      <div className="min-h-screen bg-background pb-24">
        {/* Minimal Zara-Style Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
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

        {/* Today's Suggested Look Card */}
        <section className="px-6 md:px-12 lg:px-20 pt-8 pb-6">
          <div className="relative border border-border/40 bg-muted/30 overflow-hidden">
            <CornerAccent position="top-left" />
            <CornerAccent position="bottom-right" />
            <div className="aspect-[16/10] md:aspect-[21/9] flex items-center justify-center relative">
              <EditorialImage aspect="auto" className="absolute inset-0 w-full h-full" overlay>
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
              </EditorialImage>
              <div className="relative z-10 text-center px-6">
                <p className="text-[9px] uppercase tracking-[0.3em] text-gold/70 mb-3">Curated for You</p>
                <h2 className="font-serif text-2xl md:text-4xl tracking-[0.02em] mb-2">Today's Suggested Look</h2>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">AI-powered styling recommendation</p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          </div>
        </section>

        {/* Get AI Outfit Suggestions Button */}
        <section className="px-6 md:px-12 lg:px-20 pb-10">
          <Link 
            to="/outfit-builder"
            className="w-full flex items-center justify-center gap-3 py-5 bg-foreground text-background text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-foreground/90 transition-colors duration-300 group"
          >
            <Sparkles className="w-4 h-4" strokeWidth={1.5} />
            <span>Get AI Outfit Suggestions</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </Link>
        </section>

        {/* Feature Cards 2x2 Grid */}
        <section className="px-6 md:px-12 lg:px-20 pb-12">
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {featureCards.map((card, index) => (
              <Link 
                key={index}
                to={card.title === 'AI Stylist' ? '/chat' : card.title === 'Plan Outfits' ? '/calendar' : card.title === 'Shop' ? '/closet' : '/settings'}
                className="relative border border-border/40 p-6 md:p-8 group hover:border-gold/40 transition-colors duration-300"
              >
                <CornerAccent position="top-left" />
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center mb-4 border border-border/30 group-hover:border-gold/40 transition-colors duration-300">
                    <card.icon className="w-5 h-5 md:w-6 md:h-6 text-foreground" strokeWidth={1} />
                  </div>
                  <h3 className="font-serif text-base md:text-lg mb-1">{card.title}</h3>
                  <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">{card.description}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/0 group-hover:bg-gold/40 transition-colors duration-500" />
              </Link>
            ))}
          </div>
        </section>

        {/* Egyptian Divider */}
        <EgyptianDivider />

        {/* My Closet Section */}
        <section className="px-6 md:px-12 lg:px-20 pb-12">
          <div className="relative border border-border/40 overflow-hidden group hover:border-gold/40 transition-colors duration-300">
            <CornerAccent position="top-left" />
            <CornerAccent position="top-right" />
            <CornerAccent position="bottom-left" />
            <CornerAccent position="bottom-right" />
            <Link to="/closet" className="block">
              <div className="aspect-[16/7] md:aspect-[21/7] relative">
                <EditorialImage aspect="auto" className="absolute inset-0 w-full h-full" overlay>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
                </EditorialImage>
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
                  <AnkhSymbol className="text-gold/50 mb-4" />
                  <h2 className="font-serif text-2xl md:text-3xl tracking-[0.02em] mb-2">My Closet</h2>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">Your curated collection</p>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-foreground group-hover:text-gold transition-colors duration-300">
                    <span>Browse Items</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </Link>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/0 group-hover:bg-gold/40 transition-colors duration-500" />
          </div>
        </section>

        {/* Featured Partner Brands */}
        <section className="pb-12">
          <div className="px-6 md:px-12 lg:px-20 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-px bg-gold/40" />
              <p className="text-[9px] uppercase tracking-[0.3em] text-gold/70">Featured Partner Brands</p>
              <div className="flex-1 h-px bg-gold/20" />
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-8 md:gap-12 px-6 md:px-12 lg:px-20 pb-2">
              {partnerBrands.map((brand, index) => (
                <div 
                  key={index}
                  className="flex-shrink-0 py-4 px-6 border border-border/30 hover:border-gold/40 transition-colors duration-300 cursor-pointer"
                >
                  <span className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-300 whitespace-nowrap">
                    {brand}
                  </span>
                </div>
              ))}
            </div>
          </div>
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
        <footer className="border-t border-border/30 mb-20">
          <div className="px-6 md:px-12 lg:px-20 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">© 2024 Modesta</span>
            <AnkhSymbol className="text-gold/50" />
            <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">Cairo · Dubai · London</span>
          </div>
        </footer>

        {/* Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border/30">
          <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
          <div className="flex items-center justify-around py-3 px-4 max-w-lg mx-auto">
            {bottomNavItems.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className="flex flex-col items-center gap-1 px-3 py-1 group"
              >
                <item.icon 
                  className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors duration-300" 
                  strokeWidth={1} 
                />
                <span className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </AppLayout>
  );
});
