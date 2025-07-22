// App.tsx
import React, { useState, useEffect } from "react";
import ReminderPage from "./pages/ReminderPage";
import ThemePage from "./pages/ThemePage";
import BannerPage from "./pages/BannerPage";

const themes = [
  { id: "dark", name: "Dark", color: "#222" },
  { id: "light", name: "Light", color: "#39ff14" },
  { id: "pink", name: "Soft Pink", color: "#ec4899" },
  { id: "yellow", name: "Soft Yellow", color: "#facc15" },
  {
    id: "pride",
    name: "Pride",
    color: "linear-gradient(90deg, red, orange, yellow, green, blue, purple)",
  },
  {
    id: "rose",
    name: "Rose",
    color:
      "linear-gradient(90deg, #d52d00, #ef7627, #ff9a56, #ffffff, #d362a4, #a30262)",
  },
  { id: "custom", name: "Custom", color: "#0ff" },
];

const bannerOptions = [
  { name: "Default", src: chrome.runtime.getURL("banner.jpg") },
  { name: "Banner 1", src: chrome.runtime.getURL("banner1.png") },
  { name: "Banner 2", src: chrome.runtime.getURL("banner2.jpg") },
  { name: "Banner 3", src: chrome.runtime.getURL("banner3.jpg") },
  { name: "Banner 4", src: chrome.runtime.getURL("banner4.jpeg") },
];

const themeColors: Record<string, string> = {
  dark: "#222",
  light: "#39ff14",
  pink: "#ec4899",
  yellow: "#facc15",
  pride: "linear-gradient(90deg, red, orange, yellow, green, blue, purple)",
  rose: "linear-gradient(90deg, #d52d00, #ef7627, #ff9a56, #ffffff, #d362a4, #a30262)",
  custom: "#0ff",
};

const isGradient = (color: string) => color.startsWith("linear-gradient");

const App: React.FC = () => {
  const [page, setPage] = useState<"reminder" | "theme" | "banner">("reminder");
  const [theme, setTheme] = useState(themes[0].id);
  const [selectedBanner, setSelectedBanner] = useState(bannerOptions[0].src);
  const [multiSelectedBanners, setMultiSelectedBanners] = useState<string[]>(
    []
  );
  const primaryColor = themeColors[theme] || "#39ff14";
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000 * 10); // update every 10s for smoothness
    return () => clearInterval(interval);
  }, []);
  const timeStr = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = now.toLocaleDateString([], {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  // Helper for button/tab style
  const getPrimaryStyle = () =>
    isGradient(primaryColor)
      ? { backgroundImage: primaryColor, color: "#fff", border: "none" }
      : { background: primaryColor, color: "#fff", border: "none" };

  return (
    <div className="p-4" style={{ height: 800 }} data-theme={theme}>
      <div className="mb-2 text-center w-full">
        <div
          className="text-5xl font-mono font-bold"
          style={{ letterSpacing: 2 }}
        >
          {timeStr}
        </div>
        <div className="text-sm text-gray-500">{dateStr}</div>
      </div>
      <nav className="flex gap-2 mb-4">
        <button
          className={`px-2 py-1 rounded ${
            page === "reminder" ? "active-tab" : ""
          }`}
          style={page === "reminder" ? getPrimaryStyle() : {}}
          onClick={() => setPage("reminder")}
        >
          Reminder
        </button>
        <button
          className={`px-2 py-1 rounded ${
            page === "theme" ? "active-tab" : ""
          }`}
          style={page === "theme" ? getPrimaryStyle() : {}}
          onClick={() => setPage("theme")}
        >
          Theme
        </button>
        <button
          className={`px-2 py-1 rounded ${
            page === "banner" ? "active-tab" : ""
          }`}
          style={page === "banner" ? getPrimaryStyle() : {}}
          onClick={() => setPage("banner")}
        >
          Banner
        </button>
      </nav>
      {page === "reminder" && (
        <ReminderPage
          primaryColor={primaryColor}
          isGradient={isGradient(primaryColor)}
        />
      )}
      {page === "theme" && (
        <ThemePage themes={themes} theme={theme} setTheme={setTheme} />
      )}
      {page === "banner" && (
        <BannerPage
          bannerOptions={bannerOptions}
          selectedBanner={selectedBanner}
          setSelectedBanner={setSelectedBanner}
          multiSelectedBanners={multiSelectedBanners}
          setMultiSelectedBanners={setMultiSelectedBanners}
          primaryColor={primaryColor}
          isGradient={isGradient(primaryColor)}
        />
      )}
    </div>
  );
};

export default App;
