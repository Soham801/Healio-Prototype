import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Building2, Brain, MessageCircle, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

// Add your Google Maps API key here
const GOOGLE_MAPS_API_KEY = "AIzaSyB3e_2DSchesDCJwh8EyEfRRUP6PsbR2XQ";

interface MapViewProps {
  serviceType: string;
}

interface PlaceResult {
  name: string;
  vicinity: string;
  rating?: number;
  types?: string[];
  geometry?: {
    location: any;
  };
}

const MapView = ({ serviceType }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [services, setServices] = useState<PlaceResult[]>([]);
  const mapInstanceRef = useRef<any>(null);

  const loadMap = () => {
    if (!GOOGLE_MAPS_API_KEY) {
      toast.error("Please configure the Google Maps API key in MapView.tsx");
      return;
    }

    // Check if already loaded
    if ((window as any).google) {
      initializeMap();
      setMapLoaded(true);
      return;
    }

    // Load Google Maps script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      initializeMap();
      setMapLoaded(true);
      toast.success("Map loaded successfully!");
    };

    script.onerror = () => {
      toast.error("Failed to load Google Maps. Please check your API key.");
    };

    document.head.appendChild(script);
  };

  const getMarkerIcon = (type: string) => {
    const baseUrl = "http://maps.google.com/mapfiles/ms/icons/";
    const colors: { [key: string]: string } = {
      psychiatrist: "purple",
      counselor: "blue",
      center: "green",
      doctor: "red",
      all: "red",
    };
    return `${baseUrl}${colors[type] || "red"}-dot.png`;
  };

  const initializeMap = () => {
    if (!mapRef.current || !(window as any).google) return;

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const map = new (window as any).google.maps.Map(mapRef.current!, {
            center: userLocation,
            zoom: 13,
            styles: [
              {
                featureType: "poi.medical",
                elementType: "geometry",
                stylers: [{ color: "#e3f2fd" }],
              },
            ],
          });

          mapInstanceRef.current = map;

          // Add user location marker with pulsing effect
          new (window as any).google.maps.Marker({
            position: userLocation,
            map: map,
            title: "Your Location",
            icon: {
              path: (window as any).google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#4f46e5",
              fillOpacity: 1,
              strokeColor: "#fff",
              strokeWeight: 3,
            },
            animation: (window as any).google.maps.Animation.DROP,
          });

          // Add circle to show search radius
          new (window as any).google.maps.Circle({
            strokeColor: "#4f46e5",
            strokeOpacity: 0.3,
            strokeWeight: 2,
            fillColor: "#4f46e5",
            fillOpacity: 0.1,
            map: map,
            center: userLocation,
            radius: 5000,
          });

          // Search for nearby mental health services
          searchServices(map, userLocation);
        },
        () => {
          toast.error("Unable to get your location. Please enable location services.");
          // Fallback to a default location (Delhi, India)
          const defaultLocation = { lat: 28.6139, lng: 77.2090 };
          const map = new (window as any).google.maps.Map(mapRef.current!, {
            center: defaultLocation,
            zoom: 13,
          });
          mapInstanceRef.current = map;
          searchServices(map, defaultLocation);
        }
      );
    }
  };

  const searchServices = (map: any, location: any) => {
    const service = new (window as any).google.maps.places.PlacesService(map);
    const request = {
      location: location,
      radius: 5000,
      keyword: getSearchKeyword(serviceType),
    };

    service.nearbySearch(request, (results: PlaceResult[], status: any) => {
      if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && results) {
        setServices(results);
        
        // Clear existing markers except user location
        // (In production, you'd want to track markers and clear them properly)
        
        results.forEach((place, index) => {
          if (place.geometry?.location) {
            const marker = new (window as any).google.maps.Marker({
              position: place.geometry.location,
              map: map,
              title: place.name,
              icon: getMarkerIcon(serviceType),
              animation: (window as any).google.maps.Animation.DROP,
              label: {
                text: `${index + 1}`,
                color: "white",
                fontWeight: "bold",
              },
            });

            const infoWindow = new (window as any).google.maps.InfoWindow({
              content: `
                <div style="padding: 12px; max-width: 250px;">
                  <h3 style="font-weight: 600; margin-bottom: 8px; color: #1f2937; font-size: 14px;">${place.name}</h3>
                  <p style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">${place.vicinity}</p>
                  ${place.rating ? `
                    <div style="display: flex; align-items: center; gap: 4px; font-size: 12px;">
                      <span style="color: #f59e0b;">⭐</span>
                      <span style="font-weight: 600; color: #1f2937;">${place.rating}</span>
                      <span style="color: #9ca3af;">/5</span>
                    </div>
                  ` : ""}
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.vicinity)}" 
                    target="_blank"
                    style="display: inline-block; margin-top: 8px; padding: 6px 12px; background: #4f46e5; color: white; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 500;"
                  >
                    Get Directions
                  </a>
                </div>
              `,
            });

            marker.addListener("click", () => {
              infoWindow.open(map, marker);
            });
          }
        });

        toast.success(`Found ${results.length} services nearby`);
      } else {
        toast.error("No services found in this area");
        setServices([]);
      }
    });
  };

  const getSearchKeyword = (type: string): string => {
    const keywords: { [key: string]: string } = {
      all: "mental health psychiatrist counselor therapy clinic",
      psychiatrist: "psychiatrist mental health doctor",
      counselor: "counselor therapist psychologist mental health",
      center: "mental health center wellness center psychiatric hospital",
      doctor: "mental health doctor general physician clinic",
    };
    return keywords[type] || keywords.all;
  };

  const getServiceIcon = (index: number) => {
    const icons = [Brain, MessageCircle, Stethoscope, Building2];
    const Icon = icons[index % icons.length];
    return Icon;
  };

  useEffect(() => {
    loadMap();
  }, []);

  useEffect(() => {
    if (mapLoaded && mapInstanceRef.current) {
      const userLocation = mapInstanceRef.current.getCenter();
      if (userLocation) {
        searchServices(mapInstanceRef.current, {
          lat: userLocation.lat(),
          lng: userLocation.lng(),
        });
      }
    }
  }, [serviceType, mapLoaded]);

  if (!mapLoaded && !GOOGLE_MAPS_API_KEY) {
    return (
      <Card className="p-6 bg-card border-border">
        <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/30">
          <MapPin className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">Configuration Required</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Please add your Google Maps API key in the <code className="bg-muted px-1 py-0.5 rounded text-xs">MapView.tsx</code> file.
            </p>
            <p className="text-xs text-muted-foreground">
              Get your API key from the{" "}
              <a
                href="https://console.cloud.google.com/google/maps-apis"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Google Cloud Console
              </a>
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Services List */}
      <Card className="lg:col-span-1 p-6 bg-card border-border">
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-foreground mb-2">
            Found Services
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full font-bold">
              {services.length}
            </div>
            <span className="text-muted-foreground">
              {serviceType === "all" ? "services" : `${serviceType}${services.length !== 1 ? 's' : ''}`} nearby
            </span>
          </div>
        </div>

        <ScrollArea className="h-[500px] pr-4">
          {services.length > 0 ? (
            <div className="space-y-3">
              {services.map((service, index) => {
                const Icon = getServiceIcon(index);
                return (
                  <div
                    key={index}
                    className="p-4 bg-secondary/50 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary transition-[var(--transition-smooth)] cursor-pointer"
                    onClick={() => {
                      if (service.geometry?.location && mapInstanceRef.current) {
                        mapInstanceRef.current.panTo(service.geometry.location);
                        mapInstanceRef.current.setZoom(16);
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1">
                          <Icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <h4 className="font-semibold text-sm text-foreground line-clamp-2">
                            {service.name}
                          </h4>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {service.vicinity}
                        </p>
                        {service.rating && (
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-yellow-500">⭐</span>
                            <span className="font-semibold text-foreground">{service.rating}</span>
                            <span className="text-muted-foreground">/5</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <MapPin className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">
                {mapLoaded ? "Searching for services..." : "Loading map..."}
              </p>
            </div>
          )}
        </ScrollArea>
      </Card>

      {/* Map */}
      <Card className="lg:col-span-2 p-6 bg-card border-border">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-lg text-foreground">
            Map View
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>5km radius</span>
          </div>
        </div>
        <div
          ref={mapRef}
          className="w-full h-[500px] rounded-lg shadow-[var(--shadow-soft)] border border-border"
        />
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-full">
            <div className="w-3 h-3 rounded-full bg-[#4f46e5]"></div>
            <span className="text-muted-foreground">Your Location</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-full">
            <img src="http://maps.google.com/mapfiles/ms/icons/red-dot.png" className="w-4 h-4" alt="" />
            <span className="text-muted-foreground">Mental Health Services</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MapView;
