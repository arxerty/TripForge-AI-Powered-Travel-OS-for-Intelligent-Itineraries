"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthNotice, AuthShell } from "@/components/auth/AuthShell";
import { useI18n } from "@/lib/i18n/context";

const fieldClass =
  "w-full bg-transparent text-[17px] outline-none placeholder:text-tertiary-foreground py-1";

export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("passwordsMismatch"));
      return;
    }

    if (password.length < 6) {
      setError(t("passwordTooShort"));
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t("registerFailed"));
      }

      // Registration successful -> navigate to login
      router.push("/login?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("registerFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title={t("register")}
      subtitle={t("registerSubtitle")}
      footer={<>{t("haveAccount")} <Link href="/login" className="text-primary hover:underline">{t("login")}</Link></>}
    >
      {error && <AuthNotice tone="error">{error}</AuthNotice>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grouped">
          <label className="grouped-row">
            <span className="sr-only">{t("fullName")}</span>
            <input type="text" autoComplete="name" placeholder={t("fullName")} className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label className="grouped-row">
            <span className="sr-only">{t("email")}</span>
            <input type="email" autoComplete="email" placeholder={t("email")} className={fieldClass} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
        </div>

        <div className="grouped">
          <label className="grouped-row">
            <span className="sr-only">{t("password")}</span>
            <input type="password" autoComplete="new-password" placeholder={t("password")} className={fieldClass} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <label className="grouped-row">
            <span className="sr-only">{t("confirmPassword")}</span>
            <input type="password" autoComplete="new-password" placeholder={t("confirmPassword")} className={fieldClass} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </label>
        </div>
        <p className="px-4 -mt-3 text-[13px] text-muted-foreground">{t("passwordHint")}</p>

        <Button type="submit" size="lg" className="w-full h-12 text-[17px]" disabled={isLoading}>
          {isLoading ? t("creatingAccount") : t("register")}
        </Button>
      </form>
    </AuthShell>
  );
}
