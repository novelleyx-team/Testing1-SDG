"use client";

import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalNotification } from "@/components/ui/global-notification";
import { GlobalChatbot } from "@/components/ui/chatbot";
import { MaintenanceLock } from "@/components/MaintenanceLock";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 dark:bg-[#0B1120] text-gray-900 dark:text-gray-100 transition-colors duration-0`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MaintenanceLock>
            {children}
            <GlobalNotification />
            <GlobalChatbot />
          </MaintenanceLock>
        </ThemeProvider>
      </body>
    </html>
  );
}
