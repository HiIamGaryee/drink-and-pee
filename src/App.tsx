import { useCallback, useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { IconSettings } from "@tabler/icons-react";

type ButtonProps = {
  label: string;
  onClick: () => void;
  className?: string;
};

const Button = ({ label, onClick, className }: ButtonProps) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 ${
      className || ""
    }`}
  >
    {label}
  </button>
);

type Theme = {
  name: string;
  key: string;
  color: string;
  custom?: boolean;
};

const baseThemes: Theme[] = [
  { name: "Dark Mode", key: "dark", color: "bg-gray-900 text-white" },
  { name: "Light Mode", key: "light", color: "bg-white text-gray-900 border" },
  { name: "Soft Pink", key: "soft-pink", color: "bg-pink-200 text-pink-900" },
  {
    name: "Soft Yellow",
    key: "soft-yellow",
    color: "bg-yellow-100 text-yellow-900",
  },
  {
    name: "Pride",
    key: "pride",
    color:
      "bg-gradient-to-r from-red-500 via-yellow-400 via-green-400 via-blue-500 to-purple-600 text-white",
  },
];

const bannerOptions = [
  { name: "Default", src: chrome.runtime.getURL("banner.jpg") },
  { name: "Banner 1", src: chrome.runtime.getURL("banner1.png") },
  { name: "Banner 2", src: chrome.runtime.getURL("banner2.jpg") },
  { name: "Banner 3", src: chrome.runtime.getURL("banner3.jpg") },
  { name: "Banner 4", src: chrome.runtime.getURL("banner4.jpeg") },
];

function Product({ onBack }: { onBack: () => void }) {
  const [multiSelect, setMultiSelect] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(bannerOptions[0].src);
  const [selectedBanners, setSelectedBanners] = useState<string[]>([]);
  const [customBanner, setCustomBanner] = useState<string | null>(null);
  const [customBanners, setCustomBanners] = useState<string[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (multiSelect) {
          setCustomBanners((prev) => [...prev, ev.target?.result as string]);
        } else {
          setCustomBanner(ev.target?.result as string);
          setSelectedBanner("");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerClick = (src: string) => {
    if (multiSelect) {
      setSelectedBanners((prev) =>
        prev.includes(src) ? prev.filter((s) => s !== src) : [...prev, src]
      );
    } else {
      setSelectedBanner(src);
      setCustomBanner(null);
    }
  };

  const handleCustomBannerRemove = (src: string) => {
    setCustomBanners((prev) => prev.filter((s) => s !== src));
  };

  return (
    <main className="min-w-60 p-4 text-center relative">
      <h2 className="text-lg font-semibold mb-4">Choose a Banner Image</h2>
      <div className="flex items-center justify-center mb-4 gap-2">
        <label className="font-medium">Single</label>
        <input
          type="checkbox"
          checked={multiSelect}
          onChange={() => {
            setMultiSelect((v) => !v);
            setSelectedBanners([]);
            setCustomBanners([]);
          }}
          className="mx-2"
        />
        <label className="font-medium">Multi-select Images</label>
      </div>
      <div className="flex flex-wrap gap-4 justify-center mb-4">
        {bannerOptions.map((banner) => (
          <div key={banner.src} className="flex flex-col items-center">
            <img
              src={banner.src}
              alt={banner.name}
              className="object-cover rounded border"
              style={{ width: 250, height: 250, aspectRatio: "1 / 1" }}
              onClick={() => handleBannerClick(banner.src)}
            />
            <span className="text-xs">{banner.name}</span>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <label className="block mb-2">Or upload your own:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      {multiSelect && customBanners.length > 0 && (
        <div className="mb-4">
          <span className="block mb-2 font-semibold">
            Custom Uploaded Images Now:
          </span>
          <div className="flex flex-wrap gap-2 justify-center">
            {customBanners.map((src, idx) => (
              <div key={src + idx} className="relative">
                <img
                  src={src}
                  alt="Custom"
                  className="w-24 h-14 object-cover rounded"
                />
                <button
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs"
                  onClick={() => handleCustomBannerRemove(src)}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mb-4">
        <span className="block mb-2 font-semibold">Preview:</span>
        {multiSelect ? (
          <div className="flex flex-wrap gap-2 justify-center">
            {selectedBanners.map((src) => (
              <img
                key={src}
                src={src}
                alt="Selected"
                className="w-24 h-14 object-cover rounded"
              />
            ))}
            {customBanners.map((src, idx) => (
              <img
                key={src + idx}
                src={src}
                alt="Custom"
                className="w-24 h-14 object-cover rounded"
              />
            ))}
            {selectedBanners.length === 0 && customBanners.length === 0 && (
              <span className="text-gray-400">No images selected</span>
            )}
          </div>
        ) : customBanner ? (
          <img
            src={customBanner}
            alt="Custom Banner"
            className="w-64 h-32 object-cover rounded mx-auto"
          />
        ) : (
          <img
            src={selectedBanner}
            alt="Selected Banner"
            className="w-64 h-32 object-cover rounded mx-auto"
          />
        )}
      </div>
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
        onClick={onBack}
        aria-label="Back"
      >
        ←
      </button>
    </main>
  );
}

function Settings({
  onBack,
  onProduct,
}: {
  onBack: () => void;
  onProduct: () => void;
}) {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState("#4f46e5");
  const [focusIdx, setFocusIdx] = useState(0);
  const themes: Theme[] = [
    ...baseThemes,
    { name: "Custom Color", key: "custom", color: ``, custom: true },
  ];
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      setFocusIdx((prev) => (prev + 1) % themes.length);
      e.preventDefault();
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      setFocusIdx((prev) => (prev - 1 + themes.length) % themes.length);
      e.preventDefault();
    } else if (e.key === "Enter") {
      setSelectedTheme(themes[focusIdx].key);
      e.preventDefault();
    }
  };
  return (
    <main className="min-w-60 p-4 text-center relative">
      <h2 className="text-lg font-semibold mb-4">Choose a Theme</h2>
      <div className="grid grid-cols-1 gap-4">
        {themes.map((theme, idx) => (
          <div
            key={theme.key}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className={`rounded p-6 cursor-pointer shadow flex flex-col items-center justify-center ${
              theme.custom ? "" : theme.color
            } ${selectedTheme === theme.key ? "ring-4 ring-sky-400" : ""} ${
              focusIdx === idx ? "outline outline-2 outline-sky-400" : ""
            }`}
            style={
              theme.custom ? { background: customColor, color: "#fff" } : {}
            }
            onClick={() => setSelectedTheme(theme.key)}
          >
            {theme.name}
            {theme.custom && selectedTheme === "custom" && (
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="mt-2 w-12 h-12 border-none bg-transparent cursor-pointer"
                aria-label="Pick a custom color"
              />
            )}
          </div>
        ))}
      </div>
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
        onClick={onBack}
        aria-label="Back"
      >
        ←
      </button>
      <button
        className="fixed bottom-4 left-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
        onClick={onProduct}
        aria-label="Product"
      >
        Product
      </button>
    </main>
  );
}

export default function App() {
  const [minutes, setMinutes] = useState(30);
  const [page, setPage] = useState<"main" | "settings" | "product">("main");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  // Add state for notification
  const [notification, setNotification] = useState<string | null>(null);

  // Query alarm on mount
  useEffect(() => {
    chrome.alarms.get("custom", (alarm) => {
      if (alarm) {
        const now = Date.now();
        const timeLeft = Math.max(
          0,
          Math.round((alarm.scheduledTime - now) / 60000)
        );
        setRemaining(timeLeft);
        if (!intervalId) {
          const id = window.setInterval(() => {
            chrome.alarms.get("custom", (a) => {
              if (a) {
                const n = Date.now();
                setRemaining(
                  Math.max(0, Math.round((a.scheduledTime - n) / 60000))
                );
              } else {
                setRemaining(null);
                if (intervalId) clearInterval(intervalId);
              }
            });
          }, 1000 * 30);
          setIntervalId(id);
        }
      } else {
        setRemaining(null);
        if (intervalId) clearInterval(intervalId);
      }
    });
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Add stop/cancel logic
  const stopReminder = useCallback(() => {
    chrome.alarms.clearAll(() => {
      setRemaining(null);
      setNotification("Reminder stopped");
      setTimeout(() => setNotification(null), 1500);
    });
  }, []);

  // Send one-time reminder
  const sendOnce = useCallback((minutes: number) => {
    chrome.runtime.sendMessage({ type: "start-custom", minutes }, () => {
      setNotification("Set reminder success");
      setTimeout(() => setNotification(null), 1500);
    });
  }, []);
  // Send recurring reminder
  const sendRecurring = useCallback((minutes: number) => {
    chrome.runtime.sendMessage({ type: "start-recurring", minutes }, () => {
      setNotification("Set reminder success");
      setTimeout(() => setNotification(null), 1500);
    });
  }, []);

  if (page === "settings") {
    return (
      <Settings
        onBack={() => setPage("main")}
        onProduct={() => setPage("product")}
      />
    );
  }
  if (page === "product") {
    return <Product onBack={() => setPage("settings")} />;
  }

  return (
    <main className="min-w-60 p-4 text-center relative">
      <h1 className="text-lg font-semibold">Stay hydrated, darling.</h1>
      <input
        type="number"
        min={1}
        step={1}
        value={minutes}
        onChange={(e) =>
          setMinutes(Math.max(1, Math.floor(Number(e.target.value))))
        }
        className="mt-4 w-full rounded border px-2 py-1 text-black"
        placeholder="Enter minutes"
      />
      <Button
        label={`Remind me once in ${minutes} min`}
        onClick={() => sendOnce(minutes)}
      />
      <Button label="Stop" onClick={stopReminder} className="ml-2" />
      <Button
        label={`Remind me every ${minutes} min (recurring)`}
        onClick={() => sendRecurring(minutes)}
      />
      <Button label="Stop" onClick={stopReminder} className="ml-2" />
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow z-50 animate-fade-in">
          {notification}
        </div>
      )}
      {remaining !== null && (
        <div className="mt-2 text-sm text-gray-700">
          Next reminder in: {remaining} min
        </div>
      )}
      <button
        className="fixed bottom-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
        onClick={() => setPage("settings")}
        aria-label="Settings"
      >
        <IconSettings size={28} />
      </button>
    </main>
  );
}
