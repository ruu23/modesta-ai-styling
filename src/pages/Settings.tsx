import { User, Settings2, Ruler, Shield, CreditCard, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettings } from '@/hooks/useSettings';
import { ProfileTab } from '@/components/settings/ProfileTab';
import { PreferencesTab } from '@/components/settings/PreferencesTab';
import { MeasurementsTab } from '@/components/settings/MeasurementsTab';
import { AccountTab } from '@/components/settings/AccountTab';
import { SubscriptionTab } from '@/components/settings/SubscriptionTab';
import { ThemeToggle } from '@/components/theme';

const Settings = () => {
  const {
    profile,
    preferences,
    measurements,
    account,
    subscription,
    stats,
    updateProfile,
    updatePreferences,
    updateStylePreferences,
    updateNotifications,
    updateMeasurements,
    updateDetailedMeasurements,
    updateAccount,
    updatePrivacy,
  } = useSettings();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings2 },
    { id: 'measurements', label: 'Measurements', icon: Ruler },
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold">Settings</h1>
              <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-8">
          {/* Tab Navigation */}
          <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 rounded-lg flex-wrap">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2.5"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="animate-fade-in">
            <ProfileTab 
              profile={profile}
              stats={stats}
              onUpdate={updateProfile}
            />
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="animate-fade-in">
            <PreferencesTab 
              preferences={preferences}
              onUpdateStyle={updateStylePreferences}
              onUpdateNotifications={updateNotifications}
              onUpdatePreferences={updatePreferences}
            />
          </TabsContent>

          {/* Measurements Tab */}
          <TabsContent value="measurements" className="animate-fade-in">
            <MeasurementsTab 
              measurements={measurements}
              measurementUnit={preferences.measurementUnit}
              onUpdateMeasurements={updateMeasurements}
              onUpdateDetailedMeasurements={updateDetailedMeasurements}
            />
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="animate-fade-in">
            <AccountTab 
              account={account}
              onUpdateAccount={updateAccount}
              onUpdatePrivacy={updatePrivacy}
            />
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="animate-fade-in">
            <SubscriptionTab subscription={subscription} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
