import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Crown, Loader2, Check } from "lucide-react";
import { createCheckoutSession } from "@/lib/stripe";

interface PremiumUpgradeProps {
  isPremium: boolean;
}

export function PremiumUpgrade({ isPremium }: PremiumUpgradeProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async () => {
    if (!user || user.isAnonymous) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: "Please log in to upgrade to premium",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const checkoutUrl = await createCheckoutSession(user.uid);
      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start checkout process",
      });
      setIsProcessing(false);
    }
  };

  if (isPremium) {
    return (
      <Card className="border-yellow-500/50 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <CardTitle className="text-yellow-900 dark:text-yellow-100">Premium Member</CardTitle>
          </div>
          <CardDescription className="text-yellow-800 dark:text-yellow-200">
            You have access to all premium features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-yellow-900 dark:text-yellow-100">
              <Check className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span>Access to exclusive premium content</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-yellow-900 dark:text-yellow-100">
              <Check className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span>Extended meditation library</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-yellow-900 dark:text-yellow-100">
              <Check className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span>Bonus Bible stories and prayers</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-600" />
          <CardTitle>Upgrade to Premium</CardTitle>
        </div>
        <CardDescription>
          Unlock exclusive content and enhanced features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-600" />
            <span>Access to exclusive premium content</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-600" />
            <span>Extended meditation library</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-600" />
            <span>Bonus Bible stories and prayers</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-600" />
            <span>Support continued development</span>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-bold">£9.99</span>
            <span className="text-sm text-muted-foreground">one-time payment</span>
          </div>

          <Button
            onClick={handleUpgrade}
            disabled={isProcessing || user?.isAnonymous}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </>
            )}
          </Button>

          {user?.isAnonymous && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Please create an account to upgrade to premium
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
