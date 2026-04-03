import { useState } from "react"
import SoftBackdrop from "../components/SoftBackdrop"

const mockVideos = [
  { id: 1, source: "mock", img: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=2574&auto=format&fit=crop", title: "Complete Photography Guide 2026", channel: "PhotoMasters", views: "1.2M views", time: "2 days ago", avatar: "P" },
  { id: 2, source: "user", img: "", title: "[Your Generated Thumbnail]", channel: "Your Channel", views: "0 views", time: "Just now", avatar: "U" },
  { id: 3, source: "mock", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop", title: "Future of AI Technology EXPLAINED", channel: "Tech Daily", views: "2.1M views", time: "5 hours ago", avatar: "T" },
  { id: 4, source: "mock", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2672&auto=format&fit=crop", title: "Build a SaaS in 24 Hours", channel: "MakerSpace", views: "450K views", time: "1 month ago", avatar: "M" },
]

const YTPreview = () => {
  const [userTitle, setUserTitle] = useState("My Epic New Video Title!")
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  return (
    <>
      <SoftBackdrop />
      <div className="pt-24 min-h-screen text-white/90 pb-20 font-inter">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Controls Sidebar */}
            <div className="lg:col-span-1 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-2xl p-6 h-fit sticky top-28">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-pink-500"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon fill="white" points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                YT Preview
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Upload Thumbnail test</label>
                  <label className="flex items-center justify-center w-full h-32 px-4 transition border-2 border-dashed rounded-xl appearance-none cursor-pointer border-white/20 hover:border-pink-500/50 bg-white/[0.02]">
                    {previewImage ? (
                        <img src={previewImage} className="w-full h-full object-cover rounded-lg" alt="preview" />
                    ) : (
                        <span className="flex items-center space-x-2 text-sm text-zinc-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        <span>Select file</span>
                        </span>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0]
                        if(file) {
                            setPreviewImage(URL.createObjectURL(file))
                        }
                    }} />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Test Title</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:outline-none focus:border-pink-500/50 transition-all text-sm text-white" value={userTitle} onChange={(e) => setUserTitle(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Mock YouTube Feed */}
            <div className="lg:col-span-3 bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 sm:p-8 overflow-hidden min-h-[600px]">
              <div className="flex gap-3 mb-8 pb-4 border-b border-white/10 overflow-x-auto">
                <div className="px-3 py-1 bg-white text-black rounded-lg text-sm font-medium whitespace-nowrap cursor-pointer">All</div>
                <div className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm whitespace-nowrap transition cursor-pointer">Gaming</div>
                <div className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm whitespace-nowrap transition cursor-pointer">Technology</div>
                <div className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm whitespace-nowrap transition cursor-pointer">Podcasts</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-10">
                {mockVideos.map(video => (
                  <div key={video.id} className="flex flex-col gap-3 cursor-pointer group">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800">
                      {video.source === 'user' ? (
                        previewImage ? (
                            <img src={previewImage} alt="User Thumbnail" className="w-full h-full object-cover transition duration-200 group-hover:scale-105" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-500 bg-zinc-900 border border-dashed border-zinc-700">
                                No Thumbnail
                            </div>
                        )
                      ) : (
                        <img src={video.img} alt={video.title} className="w-full h-full object-cover transition duration-200 group-hover:scale-105" />
                      )}
                      <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 text-xs font-semibold rounded text-white">14:20</div>
                    </div>
                    <div className="flex gap-3 pr-6">
                      <div className="w-9 h-9 rounded-full bg-zinc-700 shrink-0 flex items-center justify-center text-sm font-bold text-white uppercase">{video.avatar}</div>
                      <div className="flex flex-col">
                        <h3 className="text-white text-base font-medium line-clamp-2 leading-tight mb-1">
                            {video.source === 'user' ? userTitle || video.title : video.title}
                        </h3>
                        <p className="text-zinc-400 text-sm hover:text-white transition">{video.channel}</p>
                        <p className="text-zinc-400 text-sm">{video.views} • {video.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default YTPreview
