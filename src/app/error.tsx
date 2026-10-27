"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-center">
      <div className="size-20 rounded-[22px] bg-sys-orange/15 flex items-center justify-center mb-6">
        <AlertTriangle className="w-9 h-9 text-sys-orange" />
      </div>

      <h1 className="text-[34px] font-bold mb-2">{t("errorTitle")}</h1>
      <p className="text-muted-foreground text-[17px] mb-8 max-w-sm">{t("errorText")}</p>

      <div className="flex gap-3">
        <Button size="lg" onClick={() => reset()}>{t("tryAgain")}</Button>
        <Link href="/" className={buttonVariants({ size: "lg", variant: "tinted" })}>{t("goHome")}</Link>
      </div>
    </div>
  );
}
