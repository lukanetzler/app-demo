
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLocation } from "wouter";

interface LoginPromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginPromptDialog({ isOpen, onClose }: LoginPromptDialogProps) {
  const [, setLocation] = useLocation();

  const handleLogin = () => {
    setLocation("/auth");
    onClose();
  };

  const handleContinue = () => {
    setLocation("/");
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Save Your Progress</AlertDialogTitle>
          <AlertDialogDescription>
            Create an account to save your journal entries and track your progress over time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleContinue}>Continue without saving</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogin}>Login to Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
