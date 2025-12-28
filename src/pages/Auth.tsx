import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = authSchema
  .extend({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function Auth() {
  const navigate = useNavigate();
  const { signUp, signIn, user, loading, resetPassword } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Redirect if already authenticated and email is verified
  useEffect(() => {
    if (!loading && user?.email_confirmed_at) {
      navigate("/home");
    }
  }, [user, loading, navigate]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    try {
      if (mode === "forgot") {
        z.string().email("Please enter a valid email address").parse(formData.email);
      } else if (mode === "signup") {
        signUpSchema.parse(formData);
      } else {
        authSchema.parse(formData);
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          } else {
            newErrors.email = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (mode === "forgot") {
        const { error } = await resetPassword(formData.email);
        if (error) {
          toast({
            title: "Reset failed",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Check your email",
          description: "We've sent you a password reset link.",
        });
        setMode("signin");
      } else if (mode === "signup") {
        const { error } = await signUp(formData.email, formData.password, {
          full_name: formData.fullName,
        });
        if (error) {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        // Store email for verification page
        localStorage.setItem("pendingVerificationEmail", formData.email);
        // Redirect to verify-email page
        navigate("/verify-email");
        return;
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        navigate("/home");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    if (mode === "forgot") {
      setMode("signin");
    } else {
      setMode(mode === "signin" ? "signup" : "signin");
    }
    setErrors({});
  };

  const getTitle = () => {
    if (mode === "forgot") return "Reset Password";
    if (mode === "signup") return "Create your account";
    return "Welcome back";
  };

  const getButtonText = () => {
    if (isLoading) return null;
    if (mode === "forgot") return "Send Reset Link";
    if (mode === "signup") return "Create Account";
    return "Sign In";
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/home`,
      },
    });
    if (error) {
      toast({
        title: "Google sign in failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const signInWithApple = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: `${window.location.origin}/home`,
      },
    });
    if (error) {
      toast({
        title: "Apple sign in failed",
        description: error.message,
        variant: "destructive",
      });
    }
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
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-editorial">Back</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-medium tracking-wide text-gold mb-3">
              MODESTA
            </h1>
            <div className="divider-papyrus mb-6" />
            <p className="text-muted-foreground text-sm tracking-wide">
              {getTitle()}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-editorial">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="Your name"
                    className="pl-12 h-12 bg-secondary border-border focus:border-primary"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-destructive text-xs">{errors.fullName}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-editorial">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="your@email.com"
                  className="pl-12 h-12 bg-secondary border-border focus:border-primary"
                />
              </div>
              {errors.email && (
                <p className="text-destructive text-xs">{errors.email}</p>
              )}
            </div>

            {mode !== "forgot" && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-editorial">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    placeholder="••••••••"
                    className="pl-12 pr-12 h-12 bg-secondary border-border focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-xs">{errors.password}</p>
                )}
              </div>
            )}

            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-editorial">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      updateField("confirmPassword", e.target.value)
                    }
                    placeholder="••••••••"
                    className="pl-12 pr-12 h-12 bg-secondary border-border focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-destructive text-xs">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {mode === "signin" && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => {
                    setMode("forgot");
                    setErrors({});
                  }}
                  className="text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 btn-luxury-filled"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                getButtonText()
              )}
            </Button>
          </form>

          {/* Divider - hide for forgot password */}
          {mode !== "forgot" && (
            <>
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-border" />
                <span className="text-muted-foreground text-xs uppercase tracking-widest">
                  or
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* OAuth Providers */}
              <div className="space-y-3">
                <Button
                  type="button"
                  onClick={signInWithGoogle}
                  variant="outline"
                  className="w-full h-12 border-border hover:bg-secondary flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </Button>
              </div>
            </>
          )}

          {/* Switch Mode */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm">
              {mode === "forgot" ? (
                <>
                  Remember your password?
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="ml-2 text-gold hover:text-gold-light transition-colors"
                  >
                    Sign In
                  </button>
                </>
              ) : mode === "signin" ? (
                <>
                  Don't have an account?
                  <button
                    type="button"
                    onClick={switchMode}
                    className="ml-2 text-gold hover:text-gold-light transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?
                  <button
                    type="button"
                    onClick={switchMode}
                    className="ml-2 text-gold hover:text-gold-light transition-colors"
                  >
                    Sign In
                  </button>
                </>
              )}
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
