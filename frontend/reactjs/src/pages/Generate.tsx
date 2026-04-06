import { useState } from "react";
import SoftBackdrop from "../components/SoftBackdrop";

const thumbnailStyles = [
  { id: "bold", label: "Bold & Graphic", desc: "High contrast, bold typography, striking visuals", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg> },
  { id: "minimalist", label: "Minimalist", desc: "Clean, simple, lots of white space", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg> },
  { id: "photo", label: "Photorealistic", desc: "Photo-based, natural looking", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg> },
  { id: "illustration", label: "Illustrated", desc: "Hand-drawn, artistic, creative", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg> },
  { id: "tech", label: "Tech/Futuristic", desc: "Modern, sleek, tech-inspired", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2" ry="2"/><rect width="6" height="6" x="9" y="9" rx="1" ry="1"/><path d="M9 1v3"/><path d="M15 1v3"/><path d="M9 20v3"/><path d="M15 20v3"/><path d="M20 9h3"/><path d="M20 14h3"/><path d="M1 9h3"/><path d="M1 14h3"/></svg> },
];

type GeneratedThumbnail = {
  _id: string;
  title: string;
  style: string;
  aspectRatio: string;
  colorScheme: string;
  imageData: string;
  createdAt: string;
};

const Generate = () => {
  const [title, setTitle] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [selectedColor, setSelectedColor] = useState("Vibrant");
  const [thumbnail, setThumbnail] = useState<GeneratedThumbnail | null>(null);

  const [isStyleOpen, setIsStyleOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(thumbnailStyles[0]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setThumbnail(null);

    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    try {
      setLoading(true);

      const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
      const res = await fetch(`${apiBase}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          style: selectedStyle.id,
          aspectRatio,
          colorScheme: selectedColor,
          additionalDetails,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Generation failed");
      }

      setThumbnail(data.generation);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SoftBackdrop />
      <div className="pt-24 min-h-screen text-white/90 pb-20 font-inter">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-2xl p-6 sm:px-8 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
                Recreate Thumbnails <span className="text-pink-400">with AI</span>
              </h2>
              <p className="text-zinc-400 text-sm mt-1 sm:max-w-xl leading-relaxed">
                Upload a thumbnail or paste a URL, add your changes, and get a similar AI-recreated version instantly.
              </p>
            </div>
            <button className="whitespace-nowrap bg-white/10 hover:bg-white/20 transition-all text-white px-6 py-2.5 rounded-full text-sm font-medium border border-white/10 flex items-center gap-2 cursor-pointer">
              Try Now
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] xl:grid-cols-[450px_1fr] gap-6 lg:gap-8">
            <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl rounded-2xl p-6 sm:p-8 flex flex-col h-fit">
              <h1 className="text-2xl font-bold text-white mb-2">Create Your Thumbnail</h1>
              <p className="text-zinc-500 text-sm mb-6 pb-6 border-b border-white/5">
                Describe your vision and let AI bring it to life
              </p>

              <form className="space-y-6" onSubmit={handleGenerate}>
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-white mb-2">
                    Title or Topic
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-zinc-600 shadow-inner"
                    placeholder="e.g., 10 Tips for Better Sleep"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoComplete="off"
                  />
                  <div className="text-right text-xs text-zinc-600 mt-1.5">{title.length}/100</div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Aspect Ratio</label>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {["16:9", "1:1", "9:16"].map((ratio) => (
                      <button
                        type="button"
                        key={ratio}
                        onClick={() => setAspectRatio(ratio)}
                        className={`flex-1 py-3 border rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all ${aspectRatio === ratio ? "bg-white/10 border-white/20 text-white" : "border-white/10 hover:bg-white/5 text-zinc-400"}`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-white mb-2">Thumbnail Style</label>
                  <button
                    type="button"
                    onClick={() => setIsStyleOpen(!isStyleOpen)}
                    className={`w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.05] transition-all text-left flex items-center justify-between cursor-pointer ${isStyleOpen ? "ring-1 ring-pink-500/50 rounded-b-none border-b-0" : ""}`}
                  >
                    <div>
                      <div className="flex items-center gap-2 text-white font-medium">
                        <span className="text-zinc-400">{selectedStyle.icon}</span>
                        {selectedStyle.label}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">{selectedStyle.desc}</div>
                    </div>
                    <span className="text-zinc-500">⌄</span>
                  </button>

                  {isStyleOpen && (
                    <div className="absolute z-10 w-full bg-[#1c1a24]/95 backdrop-blur-3xl border border-white/[0.08] border-t-0 rounded-b-xl overflow-hidden">
                      {thumbnailStyles.map((style) => (
                        <button
                          type="button"
                          key={style.id}
                          onClick={() => {
                            setSelectedStyle(style);
                            setIsStyleOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-white/[0.05] transition-colors"
                        >
                          <div className="flex items-center gap-2 text-sm text-white font-medium">
                            <span className="text-zinc-400">{style.icon}</span>
                            {style.label}
                          </div>
                          <div className="text-xs text-zinc-500 pl-7">{style.desc}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Color Scheme</label>
                  <div className="flex flex-wrap gap-3 mb-2">
                    {["Vibrant", "Warm", "Cool", "Nature", "Neon", "Dark"].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-2 rounded-lg border text-sm ${selectedColor === color ? "border-pink-500 text-pink-400" : "border-white/10 text-zinc-400"}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="additionalDetails" className="block text-sm font-semibold text-white mb-2">
                    Additional Prompts
                  </label>
                  <textarea
                    id="additionalDetails"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-zinc-600 resize-none shadow-inner"
                    placeholder="Add any specific elements, mood, or style preferences..."
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-pink-500 hover:bg-pink-600 disabled:opacity-60 text-white font-semibold transition-all cursor-pointer"
                  >
                    {loading ? "Generating..." : "Generate Thumbnail"}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl rounded-2xl p-6 sm:p-8 flex flex-col min-h-[500px]">
              <h2 className="text-xl font-bold text-white mb-6">Preview</h2>

              {error && (
                <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div className="flex-1 border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.01] flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
                {loading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-pink-500/30 border-t-pink-500 animate-spin" />
                    <p className="text-zinc-300 font-medium">Generating your thumbnail…</p>
                    <p className="text-zinc-500 text-xs">This can take 15–30 seconds</p>
                  </div>
                ) : thumbnail ? (
                  <img
                    src={thumbnail.imageData}
                    alt={thumbnail.title}
                    className="w-full max-w-full rounded-xl object-contain shadow-2xl"
                  />
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-zinc-500 border border-white/5">
                      🖼️
                    </div>
                    <h3 className="text-white font-medium mb-1">Generate your first thumbnail</h3>
                    <p className="text-zinc-500 text-sm">Fill out the form and click Generate</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Generate;