import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Shirt, Palette, MessageSquare, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/closet', icon: Shirt, label: 'Closet' },
  { to: '/outfit-builder', icon: Palette, label: 'Create' },
  { to: '/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/calendar', icon: CalendarDays, label: 'Calendar' },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      {/* Blur background */}
      <div className="absolute inset-0 bg-card/90 backdrop-blur-xl border-t border-border" />
      
      {/* Safe area padding for notched devices */}
      <div className="relative flex items-center justify-around px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-3 py-1.5 rounded-xl transition-all duration-200',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <item.icon className={cn(
                  'w-6 h-6 transition-all duration-200',
                  isActive && 'scale-110'
                )} />
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
              
              <span className={cn(
                'text-[10px] mt-1 font-medium transition-all duration-200',
                isActive ? 'opacity-100' : 'opacity-70'
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
