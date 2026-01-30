import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";

// Helper function to convert Firebase error codes to user-friendly messages
const getAuthErrorMessage = (error: any): string => {
  const errorCode = error?.code;

  switch (errorCode) {
    case 'auth/requires-recent-login':
      return 'Please sign out and sign in again to make this change';
    case 'auth/invalid-email':
      return 'Please enter a valid email address';
    case 'auth/email-already-in-use':
      return 'This email is already in use by another account';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters';
    case 'auth/user-not-found':
      return 'Account not found';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection';
    default:
      return error?.message || 'An error occurred. Please try again';
  }
};

export default function AccountPage() {
  const [, setLocation] = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  useEffect(() => {
    if (user && !user.isAnonymous) {
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSaveChanges = async () => {
    if (!user || user.isAnonymous) return;

    setIsSaving(true);
    try {
      // Update Firebase user profile
      const { updateProfile, updateEmail } = await import("firebase/auth");
      const auth = (await import("@/lib/firebase")).auth;

      const updates = [];

      // Update display name if changed
      if (displayName !== user.displayName && auth.currentUser) {
        updates.push(updateProfile(auth.currentUser, { displayName }));
      }

      // Update email if changed
      if (email !== user.email && auth.currentUser && email) {
        updates.push(updateEmail(auth.currentUser, email));
      }

      await Promise.all(updates);

      toast({
        title: "Success",
        description: "Your account details have been updated",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: getAuthErrorMessage(error),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user || user.isAnonymous || !user.email) return;

    setIsSendingReset(true);
    try {
      const { sendPasswordResetEmail } = await import("firebase/auth");
      const auth = (await import("@/lib/firebase")).auth;

      await sendPasswordResetEmail(auth, user.email);

      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for a link to reset your password",
      });
    } catch (error) {
      console.error("Error sending password reset email:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: getAuthErrorMessage(error),
      });
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleBackToHome = () => {
    setLocation("/");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setLocation("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: getAuthErrorMessage(error),
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please log in to view your account</p>
          <Button onClick={() => setLocation("/auth")}>Log In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto p-4 pt-20">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBackToHome}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-muted-foreground mb-2">Account</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account details
          </p>
        </div>

        {/* Profile Information Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Enter your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Changing your email may require re-verification
              </p>

              {/* Reset Password Button */}
              {!user.isAnonymous && user.email && (
                <Button
                  onClick={handleResetPassword}
                  disabled={isSendingReset}
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                >
                  {isSendingReset ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              )}
            </div>

            {/* Account Created Date */}
            {!user.isAnonymous && user.metadata?.creationTime && (
              <div className="space-y-2">
                <Label>Our Anniversary</Label>
                <div className="text-sm text-muted-foreground px-3 py-2 bg-muted rounded-md">
                  {new Date(user.metadata.creationTime).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            )}

            {/* Save Button */}
            <Button
              onClick={handleSaveChanges}
              disabled={
                isSaving ||
                user.isAnonymous ||
                (displayName === user.displayName && email === user.email)
              }
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Sign Out Button */}
        {!user.isAnonymous && (
          <div className="mt-6">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full border-primary/30 bg-primary/10 text-foreground hover:bg-primary/20 hover:border-primary/50"
            >
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
