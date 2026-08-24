import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Play, Settings, TrendingUp, Trash2, Edit, Share2, Eye, AlertCircle, Calendar, Tag, ArrowLeft, Radio, Sparkles } from "lucide-react";
import { useLocation, Link } from "wouter";
import { toast } from "sonner";
import { LivingWorldWeb } from "@/components/LivingWorldWeb";

export default function YouTubeManager() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("library");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    category: "Pixel & Dot",
  });

  const [videos, setVideos] = useState([
    {
      id: 1,
      title: "Pixel & Dot: Grandma Moves In",
      description: "Official Season 1 episode featuring Pixel and Dot welcoming Grandma to the studio.",
      views: 3420,
      likes: 245,
      comments: 38,
      uploadDate: "2026-06-12",
      status: "published",
      series: "Pixel & Dot",
      url: "https://youtube.com",
    },
    {
      id: 2,
      title: "Tater & Clifford: Snack Vault Security Sweep",
      description: "K9 Security Tater and Executive Leader Clifford defend the studio snack vault.",
      views: 1890,
      likes: 178,
      comments: 22,
      uploadDate: "2026-07-04",
      status: "published",
      series: "Pet Reels",
      url: "https://youtube.com",
    },
    {
      id: 3,
      title: "District B Arcade High-Score Showcase",
      description: "Walkthrough of top identity grid combinations and arcade achievements.",
      views: 950,
      likes: 84,
      comments: 12,
      uploadDate: "2026-08-01",
      status: "published",
      series: "District B",
      url: "https://youtube.com",
    },
  ]);

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please provide a broadcast title");
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast.success("Broadcast staged for publication review!");
          setVideos([
            {
              id: Date.now(),
              title: formData.title,
              description: formData.description || "New broadcast submission.",
              views: 0,
              likes: 0,
              comments: 0,
              uploadDate: new Date().toISOString().split("T")[0],
              status: "pending review",
              series: formData.category,
              url: "https://youtube.com",
            },
            ...videos,
          ]);
          setFormData({ title: "", description: "", tags: "", category: "Pixel & Dot" });
          setActiveTab("library");
          return 0;
        }
        return prev + 20;
      });
    }, 400);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050914] flex items-center justify-center text-[#20cde2]">
        Loading Broadcast Hub...
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050914] text-[#a0a8c0]">
      <LivingWorldWeb variant="cyan" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8 sm:px-10 lg:px-14">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#20cde2] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#20cde2]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to AO Homeworld
          </Link>

          <Button onClick={() => navigate("/pixel-and-dot")} className="btn-neon-magenta text-xs font-bold">
            <Radio className="mr-2 h-4 w-4" /> Series Broadcasts
          </Button>
        </div>

        {/* Hero Section */}
        <section className="mt-12 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#20cde2]/40 bg-[#20cde2]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#20cde2]">
            <Radio className="h-3.5 w-3.5 text-[#e853dc]" />
            AO Studio Broadcast Hub
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Broadcast <span className="text-[#e853dc]">Manager</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#7a7f8e]">
            Manage animated episode releases, review channel performance analytics, and stage upcoming shorts for the AO Living World.
          </p>
        </section>

        {/* Tab Control */}
        <section className="mt-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-[#0d1b2b] border border-[#2a2f3e] p-1 rounded-xl">
              <TabsTrigger value="library" className="data-[state=active]:bg-[#20cde2] data-[state=active]:text-[#050914] text-xs font-bold">
                <Play className="mr-2 h-4 w-4" /> Episode Library ({videos.length})
              </TabsTrigger>
              <TabsTrigger value="upload" className="data-[state=active]:bg-[#e853dc] data-[state=active]:text-white text-xs font-bold">
                <Upload className="mr-2 h-4 w-4" /> Stage New Broadcast
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-[#d8ae55] data-[state=active]:text-[#050914] text-xs font-bold">
                <TrendingUp className="mr-2 h-4 w-4" /> Performance Stats
              </TabsTrigger>
            </TabsList>

            {/* Library Tab */}
            <TabsContent value="library" className="mt-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {videos.map((vid) => (
                  <div
                    key={vid.id}
                    className="group relative overflow-hidden rounded-2xl border border-[#2a2f3e] bg-[#0d1b2b]/80 p-6 backdrop-blur transition-all hover:border-[#20cde2]/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#d8ae55]">
                        {vid.series}
                      </span>
                      <span className="rounded-full bg-[#20cde2]/20 px-2.5 py-0.5 text-[10px] font-semibold text-[#20cde2] uppercase">
                        {vid.status}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{vid.title}</h3>
                    <p className="text-sm text-[#7a7f8e] line-clamp-2 mb-6">{vid.description}</p>

                    <div className="grid grid-cols-3 gap-2 border-t border-[#2a2f3e] pt-4 text-center text-xs">
                      <div>
                        <p className="text-white font-bold">{vid.views.toLocaleString()}</p>
                        <p className="text-[#7a7f8e] text-[10px]">Views</p>
                      </div>
                      <div>
                        <p className="text-white font-bold">{vid.likes}</p>
                        <p className="text-[#7a7f8e] text-[10px]">Likes</p>
                      </div>
                      <div>
                        <p className="text-white font-bold">{vid.comments}</p>
                        <p className="text-[#7a7f8e] text-[10px]">Comments</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Upload Tab */}
            <TabsContent value="upload" className="mt-8">
              <div className="max-w-2xl mx-auto rounded-2xl border border-[#2a2f3e] bg-[#0d1b2b]/80 p-8 backdrop-blur">
                <h3 className="text-2xl font-bold text-white mb-2">Stage Broadcast Submission</h3>
                <p className="text-xs text-[#7a7f8e] mb-6">
                  Submit video links or metadata for review before syncing across the AO network.
                </p>

                <form onSubmit={handleSimulateUpload} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#20cde2]">Broadcast Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Pixel & Dot Episode 3 Preview"
                      className="bg-[#050914] border-[#2a2f3e] text-white mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#20cde2]">Series Category</label>
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Pixel & Dot, Pet Reels, Studio Logs"
                      className="bg-[#050914] border-[#2a2f3e] text-white mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#20cde2]">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Summary of episode narrative or release notes..."
                      className="bg-[#050914] border-[#2a2f3e] text-white mt-1"
                    />
                  </div>

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-[#20cde2]">
                        <span>Staging Media...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-2 w-full bg-[#050914] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#20cde2] transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <Button type="submit" disabled={isUploading} className="w-full btn-neon-magenta mt-4 font-bold">
                    {isUploading ? "Processing Broadcast..." : "Stage for Review"}
                  </Button>
                </form>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="mt-8">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-[#2a2f3e] bg-[#0d1b2b]/80 p-6 backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#7a7f8e]">Total Lifetime Views</p>
                  <p className="text-3xl font-extrabold text-[#20cde2] mt-2">6,260</p>
                  <p className="text-xs text-emerald-400 mt-2">+14% vs last month</p>
                </div>
                <div className="rounded-2xl border border-[#2a2f3e] bg-[#0d1b2b]/80 p-6 backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#7a7f8e]">Audience Engagement</p>
                  <p className="text-3xl font-extrabold text-[#e853dc] mt-2">507 Likes</p>
                  <p className="text-xs text-[#a0a8c0] mt-2"> Across 3 active series</p>
                </div>
                <div className="rounded-2xl border border-[#2a2f3e] bg-[#0d1b2b]/80 p-6 backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#7a7f8e]">Broadcast Status</p>
                  <p className="text-3xl font-extrabold text-[#d8ae55] mt-2">100% Online</p>
                  <p className="text-xs text-[#20cde2] mt-2">YouTube API & Fallback Active</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-[#2a2f3e] pt-8 text-center text-xs text-[#7a7f8e]">
          <p>&copy; 2026 Anom Artsy. Broadcast Management for AO Creative Studio.</p>
        </footer>
      </div>
    </main>
  );
}
