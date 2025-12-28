import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw, CheckCircle, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Get email from localStorage (set during signup)
    const pendingEmail = localStorage.getItem("pendingVerificationEmail");
    if (pendingEmail) {
      setEmail(pendingEmail);
    }
  }, []);

  useEffect(() => {
    // If user is logged in and email is confirmed, redirect to onboarding
    if (!loading && user?.email_confirmed_at) {
      localStorage.removeItem("pendingVerificationEmail");
      navigate("/onboarding");
    }
  }, [user, loading, navigate]);

  const handleResendEmail = async () => {
    if (!email) {
      toast({
        title: "No email found",
        description: "Please sign up again.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`,
        },
      });

      if (error) {
        toast({
          title: "Failed to resend",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email sent!",
          description: "Please check your inbox for the verification link.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend verification email.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToSignIn = () => {
    localStorage.removeItem("pendingVerificationEmail");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6">
        <button
          onClick={handleBackToSignIn}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-editorial">Back to Sign In</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md text-center"
        >
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-medium tracking-wide text-gold mb-3">
              MODESTA
            </h1>
            <div className="divider-papyrus mb-6" />
          </div>

          {/* Email Icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-8">
            <Mail className="w-10 h-10 text-primary" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-medium text-foreground mb-4">
            Verify Your Email
          </h2>

          {/* Description */}
          <div className="space-y-4 mb-8">
            <p className="text-muted-foreground">
              We've sent a verification email to:
            </p>
            {email && (
              <p className="text-foreground font-medium bg-secondary px-4 py-2 rounded-lg inline-block">
                {email}
              </p>
            )}
            <p className="text-muted-foreground text-sm">
              Please click the link in the email to verify your account and continue to onboarding.
            </p>
          </div>

          {/* Important Notice */}
          <div className="bg-secondary/50 border border-border rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3 text-left">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-sm">
                <p className="text-foreground font-medium">
                  Can't find the email?
                </p>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Check your <span className="text-foreground">Spam</span> or <span className="text-foreground">Promotions</span> folder</li>
                  <li>• Make sure the email address is correct</li>
                  <li>• Wait a few minutes and try again</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Resend Button */}
          <Button
            onClick={handleResendEmail}
            disabled={isResending}
            variant="outline"
            className="w-full h-12 border-border hover:bg-secondary"
          >
            {isResending ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Resend Verification Email
          </Button>

          {/* Sign in with different account */}
          <p className="mt-6 text-sm text-muted-foreground">
            Wrong email?{" "}
            <button
              onClick={handleBackToSignIn}
              className="text-gold hover:text-gold-light transition-colors"
            >
              Sign up with a different email
            </button>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
