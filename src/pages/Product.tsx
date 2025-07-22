// src/Product.tsx
import { useState, ChangeEvent } from "react";

type Props = { go: (p: "settings" | "main") => void };

const bannerOptions = [
  { name: "Default", src: chrome.runtime.getURL("banner.jpg") },
  { name: "Banner 1", src: chrome.runtime.getURL("banner1.png") },
  { name: "Banner 2", src: chrome.runtime.getURL("banner2.jpg") },
  { name: "Banner 3", src: chrome.runtime.getURL("banner3.jpg") },
  { name: "Banner 4", src: chrome.runtime.getURL("banner4.jpeg") },
];

export default function Product({ go }: Props) {
  const [multi, setMulti] = useState(false);
  const [picked, pick] = useState(bannerOptions[0].src);
  const [pickedMulti, setPickedMulti] = useState<string[]>([]);
  const [custom, setCustom] = useState<string | null>(null);
  const [customMulti, setCustomMulti] = useState<string[]>([]);

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      if (multi) setCustomMulti((p) => [...p, url]);
      else {
        setCustom(url);
        pick(""); // clear stock pick
      }
    };
    reader.readAsDataURL(f);
  };

  const clickBanner = (src: string) => {
    if (multi) {
      setPickedMulti((p) =>
        p.includes(src) ? p.filter((s) => s !== src) : [...p, src]
      );
    } else {
      pick(src);
      setCustom(null);
    }
  };

  const removeCustom = (src: string) =>
    setCustomMulti((p) => p.filter((s) => s !== src));

  return (
    <main className="min-w-60 p-4 text-center relative">
      <h2 className="text-lg font-semibold mb-4">Choose a Banner Image</h2>

      <label className="flex items-center justify-center gap-2 mb-4">
        <span>Multi‑select</span>
        <input
          type="checkbox"
          checked={multi}
          onChange={() => {
            setMulti((v) => !v);
            setPickedMulti([]);
            setCustomMulti([]);
          }}
        />
      </label>

      <div className="flex flex-wrap gap-4 justify-center mb-4">
        {bannerOptions.map((b) => (
          <figure
            key={b.src}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => clickBanner(b.src)}
          >
            <img
              src={b.src}
              alt={b.name}
              className={`w-40 h-40 object-cover rounded border transition ${
                (multi ? pickedMulti : [picked]).includes(b.src)
                  ? "ring-4 ring-sky-400"
                  : ""
              }`}
            />
            <figcaption className="text-xs mt-1">{b.name}</figcaption>
          </figure>
        ))}
      </div>

      <label className="block mb-2 font-medium">
        Or upload your own:
        <input
          type="file"
          accept="image/*"
          onChange={onFile}
          className="mt-2 block"
        />
      </label>

      {multi && customMulti.length > 0 && (
        <section className="mb-4">
          <h3 className="font-semibold mb-2">Custom uploads</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {customMulti.map((src, i) => (
              <div key={src + i} className="relative">
                <img src={src} className="w-24 h-14 object-cover rounded" />
                <button
                  onClick={() => removeCustom(src)}
                  className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full px-1"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-4">
        <h3 className="font-semibold mb-2">Preview</h3>
        {multi ? (
          <div className="flex flex-wrap gap-2 justify-center">
            {pickedMulti.concat(customMulti).map((src) => (
              <img
                key={src}
                src={src}
                className="w-24 h-14 object-cover rounded"
              />
            ))}
            {pickedMulti.length + customMulti.length === 0 && (
              <span className="text-gray-400">No images selected</span>
            )}
          </div>
        ) : custom ? (
          <img
            src={custom}
            className="w-64 h-32 object-cover rounded mx-auto"
          />
        ) : (
          <img
            src={picked}
            className="w-64 h-32 object-cover rounded mx-auto"
          />
        )}
      </section>

      <button
        aria-label="Back"
        onClick={() => go("settings")}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
      >
        ←
      </button>
    </main>
  );
}
