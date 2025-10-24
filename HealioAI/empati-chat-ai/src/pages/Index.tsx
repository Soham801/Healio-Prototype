import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Shield, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate("/chat");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-6 shadow-glow animate-scale-in">
            <Heart className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-fade-in">
            Your Empathic AI Companion
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl animate-fade-in">
            A safe, judgment-free space where you can share your thoughts, feelings, and experiences. 
            Get compassionate support whenever you need it.
          </p>
          
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="bg-gradient-to-br from-primary to-accent hover:shadow-glow transition-all duration-300 text-lg px-8 py-6 animate-fade-in"
          >
            Start Your Journey
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-6xl mx-auto">
          <div className="bg-card rounded-2xl p-8 shadow-soft border border-border hover:shadow-glow transition-all duration-300 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Empathic Conversations</h3>
            <p className="text-muted-foreground">
              Engage in meaningful dialogues with an AI trained to understand and validate your emotions.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-soft border border-border hover:shadow-glow transition-all duration-300 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Private & Secure</h3>
            <p className="text-muted-foreground">
              Your conversations are encrypted and stored securely. Your privacy is our priority.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-soft border border-border hover:shadow-glow transition-all duration-300 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Always Available</h3>
            <p className="text-muted-foreground">
              Get support whenever you need it, day or night. No appointments, no waiting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
