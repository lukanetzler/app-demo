import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function PreviewPage() {
  const [, setLocation] = useLocation();
  const [showLine1, setShowLine1] = useState(false);
  const [showLine2, setShowLine2] = useState(false);
  const [showLine3, setShowLine3] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowLine1(true), 500);
    const timer2 = setTimeout(() => setShowLine2(true), 2000);
    const timer3 = setTimeout(() => setShowLine3(true), 3500);
    const timer4 = setTimeout(() => setShowButton(true), 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const handleContinue = () => {
    setLocation("/skip-auth");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 swipe-up">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-6">
          <h1
            className={`text-4xl font-bold transition-opacity duration-1000 ${
              showLine1 ? "opacity-100" : "opacity-0"
            }`}
          >
            Here's a look at our features
          </h1>

          <p
            className={`text-xl text-muted-foreground transition-opacity duration-1000 ${
              showLine2 ? "opacity-100" : "opacity-0"
            }`}
          >
            To help you decide if you want to stay
          </p>

          <p
            className={`text-lg text-muted-foreground max-w-xl mx-auto transition-opacity duration-1000 ${
              showLine3 ? "opacity-100" : "opacity-0"
            }`}
          >
            Experience daily meditations, track your mood, and grow in faith and mindfulness
          </p>
        </div>

        <div
          className={`transition-opacity duration-1000 ${
            showButton ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            onClick={handleContinue}
            size="lg"
            className="px-8"
          >
            Continue to Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
