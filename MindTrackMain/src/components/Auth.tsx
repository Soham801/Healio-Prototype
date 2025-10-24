import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart } from "lucide-react";

interface AuthProps {
  onAuth: (user: { email: string; name: string }) => void;
}

export const Auth = ({ onAuth }: AuthProps) => {
  const [isSignup, setIsSignup] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth({ email: loginEmail, name: "User" });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth({ email: signupEmail, name: signupName });
  };

  const handleQuickStart = () => {
    onAuth({ email: "demo@healio.com", name: "Demo User" });
  };

  if (!isSignup) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">Healio</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Resources</a>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Talk to Healio
              </Button>
              <Button onClick={() => setIsSignup(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Start Healing
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Your AI companion for emotional wellness.
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Healio is your personal AI guide to understanding and improving your mental health. 
                Track your mood, analyze your emotions, and engage in supportive conversations with our empathic AI.
              </p>
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  onClick={handleQuickStart}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Start Healing
                </Button>
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => setIsSignup(true)}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  Talk to Healio
                </Button>
              </div>
            </div>

            {/* Hero Image Placeholder */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-hero rounded-full blur-3xl" />
                <div className="relative w-80 h-80 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-4 border-primary/30">
                  <Heart className="w-32 h-32 text-primary" fill="currentColor" />
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-32 space-y-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-4">Comprehensive Support for Your Mental Health</h2>
              <p className="text-lg text-muted-foreground">
                Healio offers a range of features designed to support your emotional well-being and personal growth.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {[
                { title: "Emotion Analysis", desc: "Understand your emotional patterns with AI-powered analysis of your journal entries and conversations.", icon: "😊" },
                { title: "Mood Tracking", desc: "Track your daily mood and identify trends to gain insights into your mental well-being.", icon: "📊" },
                { title: "Crisis Support", desc: "Access immediate support and resources during moments of crisis or distress.", icon: "🛡️" },
                { title: "AI Therapy Chat", desc: "Engage in confidential, supportive conversations with our AI therapist, available 24/7.", icon: "💬" },
                { title: "Habit Help", desc: "Build healthy habits and routines with personalized guidance and reminders.", icon: "✨" },
                { title: "Empathic AI", desc: "Interact with an AI designed for empathy, understanding, and non-judgmental support.", icon: "💡" },
              ].map((feature, i) => (
                <Card key={i} className="p-6 hover:shadow-soft transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border mt-32 py-8">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <p>© 2024 Healio. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-foreground transition-colors">Contact Us</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 shadow-soft">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary-foreground" fill="currentColor" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Healio</h1>
          </div>
          <p className="text-muted-foreground">Your mental wellness companion</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="login-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="login-password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Login
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="signup-name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="signup-name"
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="signup-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="signup-email"
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="signup-password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Sign Up
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={() => setIsSignup(false)} className="text-muted-foreground">
            ← Back to landing page
          </Button>
        </div>
      </Card>
    </div>
  );
};
