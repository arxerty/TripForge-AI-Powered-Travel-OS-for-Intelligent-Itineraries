"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, MapPin, Calendar as CalendarIcon, Wallet, Activity, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  { id: "destination", title: "Destination", icon: MapPin },
  { id: "dates", title: "Dates", icon: CalendarIcon },
  { id: "budget", title: "Budget", icon: Wallet },
  { id: "style", title: "Travel Style", icon: Activity },
  { id: "interests", title: "Interests", icon: Heart },
  { id: "generate", title: "Generate", icon: Sparkles },
];

export default function CreateTripPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState([2500]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation process
    setTimeout(() => {
      window.location.href = "/trips/mock-id"; // Redirect to trip page later
    }, 4000);
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  if (isGenerating) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <Sparkles className="w-16 h-16 text-primary animate-pulse mb-8" />
        <h2 className="text-3xl font-bold mb-4">Crafting your perfect trip...</h2>
        <div className="space-y-3 text-muted-foreground text-lg max-w-sm w-full text-left mx-auto">
          <p className="flex items-center gap-3"><span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">✓</span> Understanding preferences</p>
          <p className="flex items-center gap-3 animate-pulse"><span className="w-5 h-5 rounded-full border border-primary text-transparent flex items-center justify-center text-xs">●</span> Optimizing itinerary</p>
          <p className="flex items-center gap-3 opacity-50"><span className="w-5 h-5 rounded-full border border-border flex items-center justify-center text-xs"></span> Calculating routes</p>
          <p className="flex items-center gap-3 opacity-50"><span className="w-5 h-5 rounded-full border border-border flex items-center justify-center text-xs"></span> Balancing budget</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center p-6 md:p-10">
      <div className="w-full max-w-3xl">
        
        {/* Progress header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold tracking-tight">{steps[currentStep].title}</h1>
            <span className="text-sm font-medium text-muted-foreground">Step {currentStep + 1} of {steps.length}</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out" 
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="min-h-[400px]">
          
          {currentStep === 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-bold tracking-tighter mb-2">Where are you going?</h2>
              <p className="text-lg text-muted-foreground mb-8">Enter a country, city, or multiple destinations.</p>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="destination" 
                    placeholder="e.g. Tokyo, Japan" 
                    className="pl-10 h-12 text-lg bg-card"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-bold tracking-tighter mb-2">When are you traveling?</h2>
              <p className="text-lg text-muted-foreground mb-8">Select your dates to help us calculate durations.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" className="h-12 bg-card" />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" className="h-12 bg-card" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-bold tracking-tighter mb-2">What is your budget?</h2>
              <p className="text-lg text-muted-foreground mb-8">This helps us recommend the right hotels, restaurants, and activities.</p>
              <div className="space-y-8 mt-12">
                <div className="flex justify-between items-end">
                  <Label className="text-lg">Total Budget (EUR)</Label>
                  <span className="text-3xl font-bold">€{budget[0]}</span>
                </div>
                <Slider 
                  defaultValue={[2500]} 
                  max={10000} 
                  step={100}
                  onValueChange={(val) => setBudget(val as number[])}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>€500</span>
                  <span>€10,000+</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-bold tracking-tighter mb-2">Your travel style</h2>
              <p className="text-lg text-muted-foreground mb-8">Tune the vibe of your trip.</p>
              
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Relaxed</span>
                    <span>Adventure</span>
                  </div>
                  <Slider defaultValue={[50]} max={100} step={10} />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Budget</span>
                    <span>Luxury</span>
                  </div>
                  <Slider defaultValue={[50]} max={100} step={10} />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Nature</span>
                    <span>City</span>
                  </div>
                  <Slider defaultValue={[50]} max={100} step={10} />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-bold tracking-tighter mb-2">What do you love?</h2>
              <p className="text-lg text-muted-foreground mb-8">Select your interests to personalize recommendations.</p>
              
              <div className="flex flex-wrap gap-3">
                {["Food", "Nature", "Architecture", "History", "Art", "Nightlife", "Shopping", "Photography", "Anime", "Technology", "Beaches", "Sports"].map((interest) => (
                  <Badge 
                    key={interest}
                    variant={selectedInterests.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer text-sm py-2 px-4 rounded-full transition-all"
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-bold tracking-tighter mb-2">Ready to forge?</h2>
              <p className="text-lg text-muted-foreground mb-8">Review your inputs and let AI plan your perfect trip.</p>
              
              <Card className="bg-card border-border">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Destination</span>
                    <span className="font-medium">{destination || "Tokyo, Japan"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium">€{budget[0]}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Interests</span>
                    <span className="font-medium text-right">{selectedInterests.length > 0 ? selectedInterests.join(", ") : "Balanced mix"}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-12 pt-6 border-t border-border">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          
          <Button 
            onClick={handleNext}
            className="gap-2 px-8 rounded-full"
            disabled={currentStep === 0 && !destination}
          >
            {currentStep === steps.length - 1 ? (
              <>Generate Trip <Sparkles className="w-4 h-4" /></>
            ) : (
              <>Continue <ArrowRight className="w-4 h-4" /></>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
