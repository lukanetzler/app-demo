import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function GuestModePage() {
  const [, setLocation] = useLocation();
  const { signInAsGuest } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleGuestSignIn = async () => {
      try {
        await signInAsGuest();
        setLocation("/");
      } catch (error: any) {
        console.error("Guest sign-in error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to continue. Please try again.",
        });
        setLocation("/welcome");
      }
    };

    handleGuestSignIn();
  }, [signInAsGuest, setLocation, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center swipe-up">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Setting up your local experience...</p>
      </div>
    </div>
  );
}
