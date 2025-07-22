// src/pages/Product.tsx
import { useState, ChangeEvent } from "react";
type Props = { go: (p: "settings" | "main") => void };
const bannerOptions = [
  "banner.jpg",
  "banner1.png",
  "banner2.jpg",
  "banner3.jpg",
  "banner4.jpeg",
].map((f, i) => ({ name: `Banner ${i}`, src: chrome.runtime.getURL(f) }));

export default function Product({ go }: Props) {
  const [multi, setMulti] = useState(false);
  const [picked, pick] = useState(bannerOptions[0].src);
  const [pickedMulti, setPickedMulti] = useState<string[]>([]);
  const [custom, setCustom] = useState<string | null>(null);
  const [customMulti, setCustomMulti] = useState<string[]>([]);
  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => {
      const url = ev.target?.result as string;
      multi ? setCustomMulti((p) => [...p, url]) : (setCustom(url), pick(""));
    };
    r.readAsDataURL(file);
  };
  const toggle = (src: string) =>
    multi
      ? setPickedMulti((p) =>
          p.includes(src) ? p.filter((s) => s !== src) : [...p, src]
        )
      : (pick(src), setCustom(null));
  return (
    <main className="min-w-60 p-4 text-center relative">
      <h2 className="text-lg font-semibold mb-4">Choose a Banner Image</h2>
      <label className="flex items-center gap-2 mb-4">
        Multi‑select{" "}
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
            onClick={() => toggle(b.src)}
            className="cursor-pointer flex flex-col items-center"
          >
            <img
              src={b.src}
              alt={b.name}
              className={`w-40 h-40 object-cover rounded border ${
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
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Custom uploads</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {customMulti.map((src, i) => (
              <div key={src + i} className="relative">
                <img src={src} className="w-24 h-14 object-cover rounded" />
                <button
                  onClick={() =>
                    setCustomMulti((p) => p.filter((s) => s !== src))
                  }
                  className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full px-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Preview</h3>
        {multi ? (
          pickedMulti.concat(customMulti).length ? (
            pickedMulti
              .concat(customMulti)
              .map((src) => (
                <img
                  key={src}
                  src={src}
                  className="w-24 h-14 object-cover rounded"
                />
              ))
          ) : (
            <span className="text-gray-400">No images selected</span>
          )
        ) : (
          <img
            src={custom || picked}
            className="w-64 h-32 object-cover rounded mx-auto"
          />
        )}
      </div>
      <button
        onClick={() => go("settings")}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
      >
        ←
      </button>
    </main>
  );
}
