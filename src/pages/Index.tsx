import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shirt, Sparkles, Palette, MessageSquare, CalendarDays, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme';
import { AppLayout } from '@/components/layout';
import { useIsMobile } from '@/hooks/use-mobile';
import { PageTransition, FadeIn, StaggerChildren, StaggerItem, ParticleBackground, GradientText, IconBounce } from '@/components/animations';

const navItems = [
  { to: '/closet', icon: Sparkles, label: 'Explore Closet', primary: true },
  { to: '/outfit-builder', icon: Palette, label: 'Build Outfit' },
  { to: '/chat', icon: MessageSquare, label: 'AI Stylist' },
  { to: '/calendar', icon: CalendarDays, label: 'Calendar' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Index() {
  const isMobile = useIsMobile();

  return (
    <AppLayout showBottomNav={true}>
      <PageTransition className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        {/* Theme Toggle - Top Right (Desktop only) */}
        <div className="absolute top-6 right-6 z-50 hidden md:block">
          <ThemeToggle />
        </div>

        {/* Mobile Theme Toggle */}
        <div className="absolute top-4 right-4 z-50 md:hidden">
          <ThemeToggle />
        </div>

        {/* Particle Background - Reduced on mobile */}
        <ParticleBackground count={isMobile ? 10 : 25} />
        
        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 gradient-radial pointer-events-none" />
        
        <div className="text-center space-y-6 md:space-y-8 px-4 relative z-10 w-full max-w-lg mx-auto">
          {/* Logo */}
          <FadeIn delay={0.1}>
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl gradient-rose mb-2 md:mb-4 shadow-glow"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={isMobile ? undefined : { y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Shirt className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground" />
              </motion.div>
            </motion.div>
          </FadeIn>
          
          {/* Title */}
          <FadeIn delay={0.2}>
            <div className="space-y-2 md:space-y-3">
              <h1 className="text-3xl md:text-5xl font-semibold">
                <GradientText>Your Digital Closet</GradientText>
              </h1>
              <motion.p 
                className="text-base md:text-lg text-muted-foreground max-w-md mx-auto px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Organize your wardrobe, plan outfits, and discover your style
              </motion.p>
            </div>
          </FadeIn>

          {/* Navigation Buttons - Stacked on mobile */}
          <StaggerChildren 
            className="flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center px-4"
            staggerDelay={isMobile ? 0.05 : 0.08}
            initialDelay={0.3}
          >
            {navItems.map((item) => (
              <StaggerItem key={item.to}>
                <motion.div
                  whileHover={isMobile ? undefined : { scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    asChild 
                    size="lg" 
                    variant={item.primary ? 'default' : 'outline'}
                    className={`w-full sm:w-auto min-h-[48px] ${item.primary 
                      ? 'gradient-rose text-primary-foreground border-0 hover:opacity-90 shadow-soft' 
                      : 'hover:shadow-soft transition-all duration-300 bg-card'
                    }`}
                  >
                    <Link to={item.to}>
                      <IconBounce>
                        <item.icon className="w-5 h-5 mr-2" />
                      </IconBounce>
                      {item.label}
                    </Link>
                  </Button>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>

          {/* Decorative Elements - Smaller on mobile */}
          <motion.div
            className="absolute -bottom-10 md:-bottom-20 left-1/2 -translate-x-1/2 w-64 h-64 md:w-96 md:h-96 rounded-full bg-primary/5 blur-3xl"
            animate={isMobile ? undefined : {
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </PageTransition>
    </AppLayout>
  );
}
