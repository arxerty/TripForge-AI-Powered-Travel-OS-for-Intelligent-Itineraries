"use client";

import dynamic from "next/dynamic";

const TripMap = dynamic(() => import("./TripMap"), { 
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-secondary/50">
      <div className="animate-pulse w-10 h-10 rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
});

export default TripMap;
