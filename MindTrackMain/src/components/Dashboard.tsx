import { Wind, Brain, BookOpen, ListTodo, MessageCircle, TrendingUp, Heart, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DashboardProps {
  onNavigate: (section: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const userName = "Sukanya";

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}</h1>
          <p className="text-muted-foreground">
            Here's your mental wellness summary for today.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Mood Trends */}
          <Card className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Daily Mood Trends</h2>
                <p className="text-sm text-muted-foreground">Last 7 days</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">7.5</div>
                <div className="text-sm text-primary flex items-center gap-1 justify-end">
                  <TrendingUp className="w-4 h-4" />
                  +10%
                </div>
              </div>
            </div>
            
            {/* Simple mood chart visualization */}
            <div className="h-48 flex items-end gap-2">
              {[45, 65, 55, 70, 50, 85, 75].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-gradient-to-t from-primary to-primary/50 rounded-t-lg transition-all hover:from-primary/80"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Crisis Support Alert */}
          <Alert className="bg-destructive/10 border-destructive/20">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-destructive mb-1">Feeling Overwhelmed?</p>
                <p className="text-sm text-muted-foreground">
                  If you're in distress, remember that support is available. Reach out for help.
                </p>
              </div>
              <Button variant="destructive" size="sm">
                Get Help
              </Button>
            </AlertDescription>
          </Alert>

          {/* Recommended Activities */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recommended Activities</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Card 
                className="p-6 cursor-pointer hover:shadow-soft transition-all group bg-gradient-to-br from-primary/5 to-secondary/5"
                onClick={() => onNavigate("breathe")}
              >
                <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Wind className="w-12 h-12 text-primary" />
                </div>
                <h3 className="font-semibold">Play a Relaxing Game</h3>
              </Card>

              <Card 
                className="p-6 cursor-pointer hover:shadow-soft transition-all group bg-gradient-to-br from-secondary/10 to-secondary/5"
                onClick={() => onNavigate("journal")}
              >
                <div className="aspect-square rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-12 h-12 text-primary" />
                </div>
                <h3 className="font-semibold">Read a Motivational Quote</h3>
              </Card>

              <Card 
                className="p-6 cursor-pointer hover:shadow-soft transition-all group bg-gradient-to-br from-primary/5 to-primary/10"
                onClick={() => onNavigate("meditation")}
              >
                <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Brain className="w-12 h-12 text-primary" />
                </div>
                <h3 className="font-semibold">Start a Wellness Challenge</h3>
              </Card>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Today's Emotion */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" fill="currentColor" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Today's Emotion: Calm</h3>
                <p className="text-sm text-muted-foreground">Mood Level: High</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Streak:</span>
                <span className="font-semibold text-primary">7 days</span>
              </div>
            </div>
          </Card>

          {/* Addiction Recovery */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Addiction Recovery</h3>
            <div className="text-center py-8">
              <div className="text-5xl font-bold mb-2">75%</div>
              <div className="text-sm text-muted-foreground mb-4">75 days</div>
              <p className="text-sm text-muted-foreground">
                You are doing great. Keep it up!
              </p>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-accent"
                onClick={() => onNavigate("journal")}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Journal Entry
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-accent"
                onClick={() => onNavigate("mood")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Track Mood
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-accent"
                onClick={() => onNavigate("tasks")}
              >
                <ListTodo className="w-4 h-4 mr-2" />
                View Tasks
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-accent"
                onClick={() => onNavigate("chat")}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat Support
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
