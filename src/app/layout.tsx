import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";

// SF Pro is used on Apple devices; Inter is the closest open substitute elsewhere.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});
import { I18nProvider } from "@/lib/i18n/context";
import { getServerLanguage } from "@/lib/i18n/server";
import { THEME_COOKIE, type Theme } from "@/lib/theme";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

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
      className={`${inter.variable} ${theme} h-full antialiased`}
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
