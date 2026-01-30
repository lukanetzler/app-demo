import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  const [, setLocation] = useLocation();
  const [showLine1, setShowLine1] = useState(false);
  const [showLine2, setShowLine2] = useState(false);
  const [showLine3, setShowLine3] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowLine1(true), 500);
    const timer2 = setTimeout(() => setShowLine2(true), 2500);
    const timer3 = setTimeout(() => setShowLine3(true), 4500);
    const timer4 = setTimeout(() => setShowButtons(true), 6500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  // Start Journey swipe handlers
  const handleStartTouchStart = (e: React.TouchEvent) => {
    startTouchStartX.current = e.touches[0].clientX;
    setStartIsSwiping(true);
  };

  const handleStartTouchMove = (e: React.TouchEvent) => {
    if (!startIsSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startTouchStartX.current;
    // Only allow right swipe
    if (diff > 0) {
      setStartSwipeX(diff);
    }
  };

  const handleStartTouchEnd = () => {
    setStartIsSwiping(false);
    // If swiped more than 60% of the way, trigger navigation
    if (startSwipeX > window.innerWidth * 0.6) {
      setLocation("/signup");
    } else {
      // Snap back
      setStartSwipeX(0);
    }
  };

  // Continue Journey swipe handlers
  const handleContinueTouchStart = (e: React.TouchEvent) => {
    continueTouchStartX.current = e.touches[0].clientX;
    setContinueIsSwiping(true);
  };

  const handleContinueTouchMove = (e: React.TouchEvent) => {
    if (!continueIsSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - continueTouchStartX.current;
    // Only allow right swipe
    if (diff > 0) {
      setContinueSwipeX(diff);
    }
  };

  const handleContinueTouchEnd = () => {
    setContinueIsSwiping(false);
    // If swiped more than 60% of the way, trigger navigation
    if (continueSwipeX > window.innerWidth * 0.6) {
      setLocation("/signin");
    } else {
      // Snap back
      setContinueSwipeX(0);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 swipe-up">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Fade-in welcome messages */}
        <div className="space-y-6">
          <h1
            className={`text-5xl font-bold transition-opacity duration-1000 ${
              showLine1 ? "opacity-100" : "opacity-0"
            }`}
          >
            Hello
          </h1>

          <p
            className={`text-2xl text-muted-foreground transition-opacity duration-1000 ${
              showLine2 ? "opacity-100" : "opacity-0"
            }`}
          >
            Welcome to Calmandments
          </p>

          <p
            className={`text-xl text-muted-foreground max-w-xl mx-auto transition-opacity duration-1000 ${
              showLine3 ? "opacity-100" : "opacity-0"
            }`}
          >
            Where faith and mindfulness meet
          </p>
        </div>

        {/* Journey selection buttons */}
        <div
          className={`space-y-4 transition-opacity duration-1000 ${
            showButtons ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={() => setLocation("/signup")}
            className="w-full max-w-md mx-auto block py-3 text-lg font-medium rounded-full border-2 border-primary/30 bg-primary/10 text-foreground hover:bg-primary/20 hover:border-primary/50 transition-all active:scale-95"
          >
            Start Your Journey
          </button>

          <button
            onClick={() => setLocation("/signin")}
            className="w-full max-w-md mx-auto block py-3 text-lg font-medium rounded-full border-2 border-primary/30 bg-primary/10 text-foreground hover:bg-primary/20 hover:border-primary/50 transition-all active:scale-95"
          >
            Continue Your Journey
          </button>

          {/* Sneak Peek Button */}
          <button
            onClick={() => setLocation("/preview")}
            className="w-full max-w-md mx-auto block py-2 px-4 text-sm font-medium rounded-lg border border-muted bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all active:scale-95 mt-3"
          >
            Sneak Peek
          </button>
        </div>
      </div>
    </div>
  );
}
