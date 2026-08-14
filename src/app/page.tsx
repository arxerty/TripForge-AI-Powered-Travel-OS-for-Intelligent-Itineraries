import Link from "next/link";
import { ArrowRight, Map, Compass, Wallet, CloudSun, Clock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="fixed top-0 w-full border-b border-border/40 bg-background/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">TripForge</span>
          </div>
          <nav className="hidden md:flex gap-6 items-center text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">How it works</Link>
            <Link href="/explore" className="hover:text-primary transition-colors">Explore</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Log in
            </Link>
            <Link 
              href="/dashboard" 
              className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Start Planning
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800/20 via-background to-background"></div>
          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
              PLAN LESS.<br />
              <span className="text-muted-foreground">TRAVEL BETTER.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Create intelligent travel itineraries tailored to your time, budget and travel style. 
              The premium AI-powered travel planner for modern explorers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/dashboard"
                className="bg-primary text-primary-foreground h-12 px-8 rounded-full flex items-center justify-center gap-2 font-medium hover:opacity-90 transition-all w-full sm:w-auto"
              >
                Create a trip <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/explore"
                className="bg-secondary text-secondary-foreground border border-border h-12 px-8 rounded-full flex items-center justify-center font-medium hover:bg-secondary/80 transition-all w-full sm:w-auto"
              >
                Explore
              </Link>
            </div>
          </div>
          
          {/* Map/Hero Visual Placeholder */}
          <div className="mt-20 container mx-auto px-4">
            <div className="aspect-[21/9] md:aspect-[21/7] rounded-3xl overflow-hidden border border-border relative bg-card shadow-2xl flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
              <div className="flex items-center gap-3 text-muted-foreground relative z-10">
                <Map className="w-8 h-8 opacity-50" />
                <span className="text-xl font-medium opacity-50">Interactive Map Experience</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Travel intelligence at your fingertips</h2>
              <p className="text-muted-foreground">TripForge handles the logistics so you can focus on the experience. From smart routing to real-time budget tracking.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-card border border-border hover:border-border/80 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Map className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Routing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Optimized travel paths with Mapbox integration. See walking distances, transit times, and make the most of every day.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-card border border-border hover:border-border/80 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Budget Management</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Real-time expense tracking. Know exactly how much you've spent on flights, hotels, and food, and what's left.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-card border border-border hover:border-border/80 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <CloudSun className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Weather-Aware</h3>
                <p className="text-muted-foreground leading-relaxed">
                  It's raining tomorrow? The AI assistant can automatically rearrange your itinerary to prioritize indoor activities.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Compass className="w-5 h-5" />
            <span className="font-semibold">TripForge</span>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} TripForge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
