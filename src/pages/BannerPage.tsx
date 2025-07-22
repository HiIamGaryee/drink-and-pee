import React, { useRef } from "react";

type BannerOption = { name: string; src: string };

type BannerPageProps = {
  bannerOptions: BannerOption[];
  selectedBanner: string;
  setSelectedBanner: (src: string) => void;
  multiSelectedBanners: string[];
  setMultiSelectedBanners: (banners: string[]) => void;
  primaryColor: string;
  isGradient?: boolean;
};

const BannerPage: React.FC<BannerPageProps> = ({
  bannerOptions,
  selectedBanner,
  setSelectedBanner,
  multiSelectedBanners,
  setMultiSelectedBanners,
  primaryColor,
  isGradient,
}) => {
  const [customBanner, setCustomBanner] = React.useState<string | null>(null);
  const [multiMode, setMultiMode] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load custom banner from storage on mount
  React.useEffect(() => {
    chrome.storage.local.get(["customBanner"], (result) => {
      if (result.customBanner) setCustomBanner(result.customBanner);
    });
  }, []);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCustomBanner(dataUrl);
      chrome.storage.local.set({ customBanner: dataUrl });
      setSelectedBanner(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Helper to get all banners (built-in + custom)
  const allBanners = [
    ...bannerOptions,
    ...(customBanner ? [{ name: "Custom Banner", src: customBanner }] : []),
  ];

  // Handle banner click
  const handleBannerClick = (src: string) => {
    if (multiMode) {
      if (multiSelectedBanners.includes(src)) {
        setMultiSelectedBanners(multiSelectedBanners.filter((b) => b !== src));
      } else {
        setMultiSelectedBanners([...multiSelectedBanners, src]);
      }
    } else {
      setSelectedBanner(src);
    }
  };

  // Pick a random banner from multiSelectedBanners
  const randomBanner =
    multiMode && multiSelectedBanners.length > 0
      ? multiSelectedBanners[
          Math.floor(Math.random() * multiSelectedBanners.length)
        ]
      : null;

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Banner Selection</h2>
      <button
        className="themed-btn px-3 py-1 rounded mb-2 mr-2"
        style={
          isGradient
            ? { backgroundImage: primaryColor, color: "#fff", border: "none" }
            : { background: primaryColor, color: "#fff", border: "none" }
        }
        onClick={() => setMultiMode((m) => !m)}
      >
        {multiMode ? "Disable Multi-Select" : "Enable Multi-Select"}
      </button>
      <button
        className="themed-btn px-3 py-1 rounded mb-2"
        style={
          isGradient
            ? { backgroundImage: primaryColor, color: "#fff", border: "none" }
            : { background: primaryColor, color: "#fff", border: "none" }
        }
        onClick={() => fileInputRef.current?.click()}
      >
        Upload Custom Banner
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <div className="flex flex-wrap gap-4 mb-4 mt-2">
        {allBanners.map((banner) => {
          const isSelected = multiMode
            ? multiSelectedBanners.includes(banner.src)
            : selectedBanner === banner.src;
          return (
            <div
              key={banner.src}
              className={`banner-img-container border-2 rounded cursor-pointer relative`}
              style={
                isSelected
                  ? isGradient
                    ? { borderImage: primaryColor + " 1" }
                    : { borderColor: primaryColor }
                  : { borderColor: "transparent" }
              }
              onClick={() => handleBannerClick(banner.src)}
              title={banner.name}
            >
              <img
                src={banner.src}
                alt={banner.name}
                style={{ width: 250, height: 250, objectFit: "cover" }}
              />
              {isSelected && (
                <span
                  className="absolute top-2 right-2 rounded-full px-2 py-1 text-xs"
                  style={
                    isGradient
                      ? {
                          zIndex: 2,
                          backgroundImage: primaryColor,
                          color: "#fff",
                          border: "none",
                        }
                      : {
                          zIndex: 2,
                          background: primaryColor,
                          color: "#fff",
                          border: "none",
                        }
                  }
                >
                  ✓
                </span>
              )}
            </div>
          );
        })}
      </div>
      {multiMode && multiSelectedBanners.length > 0 && (
        <div className="mt-2">
          <div className="font-bold mb-1">Random Preview:</div>
          <img
            src={randomBanner || multiSelectedBanners[0]}
            alt="Random Banner Preview"
            style={
              isGradient
                ? {
                    width: 250,
                    height: 250,
                    objectFit: "cover",
                    borderImage: primaryColor + " 1",
                  }
                : {
                    width: 250,
                    height: 250,
                    objectFit: "cover",
                    border: `4px solid ${primaryColor}`,
                  }
            }
          />
        </div>
      )}
    </div>
  );
};

export default BannerPage;
