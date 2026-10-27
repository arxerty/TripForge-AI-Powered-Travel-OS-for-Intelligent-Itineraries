"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Layers } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export interface MarkerData {
  id: string;
  longitude: number;
  latitude: number;
  title?: string;
  category?: string;
  /** Number shown inside the pin (e.g. order within the day). */
  label?: string;
}

export type MapProvider = "mapbox" | "apple";

interface TripMapProps {
  markers?: MarkerData[];
  interactive?: boolean;
  provider?: MapProvider;
  focusId?: string | null;
  onMarkerClick?: (id: string) => void;
}

// Mapbox style vs Apple Maps inspired style
const MAP_STYLES = {
  mapbox: "mapbox://styles/mapbox/dark-v11",
  apple: "mapbox://styles/mapbox/navigation-night-v1", // Apple Maps dark mode vector aesthetic
};

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export default function TripMap(props: TripMapProps) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  return token ? <MapboxMap {...props} token={token} /> : <OsmFallbackMap {...props} />;
}

function MapboxMap({ markers = [], interactive = true, provider = "mapbox", focusId, onMarkerClick, token }: TripMapProps & { token: string }) {
  const { t } = useI18n();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRefs = useRef(new Map<string, mapboxgl.Marker>());
  const [currentProvider, setCurrentProvider] = useState<MapProvider>(provider);

  useEffect(() => {
    if (!mapContainer.current) return;
    mapboxgl.accessToken = token;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAP_STYLES[provider],
      center: markers[0] ? [markers[0].longitude, markers[0].latitude] : [0, 20],
      zoom: markers[0] ? 12 : 1.5,
      interactive,
    });
    if (interactive) map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    return () => {
      map.current?.remove();
      map.current = null;
    };
    // The map is created once; style/markers are synced by the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, interactive]);

  useEffect(() => {
    map.current?.setStyle(MAP_STYLES[currentProvider]);
  }, [currentProvider]);

  // Sync markers and frame them.
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    markerRefs.current.forEach((marker) => marker.remove());
    markerRefs.current.clear();

    markers.forEach((marker) => {
      const el = document.createElement("button");
      el.type = "button";
      el.textContent = marker.label ?? "";
      el.setAttribute("aria-label", marker.title ?? "");
      el.className =
        currentProvider === "apple"
          ? "size-7 rounded-full bg-sys-red text-white text-xs font-bold border-2 border-white shadow-lg cursor-pointer"
          : "size-7 rounded-full bg-primary text-primary-foreground text-xs font-bold border-2 border-white shadow-lg cursor-pointer";
      el.addEventListener("click", () => onMarkerClick?.(marker.id));

      const mk = new mapboxgl.Marker({ element: el })
        .setLngLat([marker.longitude, marker.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 18 }).setHTML(`<strong style="color:#111">${escapeHtml(marker.title ?? "")}</strong>`))
        .addTo(m);
      markerRefs.current.set(marker.id, mk);
    });

    if (markers.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      markers.forEach((mk) => bounds.extend([mk.longitude, mk.latitude]));
      m.fitBounds(bounds, { padding: 80, maxZoom: 15, duration: 600 });
    } else if (markers.length === 1) {
      m.flyTo({ center: [markers[0].longitude, markers[0].latitude], zoom: 14 });
    }
  }, [markers, currentProvider, onMarkerClick]);

  useEffect(() => {
    const m = map.current;
    const target = focusId ? markerRefs.current.get(focusId) : undefined;
    if (!m || !target) return;
    m.flyTo({ center: target.getLngLat(), zoom: Math.max(m.getZoom(), 14), duration: 600 });
    markerRefs.current.forEach((mk) => mk.getPopup()?.remove());
    target.togglePopup();
  }, [focusId]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

      {/* Map Provider Selector Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1 material-thick p-0.5 rounded-[9px] shadow-float" role="radiogroup" aria-label={t("mapProvider")}>
        <Layers className="w-3.5 h-3.5 text-muted-foreground mx-2" aria-hidden />
        {(["mapbox", "apple"] as const).map((p) => (
          <button
            key={p}
            role="radio"
            aria-checked={currentProvider === p}
            onClick={() => setCurrentProvider(p)}
            className={`h-7 px-3 text-[12px] font-semibold rounded-[7px] transition-all ${
              currentProvider === p ? "bg-segment text-foreground shadow-[0_3px_8px_rgb(0_0_0/0.12)]" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {p === "apple" ? t("appleMaps") : t("mapbox")}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Token-free fallback: an OpenStreetMap embed framed around the markers. */
function OsmFallbackMap({ markers = [], focusId }: TripMapProps) {
  const { t } = useI18n();
  if (markers.length === 0) {
    return <div className="absolute inset-0 bg-secondary" />;
  }

  const focus = markers.find((m) => m.id === focusId);
  const pts = focus ? [focus] : markers;
  const lats = pts.map((m) => m.latitude);
  const lngs = pts.map((m) => m.longitude);
  const pad = focus ? 0.006 : 0.01;
  const bbox = [Math.min(...lngs) - pad, Math.min(...lats) - pad, Math.max(...lngs) + pad, Math.max(...lats) + pad].join(",");
  const pin = focus ?? markers[0];
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${pin.latitude},${pin.longitude}`;

  return (
    <div className="absolute inset-0">
      <iframe key={src} title={t("mapTitle")} src={src} className="w-full h-full border-0" />
      <div className="hidden md:block absolute top-3 left-3 max-w-[calc(100%-4rem)] rounded-lg material-thick px-2.5 py-1 text-[11px] text-muted-foreground shadow-float">
        {t("mapFallbackNote")}
      </div>
    </div>
  );
}
