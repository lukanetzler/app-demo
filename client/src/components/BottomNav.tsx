import { Book, Compass, Calendar } from "lucide-react";
import { useLocation } from "wouter";

interface BottomNavProps {
  onHomeClick?: () => void;
}

export default function BottomNav({ onHomeClick }: BottomNavProps) {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: "/journal", icon: Book, label: "Journal", disabled: false },
    { path: "/", icon: Calendar, label: "Today", disabled: false },
    { path: "/library", icon: Compass, label: "Explore", disabled: false },
  ];

  const handleNavClick = (path: string, disabled: boolean) => {
    if (disabled) return;
    if (path === "/" && onHomeClick) {
      onHomeClick();
    } else {
      setLocation(path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 px-4 pb-6 pointer-events-none" data-testid="nav-bottom">
      <div className="max-w-lg mx-auto pointer-events-auto">
        <div className="bg-card/95 backdrop-blur-lg border border-border/50 rounded-3xl shadow-2xl px-2 py-2">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = location === item.path;
              const Icon = item.icon;
              const isDisabled = item.disabled;

              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path, isDisabled)}
                  className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-6 rounded-2xl transition-all ${
                    isDisabled
                      ? 'opacity-40 cursor-not-allowed'
                      : isActive
                        ? 'bg-primary/10'
                        : 'hover:bg-muted/50 active:scale-95'
                  }`}
                  data-testid={`button-nav-${item.label.toLowerCase()}`}
                  disabled={isDisabled}
                >
                  <div className="relative">
                    <Icon
                      className={`w-5 h-5 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </div>
                  <span className={`text-xs font-medium transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
