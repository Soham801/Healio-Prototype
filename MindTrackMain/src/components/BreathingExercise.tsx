import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

export const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [count, setCount] = useState(4);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setCount((prev) => {
          if (prev === 1) {
            setPhase((currentPhase) => {
              if (currentPhase === "inhale") return "hold";
              if (currentPhase === "hold") return "exhale";
              return "inhale";
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  const handleToggle = () => setIsActive(!isActive);
  
  const handleReset = () => {
    setIsActive(false);
    setPhase("inhale");
    setCount(4);
  };

  const phaseColors = {
    inhale: "bg-primary",
    hold: "bg-secondary",
    exhale: "bg-accent",
  };

  const phaseText = {
    inhale: "Breathe In",
    hold: "Hold",
    exhale: "Breathe Out",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Breathing Exercise</h1>
        <p className="text-muted-foreground">
          Follow the rhythm to calm your mind and reduce stress
        </p>
      </div>

      <Card className="p-12 flex flex-col items-center justify-center space-y-8">
        <div
          className={`w-64 h-64 rounded-full ${phaseColors[phase]} flex items-center justify-center transition-all duration-1000 shadow-glow ${
            isActive ? "scale-110" : "scale-100"
          }`}
        >
          <div className="text-center text-white">
            <p className="text-2xl font-bold mb-2">{phaseText[phase]}</p>
            <p className="text-6xl font-bold">{count}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            size="lg"
            onClick={handleToggle}
            className="gap-2"
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isActive ? "Pause" : "Start"}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground max-w-md">
          <p>
            This 4-4-4 breathing technique helps activate your parasympathetic nervous
            system, promoting relaxation and reducing anxiety.
          </p>
        </div>
      </Card>
    </div>
  );
};
