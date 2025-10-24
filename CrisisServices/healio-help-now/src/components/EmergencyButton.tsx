import { AlertCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const EmergencyButton = () => {
  const [calling, setCalling] = useState(false);

  const handleEmergencyCall = () => {
    setCalling(true);
    toast.success("Connecting to emergency services...");
    setTimeout(() => {
      window.location.href = "tel:108"; // Indian emergency ambulance number
      setCalling(false);
    }, 500);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Button
        onClick={handleEmergencyCall}
        disabled={calling}
        size="lg"
        className="h-16 w-16 rounded-full bg-gradient-to-br from-destructive to-[hsl(25,85%,65%)] hover:shadow-[0_0_30px_hsl(10,78%,60%/0.4)] text-destructive-foreground shadow-[var(--shadow-elevated)] transition-all duration-300 hover:scale-110"
      >
        {calling ? (
          <div className="animate-pulse">
            <Phone className="h-7 w-7" />
          </div>
        ) : (
          <AlertCircle className="h-7 w-7" />
        )}
      </Button>
      <p className="text-xs text-center mt-2 font-medium text-foreground">
        Emergency
      </p>
    </div>
  );
};

export default EmergencyButton;
