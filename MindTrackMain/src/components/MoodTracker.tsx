import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown, TrendingUp, Calendar } from "lucide-react";
import { toast } from "sonner";

interface MoodEntry {
  date: string;
  mood: "happy" | "neutral" | "sad";
  note?: string;
}

export const MoodTracker = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([
    { date: new Date().toLocaleDateString(), mood: "happy" },
  ]);
  const [selectedMood, setSelectedMood] = useState<"happy" | "neutral" | "sad" | null>(null);

  const moods = [
    { value: "happy" as const, icon: Smile, label: "Happy", color: "text-primary hover:bg-primary hover:text-white" },
    { value: "neutral" as const, icon: Meh, label: "Neutral", color: "text-secondary hover:bg-secondary hover:text-white" },
    { value: "sad" as const, icon: Frown, label: "Sad", color: "text-accent hover:bg-accent hover:text-white" },
  ];

  const handleSaveMood = () => {
    if (!selectedMood) {
      toast.error("Please select a mood");
      return;
    }

    const newEntry: MoodEntry = {
      date: new Date().toLocaleDateString(),
      mood: selectedMood,
    };

    setEntries([newEntry, ...entries]);
    setSelectedMood(null);
    toast.success("Mood logged!");
  };

  const getMoodIcon = (mood: string) => {
    const moodData = moods.find((m) => m.value === mood);
    return moodData ? moodData.icon : Meh;
  };

  const getMoodStats = () => {
    const happyCount = entries.filter((e) => e.mood === "happy").length;
    const neutralCount = entries.filter((e) => e.mood === "neutral").length;
    const sadCount = entries.filter((e) => e.mood === "sad").length;
    const total = entries.length;

    return { happyCount, neutralCount, sadCount, total };
  };

  const stats = getMoodStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mood Tracker</h1>
        <p className="text-muted-foreground">
          Track your emotional well-being over time
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">How are you feeling today?</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {moods.map((mood) => (
            <Button
              key={mood.value}
              variant={selectedMood === mood.value ? "default" : "outline"}
              className={`h-24 flex-col gap-2 ${mood.color} transition-all`}
              onClick={() => setSelectedMood(mood.value)}
            >
              <mood.icon className="w-8 h-8" />
              <span>{mood.label}</span>
            </Button>
          ))}
        </div>
        <Button onClick={handleSaveMood} className="w-full gap-2">
          <TrendingUp className="w-4 h-4" />
          Log Mood
        </Button>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center">
          <Smile className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold">{stats.happyCount}</p>
          <p className="text-sm text-muted-foreground">Happy Days</p>
        </Card>
        <Card className="p-6 text-center">
          <Meh className="w-8 h-8 mx-auto mb-2 text-secondary" />
          <p className="text-2xl font-bold">{stats.neutralCount}</p>
          <p className="text-sm text-muted-foreground">Neutral Days</p>
        </Card>
        <Card className="p-6 text-center">
          <Frown className="w-8 h-8 mx-auto mb-2 text-accent" />
          <p className="text-2xl font-bold">{stats.sadCount}</p>
          <p className="text-sm text-muted-foreground">Difficult Days</p>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Recent Entries
        </h2>
        <div className="space-y-3">
          {entries.slice(0, 7).map((entry, index) => {
            const Icon = getMoodIcon(entry.mood);
            return (
              <Card key={index} className="p-4 hover:shadow-soft transition-all">
                <div className="flex items-center gap-4">
                  <Icon className="w-6 h-6" />
                  <span className="text-sm text-muted-foreground">{entry.date}</span>
                  <span className="capitalize flex-1">{entry.mood}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
