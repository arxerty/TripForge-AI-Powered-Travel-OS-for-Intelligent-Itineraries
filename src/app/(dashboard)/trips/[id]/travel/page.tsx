import Link from "next/link";
import { ArrowLeft, MapPin, Navigation, Clock, Info, Compass, Car, Train } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function TravelModePage({ params }: { params: { id: string } }) {
  // Mock data for travel mode
  const currentActivity = {
    name: "Senso-ji Temple",
    time: "09:00 - 10:30",
    timeRemaining: "45 mins remaining",
    category: "Attraction",
    image: "https://images.unsplash.com/photo-1531572753322-ad0110ce3e2e?w=500&q=80",
    location: "Asakusa, Tokyo",
    notes: "Enter through the Kaminarimon Gate. Check out Nakamise shopping street for snacks."
  };

  const nextActivity = {
    name: "Travel to Akihabara",
    time: "10:30",
    category: "Transport",
    duration: "15m via Ginza Line",
  };

  return (
    <div className="flex flex-col h-screen bg-background sm:max-w-md sm:mx-auto sm:border-x sm:border-border sm:shadow-2xl relative">
      
      {/* Dynamic Map Background Header */}
      <div className="relative h-64 shrink-0 bg-secondary overflow-hidden rounded-b-3xl shadow-lg z-10">
        <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: `url(${currentActivity.image})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/30"></div>
        
        {/* Top Nav */}
        <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center text-white">
          <Link href={`/trips/${params.id}`}>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <Badge className="bg-black/40 hover:bg-black/40 backdrop-blur-md text-white border-none gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Live
          </Badge>
        </div>

        {/* Header Content */}
        <div className="absolute bottom-6 inset-x-6 flex flex-col items-start gap-2 text-white">
          <Badge variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur-md">{currentActivity.category}</Badge>
          <h1 className="text-3xl font-bold leading-tight">{currentActivity.name}</h1>
          <p className="flex items-center gap-1.5 text-white/80 text-sm">
            <MapPin className="w-4 h-4" /> {currentActivity.location}
          </p>
        </div>
      </div>

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-24 space-y-8 z-0">
        
        {/* Status & Time */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">{currentActivity.time}</p>
              <p className="text-sm text-primary font-medium">{currentActivity.timeRemaining}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <Button variant="secondary" className="h-16 flex-col gap-1 rounded-2xl">
            <Navigation className="w-5 h-5" />
            <span className="text-xs">Navigate</span>
          </Button>
          <Button variant="secondary" className="h-16 flex-col gap-1 rounded-2xl">
            <Car className="w-5 h-5" />
            <span className="text-xs">Ride</span>
          </Button>
          <Button variant="secondary" className="h-16 flex-col gap-1 rounded-2xl">
            <Info className="w-5 h-5" />
            <span className="text-xs">Tickets</span>
          </Button>
        </div>

        {/* Notes */}
        <div>
          <h3 className="font-semibold mb-3">AI Notes</h3>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-sm text-muted-foreground leading-relaxed">
              {currentActivity.notes}
            </CardContent>
          </Card>
        </div>

        {/* Next Up */}
        <div>
          <h3 className="font-semibold mb-3 text-muted-foreground">Next Up (10:30)</h3>
          <Card className="bg-secondary/50 border-border shadow-none">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border">
                  <Train className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold">{nextActivity.name}</p>
                  <p className="text-xs text-muted-foreground">{nextActivity.duration}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Floating Compass */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none">
        <Button size="lg" className="rounded-full shadow-2xl h-14 w-14 p-0 pointer-events-auto bg-primary text-primary-foreground hover:scale-105 transition-transform">
          <Compass className="w-6 h-6" />
        </Button>
      </div>

    </div>
  );
}
