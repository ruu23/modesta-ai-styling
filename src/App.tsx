import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/components/theme";
import { AccessibilityProvider } from "@/components/accessibility";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth";
import { LazyPage } from "@/components/ui/LazyLoad";
import { 
  LazyCloset, 
  LazyOutfitBuilder, 
  LazyChat, 
  LazyCalendar, 
  LazySettings 
} from "@/lib/lazyComponents";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { OnboardingGate } from '@/components/auth/OnboardingGate';
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AnimatedRoutes() {
  const location = useLocation();
  const { user, loading, hasCompletedOnboarding } = useAuth(); // Get state from hook
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            user ? (
              hasCompletedOnboarding ? <Navigate to="/home" replace /> : <Navigate to="/onboarding" replace />
            ) : (
              <Auth /> // If not logged in, send to Auth page instead of Onboarding
            )
          } 
        />
        
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/auth" element={<Auth />} />
        
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <OnboardingGate>
                <Index />
              </OnboardingGate>
            </ProtectedRoute>
          }
        />

        {/* ... Rest of your lazy loaded routes (Closet, Chat, etc.) wrapped in ProtectedRoute and OnboardingGate ... */}
        <Route 
          path="/closet" 
          element={
            <ProtectedRoute>
              <OnboardingGate>
                <LazyPage><LazyCloset /></LazyPage>
              </OnboardingGate>
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <AccessibilityProvider>
    <ThemeProvider defaultTheme="system" storageKey="modesta-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AnimatedRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </AccessibilityProvider>
);

export default App;
