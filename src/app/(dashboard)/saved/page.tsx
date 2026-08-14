import { Heart, Search, MapPin, MoreHorizontal, ArrowUpRight, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SavedPage() {
  const savedItems = [
    { name: "Udon Shin", location: "Tokyo, Japan", type: "Restaurant", added: "2 days ago", image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=500&q=80" },
    { name: "Banff National Park", location: "Alberta, Canada", type: "Destination", added: "1 week ago", image: "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=500&q=80" },
    { name: "Villa Cimbrone Gardens", location: "Ravello, Italy", type: "Attraction", added: "2 weeks ago", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=500&q=80" },
    { name: "Omoide Yokocho", location: "Tokyo, Japan", type: "Attraction", added: "1 month ago", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&q=80" },
  ];

  return (
    <div className="flex-1 p-6 md:p-10 overflow-auto">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
              <Heart className="w-8 h-8 text-primary fill-primary/20" /> Saved Places
            </h1>
            <p className="text-muted-foreground text-lg">Your personal collection of inspiration.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <FolderOpen className="w-4 h-4" /> New Collection
            </Button>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search saved places..." className="pl-9 h-11 bg-card" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {["All", "Destinations", "Restaurants", "Attractions", "Hotels"].map((filter, i) => (
              <Badge 
                key={filter} 
                variant={i === 0 ? "default" : "outline"}
                className="px-4 py-2 rounded-lg cursor-pointer hover:bg-secondary whitespace-nowrap"
              >
                {filter}
              </Badge>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {savedItems.map((item, i) => (
            <Card key={i} className="group overflow-hidden border-border bg-card hover:border-primary/50 transition-colors cursor-pointer flex flex-col">
              <div className="h-48 relative overflow-hidden bg-secondary">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${item.image})` }}></div>
                <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-md rounded-full p-2 text-primary hover:bg-background transition-colors">
                  <Heart className="w-4 h-4 fill-primary" />
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge variant="secondary" className="backdrop-blur-md bg-background/80 font-medium">
                    {item.type}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors flex items-center gap-2">
                  {item.name} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
                  <MapPin className="w-3 h-3" /> {item.location}
                </p>
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">Added {item.added}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
