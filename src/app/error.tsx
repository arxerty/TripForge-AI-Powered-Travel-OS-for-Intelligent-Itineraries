"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-center">
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-destructive" />
      </div>
      
      <h1 className="text-4xl font-bold tracking-tight mb-4">Oops! Something went wrong.</h1>
      <p className="text-muted-foreground text-lg mb-8 max-w-md">
        We encountered an unexpected error. Our team has been notified, but you can try refreshing the page.
      </p>
      
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="gap-2 rounded-full px-6">
          <RefreshCcw className="w-4 h-4" /> Try again
        </Button>
        <Link href="/">
          <Button variant="outline" className="gap-2 rounded-full px-6">
            <Home className="w-4 h-4" /> Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
