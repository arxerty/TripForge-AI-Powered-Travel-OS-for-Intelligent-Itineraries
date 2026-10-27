import Link from "next/link";
import { Map, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function EmptyTrips({ title, text, cta }: { title: string; text: string; cta: string }) {
  return (
    <div className="rounded-3xl bg-card shadow-card px-6 py-14 md:py-20 text-center flex flex-col items-center">
      <div className="size-16 rounded-[18px] bg-primary/10 text-primary flex items-center justify-center mb-5">
        <Map className="w-8 h-8" />
      </div>
      <h2 className="text-[22px] font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md mb-7 text-[15px]">{text}</p>
      <Link href="/trips/create" className={buttonVariants({ size: "lg" })}>
        <Plus className="w-4 h-4" strokeWidth={2.5} /> {cta}
      </Link>
    </div>
  );
}
