import { useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Helper function to convert Firebase error codes to user-friendly messages
const getAuthErrorMessage = (error: any): string => {
  const errorCode = error?.code;

  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Email or password doesn\'t match';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters';
    case 'auth/invalid-email':
      return 'Please enter a valid email address';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled';
    default:
      return 'Authentication failed. Please try again';
  }
};

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in",
      });
      setLocation("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: getAuthErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      setLocation("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: getAuthErrorMessage(error),
      });
    }
  };


  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 swipe-up">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">
            Continue your journey with Calmandments
          </p>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="input-email"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              data-testid="input-password"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            data-testid="button-submit"
          >
            {loading ? "..." : "Sign In"}
          </Button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full mb-6"
          onClick={handleGoogleSignIn}
          data-testid="button-google-signin"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Google
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setLocation("/welcome")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Don't have an account? Start your journey
          </button>
        </div>
      </Card>
    </div>
  );
}
