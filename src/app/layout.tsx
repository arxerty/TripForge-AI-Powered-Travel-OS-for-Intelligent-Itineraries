import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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

import { I18nProvider } from "@/lib/i18n/context";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
