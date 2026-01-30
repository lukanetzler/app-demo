import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

interface ReflectionInputProps {
  onSave?: (text: string) => void;
  onSkip?: () => void;
}

export default function ReflectionInput({ onSave, onSkip }: ReflectionInputProps) {
  const [text, setText] = useState("");
  const { user, signOut } = useAuth();
  const [, setLocation] = useLocation();

  const handleSave = async () => {
    if (user?.isAnonymous) {
      await signOut();
      setLocation("/auth");
    } else {
      onSave?.(text);
      console.log('Reflection saved:', text);
    }
  };

  const handleSkip = () => {
    onSkip?.();
    console.log('Reflection skipped');
  };

  return (
    <div className="w-full max-w-md mx-auto" data-testid="form-reflection">
      <h2 className="text-2xl font-bold text-center mb-2">Reflect on your day</h2>
      <p className="text-muted-foreground text-center mb-6">Write down your thoughts and feelings</p>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's on your mind today? How are you feeling about what happened?"
        className="min-h-32 mb-6 resize-none bg-card text-foreground"
        data-testid="input-reflection"
      />

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handleSkip}
          className="flex-1"
          data-testid="button-skip-reflection"
        >
          Skip
        </Button>
        <Button
          onClick={handleSave}
          className="flex-1"
          disabled={!text.trim() && !user?.isAnonymous}
          data-testid="button-save-reflection"
        >
          {user?.isAnonymous ? "Login to Save" : "Save & Continue"}
        </Button>
      </div>
    </div>
  );
}
