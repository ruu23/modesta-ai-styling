import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Scan, CalendarDays, ShoppingBag, Home, Shirt, Calendar, Users, User, CloudSun, LogOut } from 'lucide-react';
import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Constants
const ANIMATION_DELAYS = {
  header: 0.1,
  welcome: 0.2,
  content: 0.3,
  button: 0.4,
  footer: 0.6,
};

const VIEWPORT_MARGIN = "-100px";
const STAGGER_DELAY = 0.15;

const NAV_ITEMS = [
  { to: '/closet', label: 'Collection' },
  { to: '/outfit-builder', label: 'Create' },
  { to: '/chat', label: 'Advisor' },
  { to: '/calendar', label: 'Calendar' },
];

const FEATURE_CARDS = [
  { icon: Sparkles, title: 'AI Stylist', description: 'Personal styling advice', to: '/chat' },
  { icon: Scan, title: 'Body Scan', description: 'Perfect measurements', to: '/settings' },
  { icon: CalendarDays, title: 'Plan Outfits', description: 'Schedule your looks', to: '/calendar' },
  { icon: ShoppingBag, title: 'Shop', description: 'Curated selections', to: '/closet' },
];

const PARTNER_BRANDS = [
  'ZARA', 'MODANISA', 'ASOS', 'SHEIN', 'H&M', 'MANGO', 'MASSIMO DUTTI', 'COS'
];

const BOTTOM_NAV_ITEMS = [
  { icon: Home, label: 'Home', to: '/home' },
  { icon: Shirt, label: 'Closet', to: '/closet' },
  { icon: Calendar, label: 'Calendar', to: '/calendar' },
  { icon: Users, label: 'Friends', to: '/chat' },
  { icon: ShoppingBag, label: 'Shop', to: '/closet' },
  { icon: User, label: 'Profile', to: '/settings' },
];

const EDITORIAL_CATEGORIES = [
  { title: 'Modest Dresses', subtitle: 'Evening' },
  { title: 'Layered Sets', subtitle: 'Daily' },
  { title: 'Accessories', subtitle: 'Details' },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER_DELAY,
      delayChildren: 0.1
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
};

// Types
interface UserData {
  fullName: string;
  email: string;
  country: string;
  city: string;
  brands: string[];
  favoriteColors: string[];
  stylePersonality: string[];
  hijabStyle: string;
}

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
}

// Utility Components
const AnkhSymbol = ({ className = "" }: { className?: string }) => (
  <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className={className} aria-hidden="true">
    <ellipse cx="8" cy="5" rx="5" ry="4.5" stroke="currentColor" strokeWidth="0.5" />
    <line x1="8" y1="9.5" x2="8" y2="23" stroke="currentColor" strokeWidth="0.5" />
    <line x1="3" y1="14" x2="13" y2="14" stroke="currentColor" strokeWidth="0.5" />
  </svg>
);

const EgyptianDivider = () => (
  <motion.div 
    className="flex items-center justify-center gap-4 py-16"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={fadeIn}
    role="separator"
    aria-hidden="true"
  >
    <motion.div 
      className="w-24 h-px bg-gold/40" 
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
    <motion.div 
      className="w-1.5 h-1.5 border border-gold/60 rotate-45"
      initial={{ opacity: 0, rotate: 0 }}
      whileInView={{ opacity: 1, rotate: 45 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
    />
    <motion.div 
      className="w-24 h-px bg-gold/40" 
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
  </motion.div>
);

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
      aria-hidden="true"
    >
      <path d="M0 40 L0 10 L10 0 L40 0" stroke="currentColor" strokeWidth="0.5" fill="none" />
    </svg>
  );
};

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
    role="img"
    aria-label="Editorial fashion image"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted-foreground/10 to-muted" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.3)_100%)]" />
    {overlay && (
      <div className="absolute inset-0 bg-background/20" />
    )}
    {children}
  </div>
);

// Feature Components
const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Simulated weather data - replace with actual API call
    const timer = setTimeout(() => {
      try {
        setWeather({
          temperature: 24,
          condition: 'Partly Cloudy',
          icon: '⛅'
        });
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 border border-border/40 bg-muted/20">
        <CloudSun className="w-5 h-5 text-muted-foreground animate-pulse" />
        <span className="text-xs tracking-wider text-muted-foreground">Loading...</span>
      </div>
    );
  }
  
  if (error || !weather) {
    return null;
  }
  
  return (
    <div className="flex items-center gap-3 px-5 py-3 border border-border/40 bg-muted/20" role="status" aria-live="polite">
      <span className="text-2xl" aria-hidden="true">{weather.icon}</span>
      <div>
        <p className="font-serif text-xl">{weather.temperature}°C</p>
        <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{weather.condition}</p>
      </div>
    </div>
  );
};

const Header = ({ userData, onLogout }: { userData: UserData | null; onLogout: () => void }) => {
  const user = !!userData; // Mock auth state

  return (
    <motion.header 
      className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="px-6 md:px-12 lg:px-20 py-5 flex items-center justify-between">
        <Link to="/" className="font-serif text-sm tracking-[0.2em] text-foreground">
          MODESTA
        </Link>
        <nav className="hidden md:flex items-center gap-14" aria-label="Main navigation">
          {NAV_ITEMS.map((item, index) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: ANIMATION_DELAYS.header * index }}
            >
              <Link 
                to={item.to}
                className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {userData && (
                <Link 
                  to="/settings"
                  className="text-[10px] uppercase tracking-[0.15em] text-foreground hover:text-gold transition-colors duration-300"
                >
                  Hi, {userData.fullName?.split(' ')[0] || 'User'}
                </Link>
              )}
              <button
                onClick={onLogout}
                className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-1.5"
                aria-label="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <Link 
              to="/auth"
              className="text-[10px] uppercase tracking-[0.15em] px-4 py-2 border border-foreground hover:bg-foreground hover:text-background transition-colors duration-300"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
      <div className="h-px bg-border/30" role="separator" aria-hidden="true" />
    </motion.header>
  );
};

const WelcomeSection = ({ userData }: { userData: UserData | null }) => {
  if (!userData) {
    return (
      <motion.section 
        className="px-6 md:px-12 lg:px-20 pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: ANIMATION_DELAYS.welcome }}
      >
        <div className="flex justify-end">
          <WeatherWidget />
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section 
      className="px-6 md:px-12 lg:px-20 pt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: ANIMATION_DELAYS.welcome }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-center md:text-left">
          <h1 className="font-serif text-2xl md:text-3xl mb-2">
            Welcome back, <span className="text-gold">{userData.fullName?.split(' ')[0] || 'User'}</span>
          </h1>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {userData.city && userData.country ? `${userData.city}, ${userData.country}` : 'Location not set'} 
            {userData.hijabStyle && ` • ${userData.hijabStyle} Style`}
          </p>
        </div>
        <WeatherWidget />
      </div>
    </motion.section>
  );
};

const HeroSection = () => (
  <motion.section 
    className="px-6 md:px-12 lg:px-20 pt-8 pb-6"
    initial="hidden"
    animate="visible"
    variants={fadeInUp}
  >
    <div className="relative border border-border/40 bg-muted/30 overflow-hidden">
      <CornerAccent position="top-left" />
      <CornerAccent position="bottom-right" />
      <div className="aspect-[16/10] md:aspect-[21/9] grid grid-cols-1 md:grid-cols-2 relative">
        <div className="hidden md:block relative bg-gradient-to-br from-muted via-muted/80 to-background overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,hsl(var(--muted-foreground)/0.08)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,hsl(var(--muted-foreground)/0.05)_0%,transparent_40%)]" />
          
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <path d="M 10% 100% Q 10% 40%, 50% 40% Q 90% 40%, 90% 100%" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.3" opacity="0.15" />
            <path d="M 25% 100% Q 25% 55%, 50% 55% Q 75% 55%, 75% 100%" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.3" opacity="0.1" />
            <line x1="20%" y1="15%" x2="20%" y2="85%" stroke="hsl(var(--muted-foreground))" strokeWidth="0.3" opacity="0.12" />
            <line x1="80%" y1="15%" x2="80%" y2="85%" stroke="hsl(var(--muted-foreground))" strokeWidth="0.3" opacity="0.12" />
            <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="hsl(var(--muted-foreground))" strokeWidth="0.2" opacity="0.08" />
            <circle cx="50%" cy="25%" r="8%" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.3" opacity="0.1" />
            <circle cx="35%" cy="70%" r="3%" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.3" opacity="0.08" />
            <line x1="30%" y1="20%" x2="45%" y2="35%" stroke="hsl(var(--muted-foreground))" strokeWidth="0.2" opacity="0.1" />
            <line x1="55%" y1="65%" x2="70%" y2="80%" stroke="hsl(var(--muted-foreground))" strokeWidth="0.2" opacity="0.1" />
            <line x1="48%" y1="48%" x2="52%" y2="52%" stroke="hsl(var(--gold))" strokeWidth="0.8" opacity="0.6" />
            <circle cx="50%" cy="50%" r="1" fill="hsl(var(--gold))" opacity="0.5" />
          </svg>
          
          <div className="absolute inset-0 opacity-[0.03]" style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
            backgroundSize: '150px 150px'
          }} />
          
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-background/20 to-transparent" />
        </div>
        
        <div className="flex items-center justify-center relative bg-gradient-to-l from-background via-background to-transparent">
          <motion.div 
            className="relative z-10 text-center px-6 md:px-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: ANIMATION_DELAYS.content, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[9px] uppercase tracking-[0.3em] text-gold/70 mb-3">Curated for You</p>
            <h2 className="font-serif text-2xl md:text-4xl tracking-[0.02em] mb-2">Today's Suggested Look</h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">AI-powered styling recommendation</p>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </div>
  </motion.section>
);

const CTAButton = () => (
  <motion.section 
    className="px-6 md:px-12 lg:px-20 pb-10"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: ANIMATION_DELAYS.button }}
  >
    <Link 
      to="/outfit-builder"
      className="w-full flex items-center justify-center gap-3 py-5 bg-foreground text-background text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-foreground/90 transition-colors duration-300 group"
    >
      <Sparkles className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
      <span>Get AI Outfit Suggestions</span>
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} aria-hidden="true" />
    </Link>
  </motion.section>
);

const FeatureGrid = () => (
  <motion.section 
    className="px-6 md:px-12 lg:px-20 pb-12"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: VIEWPORT_MARGIN }}
    variants={staggerContainer}
  >
    <div className="grid grid-cols-2 gap-4 md:gap-6">
      {FEATURE_CARDS.map((card, index) => (
        <motion.div key={index} variants={staggerItem}>
          <Link 
            to={card.to}
            className="relative border border-border/40 p-6 md:p-8 group hover:border-gold/40 transition-colors duration-300 block"
          >
            <CornerAccent position="top-left" />
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center mb-4 border border-border/30 group-hover:border-gold/40 transition-colors duration-300">
                <card.icon className="w-5 h-5 md:w-6 md:h-6 text-foreground" strokeWidth={1} aria-hidden="true" />
              </div>
              <h3 className="font-serif text-base md:text-lg mb-1">{card.title}</h3>
              <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">{card.description}</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/0 group-hover:bg-gold/40 transition-colors duration-500" />
          </Link>
        </motion.div>
      ))}
    </div>
  </motion.section>
);

const ClosetSection = () => (
  <motion.section 
    className="px-6 md:px-12 lg:px-20 pb-12"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: VIEWPORT_MARGIN }}
    variants={scaleIn}
  >
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
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" strokeWidth={1.5} aria-hidden="true" />
            </div>
          </div>
        </div>
      </Link>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/0 group-hover:bg-gold/40 transition-colors duration-500" />
    </div>
  </motion.section>
);

const PartnerBrands = () => (
  <motion.section 
    className="pb-12"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={fadeInUp}
  >
    <div className="px-6 md:px-12 lg:px-20 mb-6">
      <div className="flex items-center gap-4">
        <div className="w-8 h-px bg-gold/40" />
        <p className="text-[9px] uppercase tracking-[0.3em] text-gold/70">Featured Partner Brands</p>
        <div className="flex-1 h-px bg-gold/20" />
      </div>
    </div>
    <div className="overflow-x-auto scrollbar-hide">
      <motion.div 
        className="flex gap-8 md:gap-12 px-6 md:px-12 lg:px-20 pb-2"
        variants={staggerContainer}
      >
        {PARTNER_BRANDS.map((brand, index) => (
          <motion.button 
            key={index}
            className="flex-shrink-0 py-4 px-6 border border-border/30 hover:border-gold/40 transition-colors duration-300"
            variants={staggerItem}
            aria-label={`View ${brand} collection`}
          >
            <span className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-300 whitespace-nowrap">
              {brand}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  </motion.section>
);

const EditorialGrid1 = () => (
  <motion.section 
    className="px-6 md:px-12 lg:px-20 py-24"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: VIEWPORT_MARGIN }}
    variants={staggerContainer}
  >
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <motion.div className="col-span-2 lg:col-span-2 lg:row-span-2 relative group" variants={staggerItem}>
        <EditorialImage aspect="3/4" className="w-full">
          <CornerAccent position="top-left" />
          <CornerAccent position="bottom-right" />
        </EditorialImage>
        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Featured</p>
          <h3 className="font-serif text-xl md:text-2xl">The Essence Collection</h3>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/0 group-hover:bg-gold/40 transition-colors duration-500" />
      </motion.div>

      <motion.div className="relative group" variants={staggerItem}>
        <EditorialImage aspect="4/5" className="w-full" />
        <div className="absolute bottom-4 left-4">
          <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">Abayas</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/0 group-hover:bg-gold/40 transition-colors duration-500" />
      </motion.div>

      <motion.div className="relative group" variants={staggerItem}>
        <EditorialImage aspect="4/5" className="w-full" />
        <div className="absolute bottom-4 left-4">
          <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">Hijabs</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/0 group-hover:bg-gold/40 transition-colors duration-500" />
      </motion.div>
    </div>
  </motion.section>
);

const StatementSection = () => (
  <motion.section 
    className="px-6 md:px-12 lg:px-20 py-12 text-center"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: VIEWPORT_MARGIN }}
    variants={fadeInUp}
  >
    <p className="text-[10px] uppercase tracking-[0.4em] text-gold/70 mb-6">Crafted for You</p>
    <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-[0.02em] max-w-3xl mx-auto leading-relaxed">
      Where <span className="italic">tradition</span> meets
      <br />