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
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Onboarding />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } />
        <Route 
          path="/closet" 
          element={
            <ProtectedRoute>
              <LazyPage>
                <LazyCloset />
              </LazyPage>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/outfit-builder" 
          element={
            <ProtectedRoute>
              <LazyPage>
                <LazyOutfitBuilder />
              </LazyPage>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <LazyPage>
                <LazyChat />
              </LazyPage>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/calendar" 
          element={
            <ProtectedRoute>
              <LazyPage>
                <LazyCalendar />
              </LazyPage>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <LazyPage>
                <LazySettings />
              </LazyPage>
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
