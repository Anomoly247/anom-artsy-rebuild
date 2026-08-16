import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Share2, Heart, Star, Zap } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";
import { PIXEL_DOT_FALLBACK_VIDEO_ID } from "../../../shared/videoSources";

interface Episode {
  id: string;
  title: string;
  videoId?: string;
  fallbackVideoId?: string;
  storageUrl?: string;
  duration: string;
  views: number;
  postedAt: string;
  description: string;
  featured?: boolean;
}

const episodes: Episode[] = [
  {
    id: "1",
    title: "Pixel & Dot's Full Story | Anom's Corner",
    storageUrl: "/manus-storage/v8_pixel_dot_full_story_final_45228357.mp4",
    fallbackVideoId: PIXEL_DOT_FALLBACK_VIDEO_ID,
    duration: "Full Story",
    views: 1,
    postedAt: "Today",
    description: "The complete Pixel & Dot story. Join these two characters on their epic journey through a neon-powered universe filled with mystery, wonder, and unforgettable moments. This is the definitive Anom's Corner experience.",
    featured: true,
  },
  {
    id: "2",
    title: "Pixel & Dot's New Adventure | Anom's Corner",
    videoId: "0pBrQUqU0ig",
    duration: "1:50",
    views: 18,
    postedAt: "1 month ago",
    description: "Join Pixel and Dot on their first adventure in Anom's Corner! Discover their neon-powered world and the mysteries that await.",
  },
];

export default function AnomsCorner() {
  const [selectedEpisode, setSelectedEpisode] = useState<Episode>(episodes[0]);
  const [liked, setLiked] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    setVideoError(false);
  }, [selectedEpisode.id]);

  const handleShare = () => {
    const fallbackVideoId = selectedEpisode.videoId ?? selectedEpisode.fallbackVideoId;
    const url = selectedEpisode.storageUrl && !videoError
      ? `${window.location.origin}${selectedEpisode.storageUrl}`
      : fallbackVideoId
        ? `https://www.youtube.com/watch?v=${fallbackVideoId}`
        : window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Episode link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-[#0b0e14]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#1a1f2e] to-[#0b0e14] py-12">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, #ff00cc 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, #00eaff 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span style={{ color: "#ff00cc" }}>Anom</span>
              <span style={{ color: "#00eaff" }}>'s</span>
              <span className="text-white"> Corner</span>
            </h1>
            <p className="text-xl text-[#7a7f8e] mb-6">
              Digital Storybooks featuring <span style={{ color: "#ff00cc" }}>Pixel</span> & <span style={{ color: "#00eaff" }}>Dot</span>
            </p>
            <p className="text-[#7a7f8e] max-w-2xl mx-auto">
              Step into a neon-powered universe where two characters navigate surreal landscapes, uncover mysteries, and create unforgettable moments.
            </p>
          </div>

          {/* Character Badges */}
          <div className="flex justify-center gap-6 mb-12">
            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-2xl border-2"
                style={{
                  borderColor: "#ff00cc",
                  background: "linear-gradient(135deg, #ff00cc20 0%, #ff00cc10 100%)",
                  color: "#ff00cc",
                }}
              >
                P
              </div>
              <p className="font-bold text-white">Pixel</p>
              <p className="text-sm text-[#7a7f8e]">The Creator</p>
            </div>

            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-2xl border-2"
                style={{
                  borderColor: "#00eaff",
                  background: "linear-gradient(135deg, #00eaff20 0%, #00eaff10 100%)",
                  color: "#00eaff",
                }}
              >
                D
              </div>
              <p className="font-bold text-white">Dot</p>
              <p className="text-sm text-[#7a7f8e]">The Explorer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] overflow-hidden p-6">
              {/* Featured Video Player */}
              <div className="mb-6">
                <div className="relative w-full bg-black rounded-lg overflow-hidden border border-[#2a2f3e]">
                  {selectedEpisode.storageUrl && !videoError ? (
                    <video
                      className="w-full h-auto"
                      controls
                      autoPlay
                      style={{ maxHeight: "600px" }}
                      onError={() => setVideoError(true)}
                    >
                      <source src={selectedEpisode.storageUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (selectedEpisode.videoId || selectedEpisode.fallbackVideoId) ? (
                    <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                      {videoError && selectedEpisode.storageUrl && (
                        <p className="absolute inset-x-0 top-0 z-10 bg-black/80 px-4 py-2 text-center text-xs text-[#7a7f8e]">
                          The hosted copy is unavailable, so the public Pixel &amp; Dot episode is playing instead.
                        </p>
                      )}
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${selectedEpisode.videoId ?? selectedEpisode.fallbackVideoId}`}
                        title={selectedEpisode.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="flex min-h-64 items-center justify-center bg-black px-6 text-center text-[#7a7f8e]">
                      <p>This episode’s video is temporarily unavailable. Please try another episode.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Episode Info */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedEpisode.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-[#7a7f8e]">
                    <span>{selectedEpisode.views} views</span>
                    <span>•</span>
                    <span>{selectedEpisode.postedAt}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-[#7a7f8e] mb-6 leading-relaxed">{selectedEpisode.description}</p>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  className="flex-1 btn-neon-magenta flex items-center justify-center gap-2"
                  onClick={() => setLiked(!liked)}
                >
                  <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                  {liked ? "Liked" : "Like"}
                </Button>
                <Button
                  className="flex-1 btn-neon-cyan flex items-center justify-center gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar - Episode List */}
          <div>
            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
              <h3 className="text-xl font-bold text-white mb-4">Episodes</h3>
              <div className="space-y-3">
                {episodes.map((episode) => (
                  <button
                    key={episode.id}
                    onClick={() => setSelectedEpisode(episode)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedEpisode.id === episode.id
                        ? "border-[#ff00cc] bg-[#ff00cc]/10"
                        : "border-[#2a2f3e] bg-[#0b0e14] hover:border-[#ff00cc]"
                    }`}
                  >
                    <p className="font-semibold text-white text-sm mb-1">{episode.title}</p>
                    <p className="text-xs text-[#7a7f8e]">{episode.duration}</p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Series Stats */}
            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6 mt-6">
              <h3 className="text-lg font-bold text-white mb-4">Series Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#7a7f8e] text-sm">Episodes</span>
                  <span className="text-[#ff00cc] font-bold">{episodes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7a7f8e] text-sm">Total Views</span>
                  <span className="text-[#00eaff] font-bold">{episodes.reduce((a, b) => a + b.views, 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7a7f8e] text-sm">Featured</span>
                  <Badge className="bg-[#ff00cc] text-white">New</Badge>
                </div>
              </div>
            </Card>

            {/* Character Links */}
            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6 mt-6">
              <h3 className="text-lg font-bold text-white mb-4">Meet the Characters</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start border-[#ff00cc] text-[#ff00cc] hover:bg-[#ff00cc]/10"
                  onClick={() => window.location.href = "/characters/pixel"}
                >
                  <span style={{ color: "#ff00cc" }}>→</span> Pixel's Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-[#00eaff] text-[#00eaff] hover:bg-[#00eaff]/10"
                  onClick={() => window.location.href = "/characters/dot"}
                >
                  <span style={{ color: "#00eaff" }}>→</span> Dot's Profile
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
