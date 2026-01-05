import { Check, Zap, Crown, Clock, CreditCard, ArrowLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

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
    priceEGP: 6450,
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
    priceEGP: 60000,
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

interface Plan {
  id: string;
  name: string;
  price: number;
  priceEGP: number;
  icon: React.ElementType;
  popular?: boolean;
  period: string;
  savings?: number;
  features: string[];
}

interface BillingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function SubscriptionTab() {
  const { subscription, loading, cancelSubscription } = useSubscription();
  const [currentPage, setCurrentPage] = useState<'plans' | 'payment'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingData, setBillingData] = useState<BillingData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

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

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setCurrentPage('payment');
  };

  const handleBackToPlans = () => {
    setCurrentPage('plans');
    setSelectedPlan(null);
    setBillingData({ firstName: '', lastName: '', email: '', phone: '' });
  };

  const handlePayWithCard = async () => {
    if (!selectedPlan) return;

    if (!billingData.firstName || !billingData.lastName || !billingData.email || !billingData.phone) {
      toast.error('Please fill in all billing details');
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('paymob-payment', {
        body: {
          amount_cents: selectedPlan.priceEGP * 100,
          currency: 'EGP',
          billing_data: {
            first_name: billingData.firstName,
            last_name: billingData.lastName,
            email: billingData.email,
            phone_number: billingData.phone,
          },
          plan_id: selectedPlan.id,
        },
      });

      if (error) throw error;

      if (data?.iframe_url) {
        window.open(data.iframe_url, '_blank');
        toast.success('Payment page opened in new tab');
      } else {
        throw new Error('Failed to get payment URL');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (currentPage === 'plans') {
    return (
      <div className="space-y-6 p-6 max-w-6xl mx-auto">
        {isTrialActive && (
          <Card className="border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-amber-900 dark:text-amber-100">Free Trial Active</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    {trialTimeLeft} remaining. Choose a plan to continue after trial.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                  <CardDescription>Active subscription</CardDescription>
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
              <span className="font-medium">{subscription.usage.closetItems}</span>
            </div>
          </CardContent>
        </Card>

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
                    <p className="text-xs text-muted-foreground mt-1">
                      ({plan.priceEGP.toLocaleString()} EGP)
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

  // Payment Page
  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={handleBackToPlans} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Plans
      </Button>

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
              <p className="text-3xl font-bold">{selectedPlan?.priceEGP.toLocaleString()} EGP</p>
              <p className="text-sm text-muted-foreground">/${selectedPlan?.price} USD/{selectedPlan?.period}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Billing Details
          </CardTitle>
          <CardDescription>Enter your information to proceed with payment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={billingData.firstName}
                onChange={(e) => setBillingData(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={billingData.lastName}
                onChange={(e) => setBillingData(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={billingData.email}
              onChange={(e) => setBillingData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="01XXXXXXXXX"
              value={billingData.phone}
              onChange={(e) => setBillingData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div className="pt-4 border-t">
            <div className="p-4 bg-muted rounded-lg space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Plan:</span>
                <span className="font-medium">{selectedPlan?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Period:</span>
                <span className="font-medium">{selectedPlan?.period === 'month' ? 'Monthly' : 'Yearly'}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-primary">{selectedPlan?.priceEGP.toLocaleString()} EGP</span>
              </div>
            </div>

            <Button 
              onClick={handlePayWithCard} 
              className="w-full h-14 text-lg gap-2"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  Pay with Card
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
