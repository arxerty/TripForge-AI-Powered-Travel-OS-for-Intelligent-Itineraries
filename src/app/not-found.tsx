import Link from "next/link";
import { Map, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-center relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      
      <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mb-8 border border-border">
        <Map className="w-10 h-10 text-muted-foreground" />
      </div>
      
      <h1 className="text-6xl font-black tracking-tighter mb-4 text-foreground">404</h1>
      <h2 className="text-2xl font-bold tracking-tight mb-4">You've ventured off the map.</h2>
      
      <p className="text-muted-foreground text-lg mb-10 max-w-md">
        The destination you are looking for doesn't exist or has been moved. Let's get you back on course.
      </p>
      
      <Link href="/dashboard">
        <Button size="lg" className="gap-2 rounded-full px-8">
          Return to Dashboard <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
}
