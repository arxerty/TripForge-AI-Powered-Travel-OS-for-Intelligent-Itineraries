"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { AuthNotice, AuthShell } from "@/components/auth/AuthShell";
import { useI18n } from "@/lib/i18n/context";

const fieldClass =
  "w-full bg-transparent text-[17px] outline-none placeholder:text-tertiary-foreground py-1";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error(t("authInvalid"));
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("authInvalid"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title={t("login")}
      subtitle={t("loginSubtitle")}
      footer={<>{t("noAccount")} <Link href="/register" className="text-primary hover:underline">{t("register")}</Link></>}
    >
      {registered && <AuthNotice tone="success">{t("accountCreated")}</AuthNotice>}
      {error && <AuthNotice tone="error">{error}</AuthNotice>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grouped">
          <label className="grouped-row">
            <span className="sr-only">{t("email")}</span>
            <input type="email" autoComplete="email" placeholder={t("email")} className={fieldClass} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="grouped-row">
            <span className="sr-only">{t("password")}</span>
            <input type="password" autoComplete="current-password" placeholder={t("password")} className={fieldClass} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
        </div>

        <Button type="submit" size="lg" className="w-full h-12 text-[17px]" disabled={isLoading}>
          {isLoading ? t("signingIn") : t("login")}
        </Button>
      </form>

      <div className="flex items-center gap-3 my-6 text-[13px] text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> {t("orContinueWith")} <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full h-12 text-[17px] shadow-card border-transparent"
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      >
        Google
      </Button>
    </AuthShell>
  );
}
