import Link from "next/link";
import { Map, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function EmptyTrips({ title, text, cta }: { title: string; text: string; cta: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-10 md:p-16 text-center flex flex-col items-center">
      <div className="size-14 rounded-2xl bg-accent text-primary flex items-center justify-center mb-5">
        <Map className="w-7 h-7" />
      </div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md mb-6">{text}</p>
      <Link href="/trips/create" className={buttonVariants({ size: "lg", className: "rounded-full gap-2 h-11 px-5" })}>
        <Plus className="w-5 h-5" /> {cta}
      </Link>
    </div>
  );
}
