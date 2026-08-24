import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Palette, Gamepad2, CheckCircle2, ArrowLeft, Heart, Sparkles, BookOpen } from "lucide-react";
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";
import { getVideoSource, PIXEL_DOT_FALLBACK_VIDEO_URL } from "../../../shared/videoSources";
import { LivingWorldWeb } from "@/components/LivingWorldWeb";

// Video Player Component
function VideoPlayer({ videoUrl, fallbackUrl, title, onClose }: { videoUrl: string; fallbackUrl?: string; title: string; onClose: () => void }) {
  const [sourceError, setSourceError] = useState(false);
  const activeUrl = getVideoSource(videoUrl, fallbackUrl, sourceError);
  const isYouTube = activeUrl.includes("youtube.com") || activeUrl.includes("youtu.be");

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <Card className="bg-[#0d1b2b] border border-[#e853dc] w-full max-w-4xl overflow-hidden shadow-[0_0_30px_rgba(232,83,220,0.3)]">
        <div className="relative">
          <div className="relative aspect-video bg-black flex items-center justify-center">
            {sourceError && fallbackUrl && (
              <p className="absolute inset-x-0 top-0 z-10 bg-black/80 px-4 py-2 text-center text-xs text-[#7a7f8e]">
                Playing fallback episode stream.
              </p>
            )}
            {isYouTube ? (
              <iframe
                key={activeUrl}
                width="100%"
                height="100%"
                src={activeUrl}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <video
                key={activeUrl}
                controls
                autoPlay
                className="w-full h-full"
                onError={() => {
                  if (!sourceError && fallbackUrl) setSourceError(true);
                }}
              >
                <source src={activeUrl} type="video/mp4" />
                Your browser does not support playing this video.
              </video>
            )}
          </div>
          <div className="p-4 flex items-center justify-between bg-[#050914] border-t border-[#2a2f3e]">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <Button onClick={onClose} variant="outline" className="border-[#e853dc] text-[#e853dc] hover:bg-[#e853dc]/10">
              Close Player
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function KidsCorner() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [activeVideo, setActiveVideo] = useState<{ url: string; fallbackUrl?: string; title: string } | null>(null);

  const episodes = [
    {
      id: "grandma-moves-in",
      title: "Grandma Moves In",
      duration: "Shorts Episode",
      videoUrl: PIXEL_DOT_FALLBACK_VIDEO_URL,
      description: "Pixel and Dot learn about sharing space, welcoming family, and finding extra love in everyday routines.",
      accent: "#e853dc",
    },
    {
      id: "look-closer",
      title: "Look Closer",
      duration: "Shorts Episode",
      videoUrl: PIXEL_DOT_FALLBACK_VIDEO_URL,
      description: "Pixel shows Dot how small details in nature and art unlock huge imaginative adventures.",
      accent: "#20cde2",
    },
  ];

  const activities = [
    {
      title: "Pixel & Dot Color Palette",
      type: "Coloring",
      description: "Fill in character outlines with electric cyan, hot magenta, and neon gold.",
      actionText: "Start Coloring",
      accent: "#20cde2",
    },
    {
      title: "Off-Grid Adventure",
      type: "Mini-Game",
      description: "Help Pixel navigate through District B and gather star badges for Dot.",
      actionText: "Play Now",
      accent: "#e853dc",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050914] text-[#a0a8c0]">
      <LivingWorldWeb variant="cyan" />

      {activeVideo && (
        <VideoPlayer
          videoUrl={activeVideo.url}
          fallbackUrl={activeVideo.fallbackUrl}
          title={activeVideo.title}
          onClose={() => setActiveVideo(null)}
        />
      )}

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8 sm:px-10 lg:px-14">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#20cde2] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#20cde2]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to AO Homeworld
          </Link>

          <Button onClick={() => navigate("/pixel-and-dot")} className="btn-neon-magenta text-xs">
            <BookOpen className="mr-2 h-4 w-4" />
            Pixel & Dot Series Hub
          </Button>
        </div>

        {/* Hero Section */}
        <section className="mt-12 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#20cde2]/40 bg-[#20cde2]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#20cde2]">
            <Heart className="h-3.5 w-3.5 text-[#e853dc]" />
            Family & Kids Sanctuary
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Anom's <span className="text-[#e853dc]">Corner</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#7a7f8e]">
            A safe, bright space for children to watch Pixel & Dot animated episodes, play Off-Grid games, and color inside the AO Living World.
          </p>
        </section>

        {/* Content Tabs */}
        <section className="mt-12">
          <Tabs defaultValue="episodes" className="w-full">
            <TabsList className="bg-[#0d1b2b] border border-[#2a2f3e] p-1 rounded-xl">
              <TabsTrigger value="episodes" className="data-[state=active]:bg-[#20cde2] data-[state=active]:text-[#050914] text-xs font-bold">
                <Play className="mr-2 h-4 w-4" /> Animated Episodes
              </TabsTrigger>
              <TabsTrigger value="activities" className="data-[state=active]:bg-[#e853dc] data-[state=active]:text-white text-xs font-bold">
                <Palette className="mr-2 h-4 w-4" /> Games & Coloring
              </TabsTrigger>
            </TabsList>

            {/* Episodes Tab */}
            <TabsContent value="episodes" className="mt-8">
              <div className="grid gap-6 md:grid-cols-2">
                {episodes.map((ep) => (
                  <div
                    key={ep.id}
                    className="rounded-2xl border border-[#2a2f3e] bg-[#0d1b2b]/80 p-6 backdrop-blur transition-all hover:border-[#20cde2]/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#d8ae55]">
                        {ep.duration}
                      </span>
                      <Sparkles className="h-4 w-4" style={{ color: ep.accent }} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{ep.title}</h3>
                    <p className="text-sm text-[#7a7f8e] mb-6">{ep.description}</p>
                    <Button
                      onClick={() => setActiveVideo({ url: ep.videoUrl, title: ep.title })}
                      className="w-full btn-neon-cyan gap-2 text-xs font-bold"
                    >
                      <Play className="h-4 w-4" /> Watch Episode
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="mt-8">
              <div className="grid gap-6 md:grid-cols-2">
                {activities.map((act) => (
                  <div
                    key={act.title}
                    className="rounded-2xl border border-[#2a2f3e] bg-[#0d1b2b]/80 p-6 backdrop-blur transition-all hover:border-[#e853dc]/50"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-[#d8ae55]">{act.type}</span>
                    <h3 className="text-xl font-bold text-white mt-1 mb-2">{act.title}</h3>
                    <p className="text-sm text-[#7a7f8e] mb-6">{act.description}</p>
                    <Button
                      onClick={() => navigate("/games")}
                      className="w-full btn-neon-magenta gap-2 text-xs font-bold"
                    >
                      <Gamepad2 className="h-4 w-4" /> {act.actionText}
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-[#2a2f3e] pt-8 text-center text-xs text-[#7a7f8e]">
          <p>&copy; 2026 Anom Artsy. Anom's Corner is created for safe family viewing.</p>
        </footer>
      </div>
    </main>
  );
}
