import React from "react";

type Theme = { id: string; name: string; color: string };

type ThemePageProps = {
  themes: Theme[];
  theme: string;
  setTheme: (id: string) => void;
};

const ThemePage: React.FC<ThemePageProps> = ({ themes, theme, setTheme }) => {
  // Focus index defaults to the selected theme
  const initialIdx = React.useMemo(
    () => themes.findIndex((t) => t.id === theme) || 0,
    [themes, theme]
  );
  const [focusIdx, setFocusIdx] = React.useState(initialIdx);

  // Keep focusIdx in sync with selected theme when theme changes
  React.useEffect(() => {
    setFocusIdx(themes.findIndex((t) => t.id === theme));
  }, [theme, themes]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      setFocusIdx((idx) => (idx + 1) % themes.length);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setFocusIdx((idx) => (idx - 1 + themes.length) % themes.length);
      e.preventDefault();
    } else if (e.key === "Enter") {
      setTheme(themes[focusIdx].id);
      e.preventDefault();
    }
  };

  return (
    <div
      className="p-4"
      tabIndex={0}
      autoFocus
      onKeyDown={handleKeyDown}
      style={{ outline: "none" }}
    >
      <h2 className="text-lg font-bold mb-2">Theme Selection</h2>
      <div className="flex flex-col gap-2">
        {themes.map((t, idx) => (
          <div
            key={t.id}
            className={`px-3 py-2 rounded cursor-pointer flex items-center gap-2 ${
              theme === t.id ? "bg-blue-100" : ""
            } ${focusIdx === idx ? "outline outline-2 outline-sky-400" : ""}`}
            style={{
              background: t.color,
              color: t.id === "light" ? "#222" : undefined,
            }}
            onClick={() => setTheme(t.id)}
          >
            <span>{t.name}</span>
            {theme === t.id && <span className="ml-2">✓</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemePage;
