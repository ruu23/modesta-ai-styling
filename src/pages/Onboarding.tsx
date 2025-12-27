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
  const [hasAutoJumped, setHasAutoJumped] = useState(false); // NEW: Prevents "Back" button loop

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

  // --- 1. HANDLE AUTO-JUMP & GOOGLE METADATA ---
  useEffect(() => {
    if (!loading && user) {
      // Auto-fill name from Google if available
      if (user.user_metadata?.full_name && !userData.fullName) {
        updateUserData('fullName', user.user_metadata.full_name);
      }

      // Only jump to Step 2 if we haven't jumped before and are at the start
      if (currentStep < 2 && !hasAutoJumped) {
        setCurrentStep(2);
        setHasAutoJumped(true);
      }
    }
  }, [user, loading, currentStep, hasAutoJumped]);

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

  const goToSignIn = () => {
    setAuthMode('signin');
    setCurrentStep(0); // Go to login page
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
        setCurrentStep(currentStep + 1);
      } else {
        const { error } = await signIn(userData.email, userData.password);
        if (error) {
          toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
          return;
        }
        navigate('/home');
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    if (!user) {
      localStorage.setItem('modesta-user', JSON.stringify(userData));
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await completeOnboarding(user.id, {
        full_name: userData.fullName,
        country: userData.country,
        city: userData.city,
        brands: userData.brands,
        hijab_styles: [userData.hijabStyle],
        preferred_colors: userData.favoriteColors,
      });

      if (error) localStorage.setItem('modesta-user', JSON.stringify(userData));
    } catch (error) {
      localStorage.setItem('modesta-user', JSON.stringify(userData));
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 7) setCurrentStep(currentStep + 1);
    if (currentStep === 6) handleCompleteOnboarding();
  };

  // --- 2. UPDATED PREV STEP ---
  const prevStep = () => {
    if (currentStep > 0) {
      setHasAutoJumped(true); // Ensures the useEffect doesn't push us forward again
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <LoginPage key="login" nextStep={nextStep} />
        )}

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
          <CountryStep 
            key="country"
            updateUserData={updateUserData} 
            nextStep={nextStep} 
            prevStep={prevStep} 
          />
        )}

        {/* ... Rest of your steps (3 through 7) remain exactly the same ... */}
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
          <ColorsStyleStep key="colors" userData={userData} toggleArrayItem={toggleArrayItem} nextStep={nextStep} prevStep={prevStep} />
        )}
        {currentStep === 7 && (
          <CompletionPage key="complete" userData={userData} onNavigate={navigate} />
        )}
      </AnimatePresence>
    </div>
  );
}