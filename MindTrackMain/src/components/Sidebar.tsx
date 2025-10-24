import { Home, Wind, Brain, BookOpen, ListTodo, MessageCircle, TrendingUp, LogOut, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  onLogout: () => void;
}

export const Sidebar = ({ currentSection, onNavigate, onLogout }: SidebarProps) => {
  const menuItems = [
    { icon: Home, label: "Home", value: "dashboard" },
    { icon: BookOpen, label: "Journal", value: "journal" },
    { icon: MessageCircle, label: "Community", value: "chat" },
    { icon: TrendingUp, label: "Resources", value: "mood" },
  ];

  return (
    <aside className="w-full border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-foreground">Healio</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              <button
                key={item.value}
                className={cn(
                  "text-muted-foreground hover:text-foreground transition-colors font-medium",
                  currentSection === item.value && "text-foreground"
                )}
                onClick={() => onNavigate(item.value)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
              </svg>
            </Button>
            <button
              onClick={onLogout}
              className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 transition-colors overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                alt="User"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className="md:hidden border-t border-border px-6 py-2">
        <div className="flex gap-2 overflow-x-auto">
          {menuItems.map((item) => (
            <Button
              key={item.value}
              variant="ghost"
              size="sm"
              className={cn(
                "gap-2 flex-shrink-0",
                currentSection === item.value && "bg-accent"
              )}
              onClick={() => onNavigate(item.value)}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </aside>
  );
};
