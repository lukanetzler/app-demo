import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface MediprayerCardProps {
  title: string;
  description?: string;
  onPlay: () => void;
}

export default function MediprayerCard({ title, description, onPlay }: MediprayerCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardFooter className="flex justify-end">
        <Button onClick={onPlay}>
          <Play className="w-4 h-4 mr-2" />
          Play
        </Button>
      </CardFooter>
    </Card>
  );
}
