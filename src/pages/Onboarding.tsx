import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import {
  LoginPage,
  BasicInfoStep,
  CountryStep,
  CityStep,
  BrandsStep,
  HijabStyleStep,
  ColorsStyleStep,
  CompletionPage,
  UserData
} from '@/components/onboarding/OnboardingSteps';

export default function Onboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const forceStart = Boolean(
    (location.state as { forceStart?: boolean } | null)?.forceStart
  );

  const { signUp, signIn, user, loading, resetPassword } = useAuth();
  const { completeOnboarding } = useProfile();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [hasAutoJumped, setHasAutoJumped] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const stepFromUrl = searchParams.get('step');
  const initialStep = forceStart ? 0 : stepFromUrl ? parseInt(stepFromUrl) : 0;

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [authMode, setAuthMode] = useState<'signup' | 'signin' | 'forgot'>('signup');

  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    city: '',
    brands: [],
    modestyLevel: 'moderate',
    favoriteColors: [],
    stylePersonality: [],
    hijabStyle: '',
    occasions: []
  });

  // --- FIX 1: Enhanced Google Sync + block unverified users ---
  useEffect(() => {
    if (loading) return;

    // If signed in but email not verified, force verify-email flow
    if (user && !user.email_confirmed_at) {
      if (user.email) {
        localStorage.setItem('pendingVerificationEmail', user.email);
      }
      navigate('/verify-email', { replace: true });
      return;
    }

    // When coming back from /home via browser back, show the first onboarding screen
    // (don't auto-jump authenticated users to later steps).
    if (forceStart && !hasAutoJumped) {
      setCurrentStep(0);
      setHasAutoJumped(true);
      return;
    }

    if (user?.email_confirmed_at) {
      setUserData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.user_metadata?.full_name || '',
        email: prev.email || user.email || '',
      }));

      if (!hasAutoJumped) {
        setCurrentStep((prev) => (prev < 2 ? 2 : prev));
        setHasAutoJumped(true);
      }
    }
  }, [user, loading, hasAutoJumped, forceStart, navigate]);

  const updateUserData = (field: keyof UserData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof UserData, item: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(item)
        ? (prev[field] as string[]).filter(i => i !== item)
        : [...(prev[field] as string[]), item]
    }));
  };

  const handleAuthSubmit = async () => {
    setIsLoading(true);
    try {
      if (authMode === 'signup') {
        const { error } = await signUp(userData.email, userData.password, {
          full_name: userData.fullName,
        });
        if (error) {
          toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
          return;
        }

        // After signup, always redirect to verify-email
        localStorage.setItem('pendingVerificationEmail', userData.email);
        navigate('/verify-email');
        return;
      } else {
        const { error } = await signIn(userData.email, userData.password);
        if (error) {
          toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
          return;
        }
        navigate('/home');
      }
    } catch {
      toast({ title: "Error", description: "Unexpected error occurred", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) {
        toast({ title: "Reset failed", description: error.message, variant: "destructive" });
        return;
      }
      toast({ 
        title: "Check your email", 
        description: "We've sent you a password reset link." 
      });
      setAuthMode('signin');
    } catch {
      toast({ title: "Error", description: "Unexpected error occurred", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteOnboarding = async () => {
  // Save to localStorage as backup
  localStorage.setItem('modesta-pending-profile', JSON.stringify(userData));

  // Only allow saving user data after email confirmed
  if (!user?.email_confirmed_at) {
    if (user?.email) {
      localStorage.setItem('pendingVerificationEmail', user.email);
    }
    toast({
      title: 'Verify your email',
      description: 'Please verify your email before saving your profile.',
    });
    navigate('/verify-email');
    return;
  }

  setIsLoading(true);
  try {
    const { error } = await completeOnboarding(user.id, {
      full_name: userData.fullName,
      country: userData.country,
      city: userData.city,
      brands: userData.brands,
      hijab_style: userData.hijabStyle,
      favorite_colors: userData.favoriteColors,
      style_personality: userData.stylePersonality,
    });

    if (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Profile save failed",
        description: "Your preferences were saved locally and will sync later.",
        variant: "destructive",
      });
    } else {
      // Clear localStorage on success
      localStorage.removeItem('modesta-pending-profile');
    }
  } catch (error) {
    console.error('Error completing onboarding:', error);
  } finally {
    setIsLoading(false);
  }
};


  // --- FIX 2: Better nextStep flow ---
  const nextStep = async () => {
    if (currentStep === 6) {
      setIsLoading(true);
      await handleCompleteOnboarding();
      setIsLoading(false);
    }

    if (currentStep < 7) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setHasAutoJumped(true);
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {currentStep === 0 && <LoginPage key="login" nextStep={nextStep} />}

        {currentStep === 1 && (
          <BasicInfoStep
            key="basic"
            userData={userData}
            updateUserData={updateUserData}
            nextStep={handleAuthSubmit}
            isLoading={isLoading}
            authMode={authMode}
            setAuthMode={setAuthMode}
            onResetPassword={handleResetPassword}
          />
        )}

        {currentStep === 2 && (
          <CountryStep key="country" updateUserData={updateUserData} nextStep={nextStep} prevStep={prevStep} />
        )}

        {currentStep === 3 && (
          <CityStep key="city" userData={userData} updateUserData={updateUserData} nextStep={nextStep} prevStep={prevStep} />
        )}

        {currentStep === 4 && (
          <BrandsStep key="brands" userData={userData} toggleArrayItem={toggleArrayItem} nextStep={nextStep} prevStep={prevStep} />
        )}

        {currentStep === 5 && (
          <HijabStyleStep key="hijab" updateUserData={updateUserData} nextStep={nextStep} prevStep={prevStep} />
        )}

        {currentStep === 6 && (
          <ColorsStyleStep
            key="colors"
            userData={userData}
            toggleArrayItem={toggleArrayItem}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}

        {currentStep === 7 && (
          <CompletionPage key="complete" userData={userData} onNavigate={(path) => {
            // First navigate to / to reset history, then to destination
            navigate('/', { replace: true, state: { forceStart: true } });
            navigate(path);
          }} />
        )}
      </AnimatePresence>
    </div>
  );
}
