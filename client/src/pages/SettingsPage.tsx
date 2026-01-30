import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function SettingsPage() {
  const [, setLocation] = useLocation();

  const handleBackToHome = () => {
    setLocation("/");
  };

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
          <h1 className="text-3xl font-bold text-muted-foreground mb-2">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Customize your app preferences
          </p>
        </div>

        {/* Theme Preferences Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize your app's look and feel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeSwitcher />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
