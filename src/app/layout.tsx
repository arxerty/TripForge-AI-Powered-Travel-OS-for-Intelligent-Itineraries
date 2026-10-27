import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { getServerLanguage } from "@/lib/i18n/server";
import { THEME_COOKIE, type Theme } from "@/lib/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TripForge | AI Travel Planner",
  description: "Turn your travel preferences into intelligent, interactive itineraries. TripForge is a premium AI-powered travel planning platform.",
  keywords: ["travel", "AI travel planner", "itinerary generator", "vacation planning", "TripForge"],
  openGraph: {
    title: "TripForge | AI Travel Planner",
    description: "Generate intelligent, interactive itineraries instantly.",
    type: "website",
    locale: "en_US",
    siteName: "TripForge",
  },
  twitter: {
    card: "summary_large_image",
    title: "TripForge | AI Travel Planner",
    description: "Generate intelligent, interactive itineraries instantly.",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [language, cookieStore] = await Promise.all([getServerLanguage(), cookies()]);
  const theme: Theme = cookieStore.get(THEME_COOKIE)?.value === "light" ? "light" : "dark";

  return (
    <html
      lang={language}
      className={`${geistSans.variable} ${geistMono.variable} ${theme} h-full antialiased`}
      style={{ colorScheme: theme }}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider initialLanguage={language}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
