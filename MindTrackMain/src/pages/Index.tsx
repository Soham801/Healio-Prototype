import { useState } from "react";
import { Auth } from "@/components/Auth";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { BreathingExercise } from "@/components/BreathingExercise";
import { Meditation } from "@/components/Meditation";
import { Journal } from "@/components/Journal";
import { Tasks } from "@/components/Tasks";
import { MoodTracker } from "@/components/MoodTracker";
import { Chat } from "@/components/Chat";

const Index = () => {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [currentSection, setCurrentSection] = useState("dashboard");

  const handleAuth = (userData: { email: string; name: string }) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentSection("dashboard");
  };

  const renderSection = () => {
    switch (currentSection) {
      case "dashboard":
        return <Dashboard onNavigate={setCurrentSection} />;
      case "breathe":
        return <BreathingExercise />;
      case "meditation":
        return <Meditation />;
      case "journal":
        return <Journal />;
      case "tasks":
        return <Tasks />;
      case "mood":
        return <MoodTracker />;
      case "chat":
        return <Chat />;
      default:
        return <Dashboard onNavigate={setCurrentSection} />;
    }
  };

  if (!user) {
    return <Auth onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        currentSection={currentSection}
        onNavigate={setCurrentSection}
        onLogout={handleLogout}
      />
      <main className="p-8 overflow-auto">
        {renderSection()}
      </main>
    </div>
  );
};

export default Index;
