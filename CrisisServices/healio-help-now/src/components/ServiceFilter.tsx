import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Stethoscope, Brain, MessageCircle, Building2, Filter } from "lucide-react";

interface ServiceFilterProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const ServiceFilter = ({ selectedType, onTypeChange }: ServiceFilterProps) => {
  const serviceTypes = [
    { id: "all", label: "All Services", icon: Filter },
    { id: "psychiatrist", label: "Psychiatrists", icon: Brain },
    { id: "counselor", label: "Counselors", icon: MessageCircle },
    { id: "center", label: "Wellness Centers", icon: Building2 },
    { id: "doctor", label: "Doctors", icon: Stethoscope },
  ];

  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="font-semibold text-lg text-foreground mb-4">Filter Services</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {serviceTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <Button
              key={type.id}
              onClick={() => onTypeChange(type.id)}
              variant={isSelected ? "default" : "outline"}
              className={`h-auto py-4 flex flex-col items-center gap-2 transition-[var(--transition-smooth)] ${
                isSelected
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{type.label}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default ServiceFilter;
