import { Switch, Route, useRoute, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useFirebaseContent } from "@/hooks/useFirebaseContent";
import JournalPage from "@/pages/JournalPage";
import HomePage from "@/pages/HomePage";
import LibraryPage from "@/pages/LibraryPage";
import EmotionMediprayersPage from "@/pages/EmotionMediprayersPage";
import AuthPage from "@/pages/AuthPage";
import WelcomePage from "@/pages/WelcomePage";
import SignUpFlowPage from "@/pages/SignUpFlowPage";
import GuestModePage from "@/pages/GuestModePage";
import AudioPlayerPage from "@/pages/AudioPlayerPage";
import AccountPage from "@/pages/AccountPage";
import SettingsPage from "@/pages/SettingsPage";
import SupportPage from "@/pages/SupportPage";
import PreviewPage from "@/pages/PreviewPage";
import EntryDetailPage from "@/pages/EntryDetailPage";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";

function Router() {
  const { user, loading } = useAuth();
  const { isLoading: contentLoading } = useFirebaseContent();
  const [isWelcomePage] = useRoute("/welcome");
  const [isSignUpPage] = useRoute("/signup");
  const [isSignInPage] = useRoute("/signin");
  const [isSkipAuthPage] = useRoute("/skip-auth");
  const [isPreviewPage] = useRoute("/preview");
  const [location] = useLocation();

  if (loading || contentLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Calmandments</div>
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  // Show auth/onboarding pages if user is not logged in
  if (!user) {
    if (isSignUpPage) return <SignUpFlowPage />;
    if (isSignInPage) return <AuthPage />;
    if (isSkipAuthPage) return <GuestModePage />;
    if (isPreviewPage) return <PreviewPage />;
    return <WelcomePage />;
  }

  // Show auth pages even when user is logged in (for switching accounts)
  if (isWelcomePage) return <WelcomePage />;
  if (isSignUpPage) return <SignUpFlowPage />;
  if (isSignInPage) return <AuthPage />;
  if (isSkipAuthPage) return <GuestModePage />;
  if (isPreviewPage) return <PreviewPage />;

  return (
    <>
      <Header />
      <div key={location} className="page-fade-in">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/journal" component={JournalPage} />
          <Route path="/library/:emotion" component={EmotionMediprayersPage} />
          <Route path="/library" component={LibraryPage} />
          <Route path="/player" component={AudioPlayerPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/account" component={AccountPage} />
          <Route path="/support" component={SupportPage} />
          <Route path="/entry/:id" component={EntryDetailPage} />
        </Switch>
      </div>
      <BottomNav />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
