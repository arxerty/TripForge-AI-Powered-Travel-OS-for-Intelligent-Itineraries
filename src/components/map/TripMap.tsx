"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, Layers, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export interface MarkerData {
  id: string;
  longitude: number;
  latitude: number;
  title?: string;
  category?: string;
}

export type MapProvider = "mapbox" | "apple";

interface TripMapProps {
  markers?: MarkerData[];
  interactive?: boolean;
  provider?: MapProvider;
}

export default function TripMap({ markers = [], interactive = true, provider = "mapbox" }: TripMapProps) {
  const { t } = useI18n();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [tokenMissing, setTokenMissing] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<MapProvider>(provider);

  // Mapbox style vs Apple Maps inspired style
  const MAP_STYLES = {
    mapbox: "mapbox://styles/mapbox/dark-v11",
    apple: "mapbox://styles/mapbox/navigation-night-v1", // Apple Maps dark mode vector aesthetic
  };

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    
    if (!token) {
      setTokenMissing(true);
      return;
    }

    mapboxgl.accessToken = token;

    if (!mapContainer.current) return;

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAP_STYLES[currentProvider],
        center: [139.7670, 35.6812], // Tokyo default
        zoom: 11,
        interactive: interactive,
      });

      if (interactive) {
        map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
      }
    } else {
      map.current.setStyle(MAP_STYLES[currentProvider]);
    }
  }, [currentProvider, interactive]);

  // Update markers
  useEffect(() => {
    if (!map.current || tokenMissing) return;

    markers.forEach((marker) => {
      const el = document.createElement("div");
      el.className = currentProvider === "apple"
        ? "w-5 h-5 bg-sky-500 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.8)] border-2 border-white cursor-pointer"
        : "w-4 h-4 bg-primary rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] border border-background cursor-pointer";

      new mapboxgl.Marker(el)
        .setLngLat([marker.longitude, marker.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3 class="font-bold text-foreground text-sm">${marker.title}</h3>`
          )
        )
        .addTo(map.current!);
    });
  }, [markers, tokenMissing, currentProvider]);

  if (tokenMissing) {
    return (
      <div className="absolute inset-0 flex items-center justify-center flex-col text-muted-foreground bg-secondary/50 p-6">
        <MapPin className="w-16 h-16 opacity-20 mb-4" />
        <p className="text-xl font-medium opacity-50">Map Token Missing</p>
        <p className="text-sm mt-2 max-w-sm text-center">
          Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN or APPLE_MAPKIT_KEY to enable maps.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

      {/* Map Provider Selector Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-card/80 backdrop-blur-md p-1.5 rounded-full border border-border/80 shadow-xl">
        <div className="px-2.5 py-1 text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-primary" />
          <span className="hidden sm:inline">{t("mapProvider")}:</span>
        </div>
        <button
          onClick={() => setCurrentProvider("mapbox")}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-all flex items-center gap-1 ${
            currentProvider === "mapbox"
              ? "bg-primary text-primary-foreground font-bold shadow-md"
              : "hover:bg-secondary text-muted-foreground"
          }`}
        >
          {currentProvider === "mapbox" && <Check className="w-3 h-3" />}
          Mapbox
        </button>
        <button
          onClick={() => setCurrentProvider("apple")}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-all flex items-center gap-1 ${
            currentProvider === "apple"
              ? "bg-sky-500 text-white font-bold shadow-md"
              : "hover:bg-secondary text-muted-foreground"
          }`}
        >
          {currentProvider === "apple" && <Check className="w-3 h-3" />}
          Apple Maps
        </button>
      </div>
    </div>
  );
}
