import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { signUp, signIn, user, loading } = useAuth();
  const { completeOnboarding } = useProfile();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [hasAutoJumped, setHasAutoJumped] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  const stepFromUrl = searchParams.get('step');
  const initialStep = stepFromUrl ? parseInt(stepFromUrl) : 0;

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');

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

  // --- FIX 1: Enhanced Google Sync ---
  useEffect(() => {
    if (!loading && user) {
      setUserData(prev => ({
        ...prev,
        fullName: prev.fullName || user.user_metadata?.full_name || '',
        email: prev.email || user.email || '',
      }));

      if (currentStep < 2 && !hasAutoJumped) {
        setCurrentStep(2);
        setHasAutoJumped(true);
      }
    }
  }, [user, loading, hasAutoJumped]); // ❗ removed currentStep to avoid loop

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
        setCurrentStep(prev => prev + 1);
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

  const handleCompleteOnboarding = async () => {
  // Save to localStorage as backup
  localStorage.setItem('modesta-pending-profile', JSON.stringify(userData));
  
  if (!user) {
    // User not confirmed yet - data will be saved when they confirm email
    console.log('User not authenticated yet, profile saved to localStorage');
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
          <CompletionPage key="complete" userData={userData} onNavigate={navigate} />
        )}
      </AnimatePresence>
    </div>
  );
}
