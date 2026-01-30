import { Lock, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LibraryCardProps {
  title: string;
  description: string;
  duration: number;
  type: "Mediprayer" | "Meditation" | "BibleStory";
  isPremium: boolean;
  imageUrl?: string;
  userIsPremium?: boolean;
  onClick?: () => void;
  onPremiumClick?: () => void;
}

export default function LibraryCard({ 
  title, 
  description, 
  duration, 
  type, 
  isPremium,
  imageUrl,
  userIsPremium = false,
  onClick,
  onPremiumClick 
}: LibraryCardProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const handleClick = () => {
    if (isPremium && !userIsPremium) {
      onPremiumClick?.();
      console.log('Premium content - upgrade required');
    } else {
      onClick?.();
      console.log('Library card clicked:', title);
    }
  };

  return (
    <Card 
      className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer relative"
      onClick={handleClick}
      data-testid={`card-library-${type.toLowerCase()}`}
    >
      <div className="aspect-video relative bg-gradient-to-br from-secondary/40 to-muted/40 flex items-center justify-center"
        style={imageUrl ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover' } : {}}
      >
        {!imageUrl && <div className="text-5xl">🙏</div>}
        
        {isPremium && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-yellow-950 border-0">
              <Lock className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground flex-1" data-testid="text-library-title">
            {title}
          </h3>
          <Badge variant="secondary" className="shrink-0">
            {type}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center gap-1 text-duration">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium" data-testid="text-library-duration">
            {formatDuration(duration)}
          </span>
        </div>
      </div>
    </Card>
  );
}
