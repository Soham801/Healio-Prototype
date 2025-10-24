import { useState } from "react";
import { Heart, Shield, Phone } from "lucide-react";
import HelplineCard from "@/components/HelplineCard";
import EmergencyButton from "@/components/EmergencyButton";
import MapView from "@/components/MapView";
import ServiceFilter from "@/components/ServiceFilter";
import heroImage from "@/assets/hero-wellness.jpg";

const Index = () => {
  const [selectedServiceType, setSelectedServiceType] = useState("all");

  const helplines = [
    {
      name: "NIMHANS Crisis Helpline",
      number: "080-46110007",
      description: "24/7 mental health crisis support",
      availability: "Available 24/7",
    },
    {
      name: "Vandrevala Foundation",
      number: "1860-2662-345",
      description: "Free mental health support and counseling",
      availability: "Available 24/7",
    },
    {
      name: "iCall Helpline",
      number: "9152987821",
      description: "Psychosocial counseling and support",
      availability: "Mon-Sat, 8 AM - 10 PM",
    },
    {
      name: "Snehi Foundation",
      number: "91-22-2772-6771",
      description: "Crisis intervention and emotional support",
      availability: "Available 24/7",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-[hsl(260,68%,62%)]/90" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <Heart className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">Your Mental Health Matters</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Healio
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Find immediate mental health support, crisis helplines, and nearby professionals when you need them most
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#helplines" className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-[var(--transition-smooth)] shadow-[var(--shadow-elevated)]">
                <Phone className="h-5 w-5" />
                Crisis Helplines
              </a>
              <a href="#services" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-[var(--transition-smooth)]">
                <Shield className="h-5 w-5" />
                Find Nearby Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Helplines Section */}
      <section id="helplines" className="py-16 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              24/7 Crisis Helplines
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Speak with trained mental health professionals immediately. You're not alone.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto grid gap-6">
            {helplines.map((helpline, index) => (
              <HelplineCard key={index} {...helpline} />
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Find Nearby Mental Health Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Locate psychiatrists, counselors, wellness centers, and doctors near you
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto space-y-6">
            <ServiceFilter
              selectedType={selectedServiceType}
              onTypeChange={setSelectedServiceType}
            />
            
            <MapView serviceType={selectedServiceType} />
          </div>
        </div>
      </section>

      {/* Emergency Button */}
      <EmergencyButton />

      {/* Footer */}
      <footer className="bg-muted py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            If you're experiencing a mental health emergency, please call{" "}
            <a href="tel:108" className="text-primary font-semibold hover:underline">
              108
            </a>{" "}
            for immediate assistance
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            Healio - Your Mental Health Support System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
