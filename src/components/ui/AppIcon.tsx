import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";

/** The TripForge mark, drawn as an app icon (squircle with a soft blue gradient). */
export function AppIcon({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center text-white bg-gradient-to-b from-[#3d9bff] to-[#0062e0] shadow-[inset_0_0.5px_0_rgb(255_255_255/0.4),0_1px_2px_rgb(0_0_0/0.2)]",
        className
      )}
      style={{ width: size, height: size, borderRadius: size * 0.2237 }}
      aria-hidden
    >
      <Compass style={{ width: size * 0.6, height: size * 0.6 }} strokeWidth={2.2} />
    </span>
  );
}
