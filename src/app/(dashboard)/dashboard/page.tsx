import Link from "next/link";
import { Plus, Map, Navigation, Calendar, Clock, ArrowRight, Compass, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex-1 overflow-auto p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Welcome Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Good evening, Explorer</h1>
            <p className="text-muted-foreground text-lg">Where are we going next?</p>
          </div>
          <Link href="/trips/create">
            <Button size="lg" className="rounded-full gap-2">
              <Plus className="w-5 h-5" /> Create new trip
            </Button>
          </Link>
        </header>

        {/* Active Trip (Mock) */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Active Trip</h2>
          <Card className="border-border bg-card overflow-hidden">
            <div className="grid md:grid-cols-3 gap-0">
              <div className="md:col-span-1 bg-secondary h-48 md:h-auto relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"></div>
              </div>
              <div className="md:col-span-2 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold">10 Days in Japan</h3>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">In 14 days</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Tokyo, Kyoto, Osaka</p>
                  
                  <div className="flex gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Oct 12 - Oct 22</div>
                    <div className="flex items-center gap-1.5"><Navigation className="w-4 h-4" /> 3 Cities</div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button variant="secondary" className="gap-2">
                    View Itinerary <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Recent Trips */}
          <section className="col-span-2">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-xl font-semibold">Recent Trips</h2>
              <Button variant="link" className="text-muted-foreground hover:text-foreground">View all</Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Weekend in Rome", date: "Aug 2026", img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=500&q=80" },
                { title: "Bali Escape", date: "May 2026", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&q=80" }
              ].map((trip, i) => (
                <Card key={i} className="overflow-hidden border-border bg-card hover:border-border/80 transition-colors group cursor-pointer">
                  <div className="h-32 bg-secondary relative overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${trip.img})` }}></div>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">{trip.title}</CardTitle>
                    <CardDescription>{trip.date}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <Card className="border-border bg-card">
              <CardContent className="p-4 flex flex-col gap-2">
                <Link href="/explore">
                  <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                    <Compass className="w-5 h-5 text-muted-foreground" /> Explore destinations
                  </Button>
                </Link>
                <Link href="/saved">
                  <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                    <Heart className="w-5 h-5 text-muted-foreground" /> Saved places
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                  <Map className="w-5 h-5 text-muted-foreground" /> Trip templates
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
