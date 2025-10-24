import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export const Meditation = () => {
  const meditations = [
    {
      title: "Morning Clarity",
      duration: "10 min",
      description: "Start your day with focus and intention",
      color: "bg-primary",
    },
    {
      title: "Stress Relief",
      duration: "15 min",
      description: "Release tension and find calm",
      color: "bg-secondary",
    },
    {
      title: "Sleep Meditation",
      duration: "20 min",
      description: "Peaceful guidance for restful sleep",
      color: "bg-accent",
    },
    {
      title: "Body Scan",
      duration: "12 min",
      description: "Connect with your physical sensations",
      color: "bg-primary",
    },
    {
      title: "Gratitude Practice",
      duration: "8 min",
      description: "Cultivate appreciation and joy",
      color: "bg-secondary",
    },
    {
      title: "Mindful Breathing",
      duration: "5 min",
      description: "Simple awareness of the breath",
      color: "bg-accent",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Meditation</h1>
        <p className="text-muted-foreground">
          Guided meditations for every moment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meditations.map((meditation, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-glow transition-all group">
            <div className={`${meditation.color} h-32 flex items-center justify-center`}>
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full w-16 h-16 group-hover:scale-110 transition-transform"
              >
                <Play className="w-6 h-6" />
              </Button>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{meditation.title}</h3>
                <span className="text-sm text-muted-foreground">{meditation.duration}</span>
              </div>
              <p className="text-sm text-muted-foreground">{meditation.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gradient-calm border-none">
        <h3 className="text-lg font-semibold mb-2">Meditation Benefits</h3>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Reduces stress and anxiety</li>
          <li>• Improves focus and concentration</li>
          <li>• Enhances emotional well-being</li>
          <li>• Promotes better sleep quality</li>
        </ul>
      </Card>
    </div>
  );
};
