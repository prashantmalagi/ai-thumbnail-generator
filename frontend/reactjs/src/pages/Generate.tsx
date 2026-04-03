import { useState } from "react"
import { useNavigate } from "react-router-dom"
import SoftBackdrop from "../components/SoftBackdrop"
import { generateApi } from "../lib/api"
import type { IGeneration } from "../lib/api"

const thumbnailStyles = [
    { id: "bold", label: "Bold & Graphic", desc: "High contrast, bold typography, striking visuals", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg> },
    { id: "minimalist", label: "Minimalist", desc: "Clean, simple, lots of white space", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg> },
    { id: "photo", label: "Photorealistic", desc: "Photo-based, natural looking", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg> },
    { id: "illustration", label: "Illustrated", desc: "Hand-drawn, artistic, creative", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg> },
    { id: "tech", label: "Tech/Futuristic", desc: "Modern, sleek, tech-inspired", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2" ry="2"/><rect width="6" height="6" x="9" y="9" rx="1" ry="1"/><path d="M9 1v3"/><path d="M15 1v3"/><path d="M9 20v3"/><path d="M15 20v3"/><path d="M20 9h3"/><path d="M20 14h3"/><path d="M1 9h3"/><path d="M1 14h3"/></svg> },
];

const Generate = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [aspectRatio, setAspectRatio] = useState("16:9")
  const [additionalDetails, setAdditionalDetails] = useState("")
  const [selectedColor, setSelectedColor] = useState("Vibrant")
  const [isStyleOpen, setIsStyleOpen] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState(thumbnailStyles[0])

  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<IGeneration | null>(null)
  const [error, setError] = useState("")

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setError("")
    setIsGenerating(true)
    setGeneratedImage(null)
    try {
      const res = await generateApi.generate({
        title,
        style: selectedStyle.id,
        aspectRatio,
        colorScheme: selectedColor,
        additionalDetails,
      })
      setGeneratedImage(res.generation)
    } catch (err: any) {
      setError(err.message || "Generation failed. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  function handleDownload() {
    if (!generatedImage) return
    const link = document.createElement('a')
    link.href = generatedImage.imageData
    link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-thumbnail.jpg`
    link.click()
  }

  return (
    <>
      <SoftBackdrop />
      <div className="pt-24 min-h-screen text-white/90 pb-20 font-inter">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Banner Banner */}
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
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] xl:grid-cols-[450px_1fr] gap-6 lg:gap-8">
            
            {/* Left Generator Form */}
            <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl rounded-2xl p-6 sm:p-8 flex flex-col h-fit">
              <h1 className="text-2xl font-bold text-white mb-2">Create Your Thumbnail</h1>
              <p className="text-zinc-500 text-sm mb-6 pb-6 border-b border-white/5">Describe your vision and let AI bring it to life</p>
              
              <form className="space-y-6" onSubmit={handleGenerate}>
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-white mb-2">Title or Topic</label>
                  <input type="text" id="title" className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-zinc-600 shadow-inner" placeholder="e.g., 10 Tips for Better Sleep" value={title} onChange={(e) => setTitle(e.target.value)} autoComplete="off" />
                  <div className="text-right text-xs text-zinc-600 mt-1.5">{title.length}/100</div>
                </div>

                {/* Aspect Ratio */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Aspect Ratio</label>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {["16:9", "1:1", "9:16"].map(ratio => (
                      <button type="button" key={ratio} onClick={() => setAspectRatio(ratio)} className={`flex-1 py-3 border rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all ${aspectRatio === ratio ? 'bg-white/10 border-white/20 text-white' : 'border-white/10 hover:bg-white/5 text-zinc-400'}`}>
                        <div className={`border-2 rounded-sm ${aspectRatio === ratio ? 'border-white' : 'border-zinc-400'}`} style={{ width: ratio === '16:9' ? 18 : ratio === '1:1' ? 14 : 10, height: ratio === '16:9' ? 10 : ratio === '1:1' ? 14 : 18 }} />
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dropdown: Thumbnail Style */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-white mb-2">Thumbnail Style</label>
                  <button type="button" onClick={() => setIsStyleOpen(!isStyleOpen)} className={`w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.05] transition-all text-left flex items-center justify-between cursor-pointer ${isStyleOpen ? 'ring-1 ring-pink-500/50 rounded-b-none border-b-0' : ''}`}>
                    <div>
                        <div className="flex items-center gap-2 text-white font-medium">
                            <span className="text-zinc-400">{selectedStyle.icon}</span>
                            {selectedStyle.label}
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">{selectedStyle.desc}</div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-zinc-500 transition-transform ${isStyleOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
                  </button>
                  {isStyleOpen && (
                    <div className="absolute z-10 w-full bg-[#1c1a24]/95 backdrop-blur-3xl border border-white/[0.08] border-t-0 rounded-b-xl shadow-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                      {thumbnailStyles.map((style) => (
                        <button type="button" key={style.id} onClick={() => { setSelectedStyle(style); setIsStyleOpen(false); }} className={`w-full text-left px-4 py-3 hover:bg-white/[0.05] transition-colors flex flex-col gap-1 border-b border-white/[0.02] last:border-0 ${selectedStyle.id === style.id ? 'bg-white/[0.03]' : ''}`}>
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

                {/* Color Scheme */}
                <div>
                    <label className="block text-sm font-semibold text-white mb-2">Color Scheme</label>
                    <div className="flex flex-wrap gap-3 mb-2">
                        {/* Mock Color palettes */}
                        <div onClick={() => setSelectedColor('Vibrant')} className={`cursor-pointer w-10 h-10 rounded overflow-hidden flex ${selectedColor==='Vibrant'?'ring-2 ring-pink-500 ring-offset-2 ring-offset-[#0a0a0a]':''}`}>
                            <div className="w-1/2 bg-cyan-400"></div><div className="w-1/2 bg-pink-500"></div>
                        </div>
                        <div onClick={() => setSelectedColor('Warm')} className={`cursor-pointer w-10 h-10 rounded overflow-hidden flex ${selectedColor==='Warm'?'ring-2 ring-pink-500 ring-offset-2 ring-offset-[#0a0a0a]':''}`}>
                            <div className="w-1/2 bg-orange-500"></div><div className="w-1/2 bg-red-500"></div>
                        </div>
                        <div onClick={() => setSelectedColor('Cool')} className={`cursor-pointer w-10 h-10 rounded overflow-hidden flex ${selectedColor==='Cool'?'ring-2 ring-pink-500 ring-offset-2 ring-offset-[#0a0a0a]':''}`}>
                            <div className="w-1/2 bg-blue-500"></div><div className="w-1/2 bg-cyan-300"></div>
                        </div>
                        <div onClick={() => setSelectedColor('Nature')} className={`cursor-pointer w-10 h-10 rounded overflow-hidden flex ${selectedColor==='Nature'?'ring-2 ring-pink-500 ring-offset-2 ring-offset-[#0a0a0a]':''}`}>
                            <div className="w-1/2 bg-emerald-500"></div><div className="w-1/2 bg-green-300"></div>
                        </div>
                        <div onClick={() => setSelectedColor('Neon')} className={`cursor-pointer w-10 h-10 rounded overflow-hidden flex ${selectedColor==='Neon'?'ring-2 ring-pink-500 ring-offset-2 ring-offset-[#0a0a0a]':''}`}>
                            <div className="w-1/2 bg-purple-500"></div><div className="w-1/2 bg-indigo-600"></div>
                        </div>
                         <div onClick={() => setSelectedColor('Dark')} className={`cursor-pointer w-10 h-10 rounded overflow-hidden flex ${selectedColor==='Dark'?'ring-2 ring-pink-500 ring-offset-2 ring-offset-[#0a0a0a]':''}`}>
                            <div className="w-1/2 bg-zinc-800"></div><div className="w-1/2 bg-zinc-600"></div>
                        </div>
                    </div>
                    <p className="text-xs text-zinc-500">Selected: {selectedColor}</p>
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Model</label>
                  <div className="relative">
                    <select className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.05] transition-all focus:outline-none focus:border-pink-500/50 appearance-none text-white cursor-pointer shadow-inner">
                      <option value="premium" className="bg-zinc-900 text-white">Premium (10 credits)</option>
                      <option value="standard" className="bg-zinc-900 text-white">Standard (5 credits)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                {/* User Photo */}
                <div className="flex items-center gap-4 py-2">
                  <div className="w-16 h-16 rounded-xl border border-dashed border-white/20 bg-white/[0.02] flex items-center justify-center text-zinc-400 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white mb-2 flex items-center gap-1">User Photo <span className="text-zinc-500 font-normal">(optional)</span></div>
                    <button type="button" className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-lg transition-all border border-white/10 cursor-pointer">
                      Upload Photo
                    </button>
                  </div>
                </div>

                {/* Additional Details */}
                <div>
                  <label htmlFor="additionalDetails" className="block text-sm font-semibold text-white mb-2">Additional Prompts <span className="text-zinc-600 font-normal">(optional)</span></label>
                  <textarea id="additionalDetails" rows={3} className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-zinc-600 resize-none shadow-inner" placeholder="Add any specific elements, mood, or style preferences..." value={additionalDetails} onChange={(e) => setAdditionalDetails(e.target.value)} />
                </div>

                <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isGenerating || !title.trim()}
                      className="w-full py-3.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                          Generating…
                        </>
                      ) : 'Generate Thumbnail'}
                    </button>
                </div>
              </form>
            </div>

            {/* Right Preview Panel */}
            <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl rounded-2xl p-6 sm:p-8 flex flex-col min-h-[500px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Preview</h2>
                {generatedImage && (
                  <div className="flex items-center gap-2">
                    <button onClick={handleDownload} className="flex items-center gap-1.5 px-4 py-2 bg-white/8 hover:bg-white/15 border border-white/10 rounded-full text-xs font-medium text-white transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                      Download
                    </button>
                    <button onClick={() => navigate('/my-generation')} className="flex items-center gap-1.5 px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 rounded-full text-xs font-medium text-pink-300 transition-all">
                      View All
                    </button>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex-1 border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.01] flex flex-col items-center justify-center p-8 text-center min-h-[300px] overflow-hidden">
                {isGenerating ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4">
                      <svg className="animate-spin text-pink-400" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    </div>
                    <h3 className="text-white font-medium mb-1">Generating your thumbnail…</h3>
                    <p className="text-zinc-500 text-sm">This may take 15–30 seconds</p>
                  </>
                ) : generatedImage ? (
                  <img
                    src={generatedImage.imageData}
                    alt={generatedImage.title}
                    className="w-full max-w-full rounded-xl object-contain shadow-2xl"
                  />
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-zinc-500 border border-white/5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
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
  )
}

export default Generate
