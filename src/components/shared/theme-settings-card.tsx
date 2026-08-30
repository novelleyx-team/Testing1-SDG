"use client";

import { Card } from "@/components/ui/card";
import { Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/auth-store";
import { useThemeStore, ACCENT_COLORS, type AccentColor } from "@/store/theme-store";
import { useState, useEffect } from "react";

export function ThemeSettingsCard() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuthStore();
  const { getPreferences, setMode, setAccentColor } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  const prefs = getPreferences(user.id);
  const isDark = theme === "dark";

  const handleModeToggle = () => {
    const newMode = isDark ? "light" : "dark";
    setTheme(newMode);
    setMode(user.id, newMode);
  };

  const handleAccentChange = (color: AccentColor) => {
    setAccentColor(user.id, color);
    document.documentElement.style.setProperty("--accent-brand", color);
  };

  return (
    <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1F2937] overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800/50">
        <Palette className="text-gray-500 dark:text-gray-400" size={20} />
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
          Appearance & Theme
        </h3>
      </div>
      <div className="p-6 space-y-8">
        {/* Dark / Light Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDark ? (
              <Moon className="text-blue-400" size={20} />
            ) : (
              <Sun className="text-amber-500" size={20} />
            )}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100">
                {isDark ? "Dark Mode" : "Light Mode"}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Toggle the platform&apos;s visual theme.
              </p>
            </div>
          </div>
          <button
            onClick={handleModeToggle}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              isDark ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <div
              className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                isDark ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </button>
        </div>

        {/* Accent Color Picker */}
        <div>
          <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
            Accent Color
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Choose a brand accent from the approved palette.
          </p>
          <div className="flex flex-wrap gap-3">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => handleAccentChange(color.value)}
                className={`w-10 h-10 rounded-xl transition-all ${
                  prefs.accentColor === color.value
                    ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#1F2937] scale-110 shadow-lg"
                    : "hover:scale-105"
                }`}
                style={{
                  backgroundColor: color.value,
                  ...(prefs.accentColor === color.value
                    ? { boxShadow: `0 0 12px ${color.value}40`, ringColor: color.value }
                    : {}),
                }}
                title={color.name}
              >
                {prefs.accentColor === color.value && (
                  <svg className="w-5 h-5 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
