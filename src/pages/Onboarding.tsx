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
  // Destructure hasCompletedOnboarding to use in our guard
  const { signUp, signIn, user, loading, hasCompletedOnboarding } = useAuth();
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

  // --- CORE FIX: The Route Guard ---
  // This triggers if the user clicks 'Back' or tries to visit /onboarding while done
  useEffect(() => {
    if (!loading && hasCompletedOnboarding) {
      // replace: true wipes the onboarding entry from the browser history
      navigate('/home', { replace: true });
    }
  }, [loading, hasCompletedOnboarding, navigate]);

  // --- Google Sync Logic ---
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
  }, [user, loading, hasAutoJumped]);

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
        // Use replace: true for existing users signing in
        navigate('/home', { replace: true });
      }
    } catch {
      toast({ title: "Error", description: "Unexpected error occurred", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    localStorage.setItem('modesta-pending-profile', JSON.stringify(userData));
    
    if (!user) return;

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

      if (!error) {
        localStorage.removeItem('modesta-pending-profile');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  // While checking if the user is already onboarded, show a simple loader
  // to prevent the Country Step from flickering
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

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
          <CompletionPage 
            key="complete" 
            userData={userData} 
            // The magic happens here: { replace: true }
            onNavigate={(path) => navigate(path, { replace: true })} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}