import Link from "next/link";
import { MapPinOff } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getServerT } from "@/lib/i18n/server";

export default async function NotFoundPage() {
  const t = await getServerT();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-center">
      <div className="size-20 rounded-[22px] bg-secondary flex items-center justify-center mb-6">
        <MapPinOff className="w-9 h-9 text-muted-foreground" />
      </div>
      <h1 className="text-[34px] font-bold mb-2">{t("notFoundTitle")}</h1>
      <p className="text-muted-foreground text-[17px] mb-8 max-w-sm">{t("notFoundText")}</p>
      <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
        {t("backToDashboard")}
      </Link>
    </div>
  );
}
