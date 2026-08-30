"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useThemeStore } from "@/store/theme-store";
import { useTheme } from "next-themes";

export function ThemeSync() {
  const { user } = useAuthStore();
  const { getPreferences } = useThemeStore();
  const { setTheme } = useTheme();

  useEffect(() => {
    if (user) {
      const prefs = getPreferences(user.id);
      
      // Sync dark mode
      setTheme(prefs.mode);
      
      // Sync accent color via CSS variable
      document.documentElement.style.setProperty("--accent-brand", prefs.accentColor);
    } else {
      // Revert to defaults if no user is logged in
      setTheme('light');
      document.documentElement.style.setProperty("--accent-brand", "#2563EB");
    }
  }, [user, getPreferences, setTheme]);

  return null;
}
