import { ReactNode } from "react";
import type { Metadata, Viewport } from "next";

import { Vazirmatn } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/query-provider";
import { getPreference } from "@/server/server-actions";
import { NotificationsStoreProvider } from "@/stores/notifications/notifications-provider";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";
import { THEME_MODE_VALUES, THEME_PRESET_VALUES, type ThemeMode, type ThemePreset } from "@/types/preferences/theme";

import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["latin", "arabic"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "Studio Admin",
  description: "پنل مدیریت استودیو",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Studio Admin"
  },
  formatDetection: {
    telephone: false
  }
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover"
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const themeMode = await getPreference<ThemeMode>("theme_mode", THEME_MODE_VALUES, "light");
  const themePreset = await getPreference<ThemePreset>("theme_preset", THEME_PRESET_VALUES, "default");

  return (
    <html
      lang="fa"
      dir="rtl"
      className={themeMode === "dark" ? "dark" : ""}
      data-theme-preset={themePreset}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className={`${vazirmatn.className} min-h-screen antialiased`}>
        <QueryProvider>
          <PreferencesStoreProvider themeMode={themeMode} themePreset={themePreset}>
            <NotificationsStoreProvider>
              {children}
              <Toaster />
            </NotificationsStoreProvider>
          </PreferencesStoreProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
