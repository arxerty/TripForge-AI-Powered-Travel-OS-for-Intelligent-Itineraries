import Link from "next/link";
import { Search, MapPin, Star, ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function ExplorePage() {
  const trendingDestinations = [
    { name: "Kyoto, Japan", category: "Culture", rating: "4.9", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop" },
    { name: "Amalfi Coast, Italy", category: "Coastal", rating: "4.8", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1000&auto=format&fit=crop" },
    { name: "Banff, Canada", category: "Nature", rating: "4.9", image: "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?q=80&w=1000&auto=format&fit=crop" },
  ];

  const categories = ["All", "Trending", "Nature", "City Breaks", "Beaches", "Historical", "Adventure"];

  return (
    <div className="flex-1 overflow-auto">
      {/* Hero Section */}
      <div className="relative h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-3xl px-6 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Find Your Next Adventure</h1>
          <p className="text-lg md:text-xl text-muted-foreground">Discover trending destinations and AI-curated travel experiences.</p>
          
          <div className="relative max-w-2xl mx-auto mt-8">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search for a city, country, or vibe..." 
              className="pl-12 h-14 rounded-full bg-card/80 backdrop-blur-md border-border/50 text-lg shadow-2xl"
            />
            <Button className="absolute right-1.5 top-1.5 rounded-full h-11 px-6">
              Explore
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-12">
        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat, i) => (
            <Badge 
              key={cat} 
              variant={i === 0 ? "default" : "outline"} 
              className="px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer hover:bg-secondary transition-colors"
            >
              {cat}
            </Badge>
          ))}
        </div>

        {/* Trending Section */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1 flex items-center gap-2"><Compass className="w-6 h-6 text-primary"/> Trending This Week</h2>
              <p className="text-muted-foreground">The most popular destinations right now.</p>
            </div>
            <Button variant="ghost" className="gap-2 hidden md:flex">View all <ArrowRight className="w-4 h-4" /></Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {trendingDestinations.map((dest, i) => (
              <Link href="/trips/create" key={i}>
                <Card className="group overflow-hidden border-border bg-card hover:border-primary/50 transition-all cursor-pointer h-[350px] relative">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${dest.image})` }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
                  
                  <CardContent className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <Badge variant="secondary" className="mb-3 backdrop-blur-md bg-secondary/50 border-none text-xs">{dest.category}</Badge>
                        <h3 className="text-2xl font-bold text-foreground mb-1">{dest.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> Destination
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-background/80 backdrop-blur-md px-2 py-1 rounded-lg text-sm font-bold">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {dest.rating}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Template */}
        <section className="bg-secondary/50 rounded-3xl p-8 md:p-12 border border-border flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/10">Featured Template</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">The Ultimate Euro Trip</h2>
            <p className="text-lg text-muted-foreground">A perfectly balanced 14-day itinerary through Paris, the Swiss Alps, and Northern Italy. Optimized for train travel.</p>
            <Button size="lg" className="rounded-full gap-2 mt-4">
              Use this template <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 w-full relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden border border-border shadow-2xl">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"></div>
          </div>
        </section>

      </div>
    </div>
  );
}
