import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SoftBackdrop from "../components/SoftBackdrop"
import { generateApi } from "../lib/api"
import type { IGeneration } from "../lib/api"

const styles = ["All", "Minimalist", "Bold & Graphic", "Tech/Futuristic", "Photorealistic", "Illustrated"];

const MyGeneration = () => {
  const navigate = useNavigate()
  const [generations, setGenerations] = useState<IGeneration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("All")

  useEffect(() => {
    generateApi.getMyGenerations()
      .then(res => setGenerations(res.generations))
      .catch(() => setGenerations([]))
      .finally(() => setIsLoading(false))
  }, [])

  const filteredGenerations = activeFilter === "All"
    ? generations
    : generations.filter(item => item.style === activeFilter.toLowerCase().replace(' & ', '_').replace('/', '_'));

  async function handleDelete(id: string) {
    if (!confirm('Delete this thumbnail?')) return
    try {
      await generateApi.delete(id)
      setGenerations(prev => prev.filter(g => g._id !== id))
    } catch {
      alert('Failed to delete. Please try again.')
    }
  }

  function handleDownload(item: IGeneration) {
    const link = document.createElement('a')
    link.href = item.imageData
    link.download = `${item.title.replace(/\s+/g, '-').toLowerCase()}-thumbnail.jpg`
    link.click()
  }

  const styleLabel: Record<string, string> = {
    bold: 'Bold & Graphic', minimalist: 'Minimalist', photo: 'Photorealistic',
    illustration: 'Illustrated', tech: 'Tech/Futuristic',
  }

  return (
    <>
      <SoftBackdrop />
      <div className="pt-24 min-h-screen text-white/90 pb-20 font-inter">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Generations</h1>
              <p className="text-zinc-400 text-sm">View, download, and manage your AI-generated thumbnails.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-0">
               {styles.map(style => (
                 <button 
                   key={style}
                   onClick={() => setActiveFilter(style)}
                   className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${
                     activeFilter === style 
                       ? "bg-pink-500/20 border-pink-500/50 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.15)]" 
                       : "bg-white/[0.02] border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white"
                   }`}
                 >
                   {style}
                 </button>
               ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <svg className="animate-spin mb-4" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              <p>Loading your generations…</p>
            </div>
          ) : filteredGenerations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              <p className="mb-4">{generations.length === 0 ? "No thumbnails yet." : "No thumbnails found for this style."}</p>
              {generations.length === 0 && (
                <button onClick={() => navigate('/generate')} className="px-6 py-2.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium transition-all">
                  Generate your first thumbnail
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGenerations.map((item) => (
                <div key={item._id} className="group relative bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl rounded-2xl overflow-hidden hover:border-pink-500/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] flex flex-col cursor-pointer">
                  {/* Image Container */}
                  <div className="relative aspect-video overflow-hidden">
                    <img src={item.imageData} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button onClick={() => handleDownload(item)} className="p-3 bg-white hover:bg-zinc-200 text-black rounded-full transition-transform hover:scale-110" title="Download">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="p-3 bg-white/10 hover:bg-red-500/80 text-white rounded-full transition-transform hover:scale-110 backdrop-blur-sm" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </button>
                    </div>

                    {/* Style Badge */}
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-medium border border-white/10">
                      {styleLabel[item.style] || item.style}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-white truncate mb-1">{item.title}</h3>
                      <p className="text-zinc-500 text-xs">Generated {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </>
  )
}

export default MyGeneration
