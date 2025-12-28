import { motion } from "framer-motion";
import { Check, ChevronRight, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react"; // if not already there
import { supabase } from "@/integrations/supabase/client";

const fadeInUp = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3, ease: "easeOut" as const },
};

export interface UserData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  city: string;
  brands: string[];
  modestyLevel: string;
  favoriteColors: string[];
  stylePersonality: string[];
  hijabStyle: string;
  occasions: string[];
}

interface StepProps {
  userData: UserData;
  updateUserData: (field: keyof UserData, value: string) => void;
  toggleArrayItem: (field: keyof UserData, item: string) => void;
  nextStep: () => void;
  prevStep: () => void;
}

interface BasicInfoStepProps
  extends Pick<StepProps, "userData" | "updateUserData" | "nextStep"> {
  isLoading?: boolean;
  authMode?: "signup" | "signin" | "forgot";
  setAuthMode?: (mode: "signup" | "signin" | "forgot") => void;
  onResetPassword?: (email: string) => Promise<void>;
}

// Constants
const countries = [
  // Middle East & North Africa
  "United Arab Emirates",
  "Saudi Arabia",
  "Egypt",
  "Kuwait",
  "Qatar",
  "Bahrain",
  "Oman",
  "Jordan",
  "Lebanon",
  "Morocco",
  "Tunisia",
  "Algeria",
  "Libya",
  "Iraq",
  "Syria",
  "Palestine",
  "Yemen",
  // Europe
  "United Kingdom",
  "France",
  "Germany",
  "Netherlands",
  "Belgium",
  "Sweden",
  "Norway",
  "Denmark",
  "Spain",
  "Italy",
  "Switzerland",
  "Austria",
  "Turkey",
  "Greece",
  "Poland",
  "Portugal",
  "Ireland",
  "Finland",
  // Asia
  "Indonesia",
  "Malaysia",
  "Pakistan",
  "Bangladesh",
  "India",
  "Singapore",
  "Brunei",
  "Philippines",
  "Thailand",
  "Japan",
  "South Korea",
  "China",
  "Vietnam",
  // Americas
  "United States",
  "Canada",
  "Brazil",
  "Mexico",
  "Argentina",
  "Colombia",
  "Chile",
  // Africa
  "Nigeria",
  "South Africa",
  "Kenya",
  "Ghana",
  "Senegal",
  "Tanzania",
  "Ethiopia",
  "Sudan",
  // Oceania
  "Australia",
  "New Zealand",
].sort();

const brands = [
  // Fast Fashion
  "Zara",
  "H&M",
  "Mango",
  "Shein",
  "Uniqlo",
  "Pull&Bear",
  "Bershka",
  "Stradivarius",
  "Forever 21",
  "Primark",
  "ASOS",
  "Boohoo",
  "PrettyLittleThing",
  "Missguided",
  // Modest Fashion
  "Modanisa",
  "The Modist",
  "Haute Hijab",
  "Inayah",
  "Niswa Fashion",
  "Aab",
  "Annah Hariri",
  "Verona Collection",
  "Hijab House",
  "SHUKR",
  "Artizara",
  "Louella",
  // Luxury
  "Dolce & Gabbana",
  "Dior",
  "Chanel",
  "Gucci",
  "Louis Vuitton",
  "Prada",
  "Valentino",
  "Versace",
  "Balenciaga",
  "Fendi",
  "Burberry",
  "Saint Laurent",
  "Bottega Veneta",
  // Contemporary
  "COS",
  "Massimo Dutti",
  "Arket",
  "& Other Stories",
  "Reiss",
  "Ted Baker",
  "Karen Millen",
  "AllSaints",
  "Sandro",
  "Maje",
  // Sportswear
  "Nike",
  "Adidas",
  "Puma",
  "Lululemon",
  "Alo Yoga",
  "Gymshark",
  // Other
  "Local Boutiques",
  "Thrift/Vintage",
  "Handmade/Custom",
  "Other",
];

const colors = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Navy", hex: "#1e3a8a" },
  { name: "Beige", hex: "#d4a574" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Green", hex: "#10b981" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Brown", hex: "#92400e" },
  { name: "Red", hex: "#dc2626" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Gold", hex: "#D4AF37" },
  { name: "Gray", hex: "#6b7280" },
];

const stylePersonalities = [
  "Elegant",
  "Modern",
  "Traditional",
  "Minimalist",
  "Bold",
  "Romantic",
  "Edgy",
  "Classic",
];

const hijabStyles = [
  { name: "Turkish", emoji: "🧕" },
  { name: "Gulf", emoji: "👸" },
  { name: "Casual", emoji: "🌸" },
  { name: "Formal", emoji: "✨" },
  { name: "Don't wear hijab", emoji: "🌟" },
];

// Login Page
export const LoginPage = ({ nextStep }: Pick<StepProps, "nextStep">) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/onboarding`,
        queryParams: {
          prompt: "select_account", // This forces the account picker to show up
          access_type: "offline",
        },
      },
    });
  };

  return (
  <motion.div
    {...fadeInUp}
    className="min-h-screen bg-background flex items-center justify-center px-6"
  >
    <div className="w-full max-w-md text-center">
      {/* Title */}
      <h1 className="font-serif text-3xl tracking-[0.35em] text-foreground mb-10">
        SITA
      </h1>

      {/* Divider */}
      <div className="w-12 h-px bg-foreground/20 mx-auto mb-14" />

      {/* Buttons */}
      <div className="space-y-4">
        {/* Google */}
        <Button
          onClick={signInWithGoogle}
          disabled={isGoogleLoading}
          className="
            w-full h-14
            rounded-full
            bg-foreground
            text-background
            hover:bg-foreground/90
            font-sans
            tracking-wide
            flex items-center justify-center
          "
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              Connecting to Google...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 5.95 1.54 7.32 2.82l5.35-5.35C33.24 3.82 29.02 2 24 2 14.73 2 6.93 7.7 3.68 15.7l6.61 5.13C12.11 14.6 17.62 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24.5c0-1.57-.14-3.09-.41-4.5H24v8.52h12.66c-.55 2.9-2.17 5.36-4.6 7.04l7.05 5.47C43.45 37.36 46.5 31.5 46.5 24.5z"/>
                <path fill="#FBBC05" d="M10.29 28.83A14.5 14.5 0 0 1 9.5 24c0-1.68.29-3.3.79-4.83l-6.61-5.13A23.93 23.93 0 0 0 2 24c0 3.87.93 7.53 2.68 10.96l6.61-5.13z"/>
                <path fill="#34A853" d="M24 46c6.48 0 11.92-2.14 15.89-5.8l-7.05-5.47c-1.96 1.32-4.46 2.1-8.84 2.1-6.38 0-11.89-5.1-13.71-11.93l-6.61 5.13C6.93 40.3 14.73 46 24 46z"/>
              </svg>

              Continue with Google
            </>
          )}
        </Button>

        {/* Email */}
        <Button
          onClick={nextStep}
          className="
            w-full h-14
            rounded-full
            bg-foreground
            text-background
            hover:bg-foreground/90
            font-sans
            tracking-wide
          "
        >
          Continue with Email
        </Button>
      </div>
    </div>
  </motion.div>
);

};

{
  /* Remove this part */
}
// Landing Page
{
  /* 
export const LandingPage = ({
  onSignIn,
  onSignUp,
}: {
  onSignIn: () => void;
  onSignUp: () => void;
}) => (
  <motion.div {...fadeInUp} className="min-h-screen bg-background">
    <header className="px-6 py-6 flex items-center justify-between border-b border-border/30">
      <h1 className="font-serif text-xl tracking-[0.2em]">MODESTA</h1>
      <Button
        variant="ghost"
        onClick={onSignIn}
        className="font-sans text-sm tracking-wider"
      >
        Sign in
      </Button>
    </header>
    <div className="px-6 py-20 max-w-2xl mx-auto text-center">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="font-serif text-5xl md:text-6xl leading-tight mb-8"
      >
        Dress with
        <br />
        confidence
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-muted-foreground text-lg mb-12 max-w-md mx-auto"
      >
        Your personal AI stylist that truly gets you - from the clothes in your
        closet to the looks you love.
      </motion.p>
      <div className="w-8 h-px bg-gold mx-auto mb-12" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button
          onClick={onSignUp}
          className="h-14 px-10 font-sans tracking-wider"
        >
          Get Started
        </Button>
        <Button
          variant="outline"
          onClick={onSignIn}
          className="h-14 px-10 font-sans tracking-wider"
        >
          Sign in
        </Button>
      </motion.div>
    </div>
  </motion.div>
);
*/
}

// Basic Info Step - Now with auth
export const BasicInfoStep = ({
  userData,
  updateUserData,
  nextStep,
  isLoading = false,
  authMode = "signup",
  setAuthMode,
  onResetPassword,
}: BasicInfoStepProps) => {
  const isSignUp = authMode === "signup";
  const isForgot = authMode === "forgot";

  const getTitle = () => {
    if (isForgot) return "Reset Password";
    if (isSignUp) return "Create Account";
    return "Welcome Back";
  };

  const getSubtitle = () => {
    if (isForgot) return "Enter your email to receive a reset link";
    if (isSignUp) return "Let's get to know you better";
    return "Sign in to continue";
  };

  const handleSubmit = async () => {
    if (isForgot && onResetPassword) {
      await onResetPassword(userData.email);
    } else {
      nextStep();
    }
  };

  return (
    <motion.div {...fadeInUp} className="min-h-screen bg-background px-6 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl mb-3">{getTitle()}</h2>
          <p className="text-muted-foreground">{getSubtitle()}</p>
          <div className="w-8 h-px bg-gold mx-auto mt-6" />
        </div>
        <div className="space-y-6">
          {isSignUp && (
            <div>
              <label className="block text-sm tracking-wider mb-2 text-muted-foreground">
                Full Name
              </label>
              <Input
                type="text"
                value={userData.fullName}
                onChange={(e) => updateUserData("fullName", e.target.value)}
                className="h-14 border-border/50 focus:border-foreground"
                placeholder="Enter your name"
              />
            </div>
          )}
          <div>
            <label className="block text-sm tracking-wider mb-2 text-muted-foreground">
              Email
            </label>
            <Input
              type="email"
              value={userData.email}
              onChange={(e) => updateUserData("email", e.target.value)}
              className="h-14 border-border/50 focus:border-foreground"
              placeholder="your@email.com"
            />
          </div>
          {!isForgot && (
            <div>
              <label className="block text-sm tracking-wider mb-2 text-muted-foreground">
                Password
              </label>
              <Input
                type="password"
                value={userData.password}
                onChange={(e) => updateUserData("password", e.target.value)}
                className="h-14 border-border/50 focus:border-foreground"
                placeholder={
                  isSignUp ? "Create a password" : "Enter your password"
                }
              />
              {isSignUp && (
                <p className="text-xs text-muted-foreground mt-2">
                  Password must be at least 6 characters
                </p>
              )}
            </div>
          )}
          {isSignUp && (
            <div>
              <label className="block text-sm tracking-wider mb-2 text-muted-foreground">
                Confirm Password
              </label>
              <Input
                type="password"
                value={userData.confirmPassword}
                onChange={(e) =>
                  updateUserData("confirmPassword", e.target.value)
                }
                className="h-14 border-border/50 focus:border-foreground"
                placeholder="Re-enter your password"
              />
              {userData.confirmPassword &&
                userData.password !== userData.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-red-500 mt-2"
                  >
                    Passwords do not match
                  </motion.p>
                )}
            </div>
          )}

          {!isSignUp && !isForgot && setAuthMode && (
            <div className="text-right">
              <button
                onClick={() => setAuthMode("forgot")}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              !userData.email ||
              (isSignUp &&
                (!userData.fullName ||
                  userData.password.length < 6 ||
                  userData.password !== userData.confirmPassword)) ||
              (!isSignUp && !isForgot && !userData.password)
            }
            className="w-full h-14 mt-8"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isForgot ? "Sending reset link..." : isSignUp ? "Creating account..." : "Signing in..."}
              </>
            ) : isForgot ? (
              "Send Reset Link"
            ) : isSignUp ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </Button>

          {setAuthMode && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              {isForgot ? (
                <>
                  Remember your password?{" "}
                  <button
                    onClick={() => setAuthMode("signin")}
                    className="text-foreground underline hover:no-underline"
                  >
                    Sign in
                  </button>
                </>
              ) : isSignUp ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setAuthMode("signin")}
                    className="text-foreground underline hover:no-underline"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => setAuthMode("signup")}
                    className="text-foreground underline hover:no-underline"
                  >
                    Sign up
                  </button>
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Country Step
export const CountryStep = ({
  updateUserData,
  nextStep,
  prevStep,
}: Pick<StepProps, "updateUserData" | "nextStep" | "prevStep">) => (
  <motion.div {...fadeInUp} className="min-h-screen bg-background px-6 py-12">
    <div className="max-w-md mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl mb-3">Where are you from?</h2>
        <p className="text-muted-foreground">
          This helps us personalize your experience
        </p>
        <div className="w-8 h-px bg-gold mx-auto mt-6" />
      </div>
      <div className="space-y-3 max-h-[50vh] overflow-y-auto">
        {countries.map((country) => (
          <button
            key={country}
            onClick={() => {
              updateUserData("country", country);
              nextStep();
            }}
            className="w-full px-6 py-4 border border-border/50 hover:border-foreground hover:bg-muted/30 transition-all text-left flex items-center justify-between group"
          >
            <span className="font-sans tracking-wide">{country}</span>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
      <button
        onClick={prevStep}
        className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back
      </button>
    </div>
  </motion.div>
);

// City Step
export const CityStep = ({
  userData,
  updateUserData,
  nextStep,
  prevStep,
}: Pick<
  StepProps,
  "userData" | "updateUserData" | "nextStep" | "prevStep"
>) => (
  <motion.div {...fadeInUp} className="min-h-screen bg-background px-6 py-12">
    <div className="max-w-md mx-auto">
      <div className="text-center mb-12">
        <MapPin className="w-8 h-8 mx-auto mb-4 text-gold" />
        <h2 className="font-serif text-3xl mb-3">Which city?</h2>
        <p className="text-muted-foreground">
          We'll show you local styles and weather
        </p>
        <div className="w-8 h-px bg-gold mx-auto mt-6" />
      </div>
      <div className="space-y-6">
        <Input
          type="text"
          value={userData.city}
          onChange={(e) => updateUserData("city", e.target.value)}
          className="h-14 border-border/50 focus:border-foreground text-lg"
          placeholder="Enter your city"
        />
        <Button
          onClick={nextStep}
          disabled={!userData.city}
          className="w-full h-14"
        >
          Continue
        </Button>
      </div>
      <button
        onClick={prevStep}
        className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back
      </button>
    </div>
  </motion.div>
);

// Brands Step
export const BrandsStep = ({
  userData,
  toggleArrayItem,
  nextStep,
  prevStep,
}: Pick<
  StepProps,
  "userData" | "toggleArrayItem" | "nextStep" | "prevStep"
>) => (
  <motion.div {...fadeInUp} className="min-h-screen bg-background px-6 py-12">
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl mb-3">
          Which brands do you shop from?
        </h2>
        <p className="text-muted-foreground">Select all that apply</p>
        <div className="w-8 h-px bg-gold mx-auto mt-6" />
      </div>
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {brands.map((brand) => (
          <button
            key={brand}
            onClick={() => toggleArrayItem("brands", brand)}
            className={`px-5 py-3 border transition-all font-sans tracking-wide ${
              userData.brands.includes(brand)
                ? "border-foreground bg-foreground text-background"
                : "border-border/50 text-foreground hover:border-foreground"
            }`}
          >
            {brand}
          </button>
        ))}
      </div>
      <Button
        onClick={nextStep}
        disabled={userData.brands.length === 0}
        className="w-full h-14"
      >
        Continue ({userData.brands.length} selected)
      </Button>
      <button
        onClick={prevStep}
        className="block mx-auto mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back
      </button>
    </div>
  </motion.div>
);

// Hijab Style Step
export const HijabStyleStep = ({
  updateUserData,
  nextStep,
  prevStep,
}: Pick<StepProps, "updateUserData" | "nextStep" | "prevStep">) => (
  <motion.div {...fadeInUp} className="min-h-screen bg-background px-6 py-12">
    <div className="max-w-md mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl mb-3">Your hijab style?</h2>
        <p className="text-muted-foreground">
          Help us personalize your recommendations
        </p>
        <div className="w-8 h-px bg-gold mx-auto mt-6" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {hijabStyles.map((style) => (
          <button
            key={style.name}
            onClick={() => {
              updateUserData("hijabStyle", style.name);
              nextStep();
            }}
            className="p-6 border border-border/50 hover:border-foreground transition-all text-center group"
          >
            <span className="text-4xl block mb-3">{style.emoji}</span>
            <span className="font-sans tracking-wide text-sm">
              {style.name}
            </span>
          </button>
        ))}
      </div>
      <button
        onClick={prevStep}
        className="block mx-auto mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back
      </button>
    </div>
  </motion.div>
);

// Colors & Style Step
export const ColorsStyleStep = ({
  userData,
  toggleArrayItem,
  nextStep,
  prevStep,
}: Pick<
  StepProps,
  "userData" | "toggleArrayItem" | "nextStep" | "prevStep"
>) => (
  <motion.div {...fadeInUp} className="min-h-screen bg-background px-6 py-12">
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl mb-3">Your style preferences</h2>
        <p className="text-muted-foreground">
          Pick your favorite colors and style
        </p>
        <div className="w-8 h-px bg-gold mx-auto mt-6" />
      </div>
      <div className="mb-10">
        <h3 className="text-sm tracking-wider text-muted-foreground mb-4">
          Favorite Colors
        </h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => toggleArrayItem("favoriteColors", color.name)}
              className="relative group"
              title={color.name}
            >
              <div
                className={`w-12 h-12 rounded-full border-2 transition-all ${
                  userData.favoriteColors.includes(color.name)
                    ? "border-gold scale-110"
                    : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: color.hex }}
              />
              {userData.favoriteColors.includes(color.name) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check
                    className={`w-5 h-5 ${
                      color.name === "White" || color.name === "Beige"
                        ? "text-foreground"
                        : "text-white"
                    }`}
                  />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-10">
        <h3 className="text-sm tracking-wider text-muted-foreground mb-4">
          Style Personality (Pick 3)
        </h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {stylePersonalities.map((style) => (
            <button
              key={style}
              onClick={() => {
                if (userData.stylePersonality.includes(style)) {
                  toggleArrayItem("stylePersonality", style);
                } else if (userData.stylePersonality.length < 3) {
                  toggleArrayItem("stylePersonality", style);
                }
              }}
              className={`px-5 py-3 border transition-all font-sans tracking-wide ${
                userData.stylePersonality.includes(style)
                  ? "border-foreground bg-foreground text-background"
                  : "border-border/50 text-foreground hover:border-foreground"
              } ${
                userData.stylePersonality.length >= 3 &&
                !userData.stylePersonality.includes(style)
                  ? "opacity-30"
                  : ""
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
      <Button
        onClick={nextStep}
        disabled={
          userData.favoriteColors.length === 0 ||
          userData.stylePersonality.length === 0
        }
        className="w-full h-14"
      >
        Continue
      </Button>
      <button
        onClick={prevStep}
        className="block mx-auto mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back
      </button>
    </div>
  </motion.div>
);

// Completion Page
export const CompletionPage = ({
  userData,
  onNavigate,
}: {
  userData: UserData;
  onNavigate: (path: string) => void;
}) => (
  <motion.div
    {...fadeInUp}
    className="min-h-screen bg-background px-6 py-12 flex items-center justify-center"
  >
    <div className="max-w-md mx-auto text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 bg-foreground rounded-full flex items-center justify-center mx-auto mb-8"
      >
        <Check className="w-10 h-10 text-background" />
      </motion.div>
      <h2 className="font-serif text-4xl mb-4">
        Welcome, {userData.fullName.split(" ")[0]}!
      </h2>
      <p className="text-muted-foreground mb-8">
        Your style profile is ready. Let's start styling.
      </p>
      <div className="w-16 h-px bg-gold mx-auto mb-8" />
      <div className="space-y-4">
        <Button className="w-full h-14" onClick={() => onNavigate("/home")}>
          Go to Dashboard
        </Button>
        <Button
          variant="outline"
          className="w-full h-14"
          onClick={() => onNavigate("/closet")}
        >
          Add Items to Closet
        </Button>
      </div>
    </div>
  </motion.div>
);
