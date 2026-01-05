import { Check, Zap, Crown, Clock, Wallet, CreditCard, ArrowLeft, Receipt } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Utility function for class names
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Mock hooks for demo
const useSubscription = () => ({
  subscription: {
    plan: null,
    status: 'trial',
    price: 0,
    current_period_end: new Date('2026-01-08').toISOString(),
    trial_ends_at: new Date('2026-01-08').toISOString(),
    usage: {
      aiQueriesUsed: 0,
      aiQueriesLimit: 100,
      closetItems: 0,
    },
    billingHistory: [],
  },
  loading: false,
  updatePlan: (planId: string) => console.log('Update plan:', planId),
  cancelSubscription: () => console.log('Cancel subscription'),
});

const PLANS = [
  {
    id: 'monthly',
    name: 'Premium',
    price: 129,
    icon: Zap,
    popular: true,
    period: 'month',
    features: [
      'Unlimited closet items',
      '100 AI queries/month',
      'Advanced styling suggestions',
      'Priority support',
      'Export calendars',
      'Personal stylist access',
    ],
  },
  {
    id: 'yearly',
    name: 'Pro',
    price: 1200,
    icon: Crown,
    period: 'year',
    savings: 348,
    features: [
      'Everything in Premium',
      'Unlimited AI queries',
      'Personal stylist access',
      'Custom color analysis',
      'Early feature access',
      '2 months FREE',
    ],
  },
];

const E_WALLETS = [
  { id: 'vodafone-cash', name: 'Vodafone Cash', color: 'bg-red-500' },
  { id: 'orange-money', name: 'Orange Money', color: 'bg-orange-500' },
  { id: 'etisalat-cash', name: 'Etisalat Cash', color: 'bg-green-500' },
  { id: 'we-pay', name: 'WE Pay', color: 'bg-purple-500' },
];

export default function SubscriptionTab() {
  const { subscription, loading, updatePlan, cancelSubscription } = useSubscription();
  const [currentPage, setCurrentPage] = useState('plans'); // 'plans' or 'payment'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showWalletInput, setShowWalletInput] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardContent className="h-32" />
        </Card>
      </div>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No subscription found</p>
        </CardContent>
      </Card>
    );
  }

  const currentPlan = PLANS.find(p => p.id === subscription.plan);
  const isTrialActive = subscription.status === 'trial' && subscription.trial_ends_at && new Date(subscription.trial_ends_at) > new Date();
  const trialTimeLeft = subscription.trial_ends_at 
    ? Math.ceil((new Date(subscription.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) + ' days'
    : null;

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setCurrentPage('payment');
  };

  const handlePayWithWallet = (walletId) => {
    const wallet = E_WALLETS.find(w => w.id === walletId);
    setSelectedWallet(wallet?.name || '');
    setShowWalletInput(true);
  };

  const handleWalletSubmit = () => {
    if (phoneNumber) {
      alert(`✓ Payment successful via ${selectedWallet}!\nPhone: ${phoneNumber}\nPlan: ${selectedPlan?.name} - $${selectedPlan?.price}/${selectedPlan?.period}`);
      setShowWalletInput(false);
      setPhoneNumber('');
      setSelectedWallet('');
      setCurrentPage('plans');
      setSelectedPlan(null);
    }
  };

  const handleBackToPlans = () => {
    setCurrentPage('plans');
    setSelectedPlan(null);
    setShowWalletInput(false);
    setPhoneNumber('');
    setSelectedWallet('');
  };

  // Page 1: Plans Selection
  if (currentPage === 'plans') {
    return (
      <div className="space-y-6 p-6 max-w-6xl mx-auto">
        {/* Trial Banner */}
        {isTrialActive && (
          <Card className="border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-amber-100">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-amber-900">Free Trial Active</p>
                  <p className="text-sm text-amber-700">
                    {trialTimeLeft} remaining. Choose a plan to continue after trial.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Plan (if exists) */}
        {currentPlan && (
          <Card className="border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <currentPlan.icon className="h-5 w-5 text-primary" />
                    {currentPlan.name} Plan
                    {subscription.status === 'trial' && (
                      <Badge variant="secondary">Trial</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Active subscription
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">${subscription.price}</p>
                  <p className="text-sm text-muted-foreground">/{currentPlan.period}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentPlan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Usage Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Usage This Month
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>AI Queries</span>
                <span className="font-medium">
                  {subscription.usage.aiQueriesUsed} / {subscription.usage.aiQueriesLimit}
                </span>
              </div>
              <Progress value={0} className="h-2" />
            </div>

            <div className="flex items-center justify-between py-2 border-t">
              <span className="text-sm">Closet Items</span>
              <span className="font-medium">
                {subscription.usage.closetItems}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Plan Options */}
        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
            <CardDescription>Choose the plan that works best for you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PLANS.map((plan) => (
                <div 
                  key={plan.id}
                  className={cn(
                    "relative p-6 rounded-xl border-2 transition-all",
                    plan.id === subscription.plan 
                      ? "border-primary bg-primary/5" 
                      : "border-muted hover:border-primary/50",
                    plan.popular && "ring-2 ring-primary ring-offset-2"
                  )}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                      Most Popular
                    </Badge>
                  )}
                  {plan.savings && (
                    <Badge variant="secondary" className="absolute -top-3 right-4">
                      Save ${plan.savings}
                    </Badge>
                  )}
                  <div className="text-center mb-4">
                    <plan.icon className="h-10 w-10 mx-auto mb-3 text-primary" />
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <p className="text-3xl font-bold mt-2">
                      ${plan.price}
                      <span className="text-sm font-normal text-muted-foreground">/{plan.period === 'month' ? 'mo' : 'yr'}</span>
                    </p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="text-sm flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={plan.id === subscription.plan ? "outline" : "default"}
                    className="w-full"
                    disabled={plan.id === subscription.plan}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    {plan.id === subscription.plan ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cancel Subscription */}
        {subscription.status !== 'cancelled' && subscription.plan && (
          <Card className="border-destructive/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Cancel Subscription</p>
                  <p className="text-sm text-muted-foreground">
                    You can cancel anytime. Your subscription will remain active until the end of the billing period.
                  </p>
                </div>
                <Button variant="outline" onClick={cancelSubscription}>
                  Cancel Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Page 2: Payment Options
  if (currentPage === 'payment') {
    return (
      <div className="space-y-6 p-6 max-w-4xl mx-auto">
        {/* Back Button */}
        <Button variant="ghost" onClick={handleBackToPlans} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Plans
        </Button>

        {/* Selected Plan Summary */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedPlan?.icon && <selectedPlan.icon className="h-5 w-5 text-primary" />}
              {selectedPlan?.name} Plan
            </CardTitle>
            <CardDescription>Complete your purchase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                {selectedPlan?.features.slice(0, 3).map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </div>
                ))}
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">${selectedPlan?.price}</p>
                <p className="text-sm text-muted-foreground">/{selectedPlan?.period}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Payment Options
            </CardTitle>
            <CardDescription>Pay securely with your preferred method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showWalletInput ? (
              <>
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">E-Wallets</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {E_WALLETS.map((wallet) => (
                      <Button
                        key={wallet.id}
                        variant="outline"
                        className="h-16 flex flex-col items-center justify-center gap-2"
                        onClick={() => handlePayWithWallet(wallet.id)}
                      >
                        <span className={`w-4 h-4 rounded-full ${wallet.color}`} />
                        <span className="text-xs text-center leading-tight">{wallet.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or pay with card</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full h-14 flex items-center justify-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Add Credit or Debit Card
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <span className={`w-4 h-4 rounded-full ${E_WALLETS.find(w => w.name === selectedWallet)?.color}`} />
                  <span className="font-medium">{selectedWallet}</span>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Plan:</span>
                    <span className="font-medium">{selectedPlan?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Amount:</span>
                    <span className="font-medium">${selectedPlan?.price}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-primary">${selectedPlan?.price}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleWalletSubmit} className="flex-1" disabled={!phoneNumber}>
                    Complete Payment
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowWalletInput(false);
                    setPhoneNumber('');
                    setSelectedWallet('');
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
}