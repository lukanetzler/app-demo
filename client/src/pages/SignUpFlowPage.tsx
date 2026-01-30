import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

// Helper function to convert Firebase error codes to user-friendly messages
const getAuthErrorMessage = (error: any): string => {
  const errorCode = error?.code;

  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters';
    case 'auth/invalid-email':
      return 'Please enter a valid email address';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection';
    default:
      return 'Something went wrong. Please try again';
  }
};

export default function SignUpFlowPage() {
  const [, setLocation] = useLocation();
  const { signUp } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<"up" | "down">("up");

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setAnimationDirection("up");
      setStep(2);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setAnimationDirection("up");
      setStep(3);
    }
  };

  const handleBackToStep1 = () => {
    setAnimationDirection("down");
    setStep(1);
  };

  const handleBackToStep2 = () => {
    setAnimationDirection("down");
    setStep(2);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 6 characters",
      });
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);

      // Update the user's display name
      if (auth.currentUser && name.trim()) {
        await updateProfile(auth.currentUser, { displayName: name });
      }

      toast({
        title: `Welcome, ${name}!`,
        description: "Your account has been created",
      });
      setLocation("/");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: getAuthErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="flex items-center gap-6 w-full max-w-md">
        {/* Vertical Step Indicator */}
        <div className="flex flex-col gap-3">
          <div className={`w-1 h-16 rounded-full transition-all ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`w-1 h-16 rounded-full transition-all ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`w-1 h-16 rounded-full transition-all ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
        </div>

        {/* Card with animation */}
        <Card className={`flex-1 p-8 ${animationDirection === "up" ? "swipe-up" : animationDirection === "down" ? "swipe-down" : "swipe-up"}`} key={step}>
          {step === 1 && (
            <form onSubmit={handleNameSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">What is your name?</h2>
              <p className="text-sm text-muted-foreground">
                We'll use this to personalize your experience
              </p>
            </div>
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              className="text-center text-lg py-6"
            />
            <Button type="submit" className="w-full" size="lg">
              Continue
            </Button>
            <button
              type="button"
              onClick={() => setLocation("/welcome")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              Back
            </button>
          </form>
        )}

          {step === 2 && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">What is your email?</h2>
              <p className="text-sm text-muted-foreground">
                We'll use this to secure your account
              </p>
            </div>
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="text-center text-lg py-6"
            />
            <Button type="submit" className="w-full" size="lg">
              Continue
            </Button>
            <button
              type="button"
              onClick={handleBackToStep1}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              Back
            </button>
          </form>
        )}

          {step === 3 && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Select a password</h2>
              <p className="text-sm text-muted-foreground">
                Must be at least 6 characters
              </p>
            </div>
            <Input
              type="password"
              placeholder="Choose a secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoFocus
              className="text-center text-lg py-6"
            />
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating your account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
            <button
              type="button"
              onClick={handleBackToStep2}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
              disabled={loading}
            >
              Back
            </button>
          </form>
        )}
        </Card>
      </div>
    </div>
  );
}
