import { MapPin, Navigation, Calendar, Clock, Euro, GripVertical, Sparkles } from "lucide-react";
import Link from "next/link";
import MapWrapper from "@/components/map/MapWrapper";

// Insert this before export default function
const mockMarkers = [
  { id: "1", latitude: 35.7147, longitude: 139.7966, title: "Senso-ji Temple" },
  { id: "2", latitude: 35.6990, longitude: 139.7714, title: "Akihabara" },
  { id: "3", latitude: 35.7100, longitude: 139.8107, title: "Tokyo Skytree" },
];
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BudgetView from "@/components/budget/BudgetView";

export default function TripPage({ params }: { params: { id: string } }) {
  // Mock data for the MVP UI
  const days = [
    {
      date: "Day 1 - Oct 12",
      city: "Tokyo",
      activities: [
        { time: "09:00", name: "Senso-ji Temple", duration: "1h 30m", category: "Attraction", cost: "Free", distance: "1.2 km" },
        { time: "11:30", name: "Travel to Akihabara", duration: "15m", category: "Transport", cost: "¥170", distance: "Metro" },
        { time: "12:00", name: "Lunch at Udon Shin", duration: "1h", category: "Food", cost: "¥1200", distance: "300 m" },
        { time: "14:00", name: "Tokyo Skytree", duration: "2h", category: "Attraction", cost: "¥3100", distance: "2 km" },
      ]
    },
    {
      date: "Day 2 - Oct 13",
      city: "Tokyo",
      activities: [
        { time: "10:00", name: "Shibuya Crossing", duration: "1h", category: "Attraction", cost: "Free", distance: "0.5 km" },
        { time: "11:30", name: "Meiji Shrine", duration: "2h", category: "Attraction", cost: "Free", distance: "1.5 km" },
      ]
    }
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row h-screen overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-full md:w-[450px] lg:w-[500px] border-r border-border bg-background flex flex-col h-full z-10 shadow-xl overflow-y-auto">
        
        <Tabs defaultValue="itinerary" className="w-full flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border bg-card sticky top-0 z-20">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight mb-1">10 Days in Japan</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Oct 12 - Oct 22
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-muted-foreground block mb-1">Total Est.</span>
                <span className="text-xl font-bold">€2,450</span>
              </div>
            </div>
            
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Badge variant="secondary" className="whitespace-nowrap">Tokyo (4)</Badge>
              <Badge variant="outline" className="whitespace-nowrap">Kyoto (3)</Badge>
              <Badge variant="outline" className="whitespace-nowrap">Osaka (3)</Badge>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <TabsContent value="itinerary" className="m-0 space-y-8 focus-visible:outline-none">
              {days.map((day, i) => {
                // Mock weather for demonstration
                const isRainy = i === 1;
                const weatherIcon = isRainy ? "🌧" : "☀";
                const temp = isRainy ? "22°" : "27°";

                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold">{day.date}</h2>
                        <Badge variant="secondary" className="flex gap-1.5 items-center font-normal px-2">
                          <span>{weatherIcon}</span> {temp}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isRainy && (
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1 border-primary/20 text-primary hover:bg-primary/10">
                            <Sparkles className="w-3 h-3" /> Fix for rain
                          </Button>
                        )}
                        <span className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3"/> {day.city}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border before:-z-10">
                      {day.activities.map((act, j) => (
                      <div key={j} className="flex gap-4 items-start group">
                        {/* Timeline Line/Dot */}
                        <div className="flex flex-col items-center mt-1">
                          <div className="w-12 text-xs font-bold text-muted-foreground text-right mr-2">{act.time}</div>
                        </div>
                        
                        {/* Activity Card */}
                        <div className="flex-1 bg-card border border-border p-4 rounded-xl hover:border-primary/50 transition-colors cursor-pointer relative shadow-sm">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity">
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                          </div>
                          
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-sm leading-tight">{act.name}</h3>
                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{act.category}</Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {act.duration}</span>
                            <span className="flex items-center gap-1"><Euro className="w-3 h-3" /> {act.cost}</span>
                            {act.category === "Transport" ? (
                              <span className="flex items-center gap-1"><Navigation className="w-3 h-3" /> {act.distance}</span>
                            ) : (
                              <span className="flex items-center gap-1 text-primary/80">
                                🚶‍♂️ {act.distance}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            </TabsContent>

            <TabsContent value="budget" className="m-0 focus-visible:outline-none">
              <BudgetView />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Map Area */}
      <div className="flex-1 bg-secondary relative hidden md:block">
        <MapWrapper markers={mockMarkers} />
        
        {/* Floating Travel Mode Button */}
        <div className="absolute bottom-8 right-8">
          <Link href={`/trips/${params.id}/travel`}>
            <Button size="lg" className="rounded-full shadow-2xl h-14 px-8 text-base font-semibold gap-2">
              <Navigation className="w-5 h-5" /> Travel Mode
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
