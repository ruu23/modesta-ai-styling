import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const OnboardingGate = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, loading } = useAuth();
  const [completed, setCompleted] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) {
        setCompleted(false);
        return;
      }

      // ⚡ Fast path
      if (localStorage.getItem('onboardingCompleted') === 'true') {
        setCompleted(true);
        return;
      }

      // 🔐 Verify with Supabase
      const { data } = await supabase
        .from('profile')
        .select('has_completed_onboarding')
        .eq('id', user.id)
        .maybeSingle();

      const isDone = data?.has_completed_onboarding ?? false;
      setCompleted(isDone);

      if (isDone) {
        localStorage.setItem('onboardingCompleted', 'true');
      }
    };

    if (!loading) checkStatus();
  }, [user, loading]);

  if (loading || completed === null) {
    return <div>Loading...</div>;
  }

  // 🚫 Logged in but not onboarded
  if (user && !completed && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // ✅ Finished onboarding but trying to go back
  if (user && completed && location.pathname === '/onboarding') {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};
