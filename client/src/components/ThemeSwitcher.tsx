import { Check, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export default function ThemeSwitcher() {
  const { mode, toggleMode } = useTheme();

  return (
    <div className="space-y-4">
      {/* Mode Toggle Section */}
      <div>
        <h3 className="text-sm font-medium mb-1">Theme</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Switch between day and night mode
        </p>
        <div className="flex gap-2">
          <button
            onClick={toggleMode}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all",
              mode === 'dark'
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <Moon className="w-4 h-4" />
            <span className="text-sm font-medium">Night</span>
            {mode === 'dark' && (
              <Check className="w-4 h-4 text-primary ml-auto" />
            )}
          </button>
          <button
            onClick={toggleMode}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all",
              mode === 'light'
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <Sun className="w-4 h-4" />
            <span className="text-sm font-medium">Day</span>
            {mode === 'light' && (
              <Check className="w-4 h-4 text-primary ml-auto" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
