import { Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HelplineCardProps {
  name: string;
  number: string;
  description: string;
  availability?: string;
}

const HelplineCard = ({ name, number, description, availability }: HelplineCardProps) => {
  const handleCall = () => {
    window.location.href = `tel:${number}`;
  };

  return (
    <Card className="p-6 bg-card hover:shadow-[var(--shadow-elevated)] transition-[var(--transition-smooth)] border-border">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-foreground mb-1">{name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
          {availability && (
            <p className="text-xs text-accent font-medium">{availability}</p>
          )}
        </div>
        <Button
          onClick={handleCall}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
          size="lg"
        >
          <Phone className="mr-2 h-5 w-5" />
          Call {number}
        </Button>
      </div>
    </Card>
  );
};

export default HelplineCard;
