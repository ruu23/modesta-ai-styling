import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/animations";

interface EmailVerifiedGateProps {
  children: React.ReactNode;
}

/**
 * Gate that ensures user has verified their email before accessing protected content.
 * Redirects unverified users to /verify-email page.
 */
export function EmailVerifiedGate({ children }: EmailVerifiedGateProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If not logged in, redirect to auth
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If logged in but email not verified, redirect to verify-email
  if (!user.email_confirmed_at) {
    return <Navigate to="/verify-email" replace />;
  }

  return <>{children}</>;
}
