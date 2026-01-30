import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

interface BibleVerseProps {
  reference: string;
  text: string;
  onSave?: () => void;
}

export default function BibleVerse({ reference, text, onSave }: BibleVerseProps) {
  const { user, signOut } = useAuth();
  const [, setLocation] = useLocation();

  const handleSave = async () => {
    if (user) {
        if (user.isAnonymous) {
            await signOut();
            setLocation("/auth");
        } else {
            onSave?.();
            console.log('Verse saved to journal');
        }
    } else {
        setLocation("/auth");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center" data-testid="card-bible-verse">
      <div className="bg-primary/20 rounded-2xl p-8 mb-6 w-full">
        <div className="text-center mb-6">
          <Heart className="w-8 h-8 text-primary mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            A Word for You
          </h2>
        </div>
        
        <blockquote className="text-center mb-4">
          <p className="text-lg leading-relaxed text-foreground mb-4">
            "{text}"
          </p>
          <cite className="text-sm font-semibold text-primary">
            {reference}
          </cite>
        </blockquote>
      </div>

      <Button
        onClick={handleSave}
        className="w-full max-w-xs"
        size="lg"
        data-testid="button-save-verse"
      >
        {(!user || user.isAnonymous) ? "Login to Save" : "Save to Journal"}
      </Button>
    </div>
  );
}
