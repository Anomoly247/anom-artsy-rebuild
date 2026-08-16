import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Copy, Heart, Trophy, Zap, Star, Shield, Sparkles, Award, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useParams, useLocation } from "wouter";

export default function PublicProfile() {
  const { userId } = useParams<{ userId: string }>();
  const [, navigate] = useLocation();
  const [copied, setCopied] = useState(false);

  // Fetch public profile data
  const { data: profile, isLoading } = trpc.profile.getPublic.useQuery(
    { userId: parseInt(userId || "0") },
    { enabled: !!userId }
  );

  // Fetch achievements
  const { data: achievements = [] } = trpc.achievement.getUserAchievements.useQuery(
    undefined,
    { enabled: !!userId }
  );

  // Fetch decorations
  const { data: decorations = [] } = trpc.decorations.list.useQuery();

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/profile/${userId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Profile link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/profile/${userId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.name}'s Anom Artsy Profile`,
          text: `Check out ${profile?.name}'s profile on Anom Artsy!`,
          url: shareUrl,
        });
      } catch (err) {
        toast.error("Share failed");
      }
    } else {
      handleCopyLink();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-[#00eaff]">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#ff00cc] text-xl mb-4">Profile not found</p>
          <Button className="btn-neon-magenta" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#00eaff]">
      {/* Navigation */}
      <nav className="border-b border-[#2a2f3e] px-6 py-4 sticky top-0 bg-[#0b0e14]/95 backdrop-blur z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-[#7a7f8e] flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold neon-text-magenta">{profile.name}'s Profile</h1>
          <Button variant="ghost" className="text-[#00eaff]" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <Card
          className="bg-[#1a1f2e] border border-[#2a2f3e] p-8 mb-8"
          style={{
            boxShadow: "0 0 20px rgba(255, 0, 204, 0.3), 0 0 40px rgba(255, 0, 204, 0.1)",
          }}
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ff00cc] to-[#00eaff] flex items-center justify-center text-3xl">
                {profile.avatarUrl || "👤"}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#ff00cc] mb-2">{profile.name}</h2>
                <p className="text-[#7a7f8e] mb-4">{profile.bio || "No bio yet"}</p>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="text-[#00eaff] border-[#2a2f3e] gap-2"
                    onClick={handleCopyLink}
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                  <Button className="btn-neon-cyan gap-2" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                    Share Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card
            className="bg-[#1a1f2e] border border-[#2a2f3e] p-6"
            style={{
              boxShadow: "0 0 10px rgba(255, 0, 204, 0.3), 0 0 20px rgba(255, 0, 204, 0.1)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#7a7f8e] text-sm">Anom Coins</p>
                <p className="text-3xl font-bold text-[#ff00cc]">{profile.coins || 0}</p>
              </div>
              <Zap className="w-8 h-8 text-[#ff00cc] opacity-50" />
            </div>
          </Card>

          <Card
            className="bg-[#1a1f2e] border border-[#2a2f3e] p-6"
            style={{
              boxShadow: "0 0 10px rgba(0, 234, 255, 0.3), 0 0 20px rgba(0, 234, 255, 0.1)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#7a7f8e] text-sm">Level</p>
                <p className="text-3xl font-bold text-[#00eaff]">{profile.level || 1}</p>
              </div>
              <Trophy className="w-8 h-8 text-[#00eaff] opacity-50" />
            </div>
          </Card>

          <Card
            className="bg-[#1a1f2e] border border-[#2a2f3e] p-6"
            style={{
              boxShadow: "0 0 10px rgba(157, 78, 221, 0.3), 0 0 20px rgba(157, 78, 221, 0.1)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#7a7f8e] text-sm">Achievements</p>
                <p className="text-3xl font-bold text-[#9d4edd]">{achievements.length || 0}</p>
              </div>
              <Heart className="w-8 h-8 text-[#9d4edd] opacity-50" />
            </div>
          </Card>
        </div>

        {/* Achievements Section */}
        {achievements && achievements.length > 0 && (
          <Card
            className="bg-[#1a1f2e] border border-[#2a2f3e] p-6 mb-8"
            style={{
              boxShadow: "0 0 15px rgba(157, 78, 221, 0.4), 0 0 30px rgba(157, 78, 221, 0.2)",
            }}
          >
            <h3 className="text-xl font-bold text-[#9d4edd] mb-6 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Achievements & Awards
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement: any) => (
                <div key={achievement.id} className="p-4 bg-[#0b0e14] rounded-lg border border-[#2a2f3e] hover:border-[#ff00cc] transition-colors">
                  <div className="text-3xl mb-2">{achievement.icon || "🏆"}</div>
                  <p className="text-[#00eaff] font-bold text-sm">{achievement.name}</p>
                  <p className="text-[#7a7f8e] text-xs">{achievement.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Decorations & Cosmetics Section */}
        {decorations && decorations.length > 0 && (
          <Card
            className="bg-[#1a1f2e] border border-[#2a2f3e] p-6 mb-8"
            style={{
              boxShadow: "0 0 15px rgba(157, 78, 221, 0.4), 0 0 30px rgba(157, 78, 221, 0.2)",
            }}
          >
            <h3 className="text-xl font-bold text-[#9d4edd] mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Cosmetics & Decorations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {decorations.map((decoration: any) => (
                <div key={decoration.id} className="p-4 bg-[#0b0e14] rounded-lg border border-[#2a2f3e] hover:border-[#ff00cc] transition-colors cursor-pointer">
                  <div className="text-3xl mb-2">{decoration.icon || "✨"}</div>
                  <p className="text-[#00eaff] font-bold text-sm">{decoration.name}</p>
                  <p className="text-[#7a7f8e] text-xs">{decoration.type || "Cosmetic"}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Mood Glows Section */}
        <Card
          className="bg-[#1a1f2e] border border-[#2a2f3e] p-6 mb-8"
          style={{
            boxShadow: "0 0 15px rgba(0, 234, 255, 0.3), 0 0 30px rgba(0, 234, 255, 0.1)",
          }}
        >
          <h3 className="text-xl font-bold text-[#00eaff] mb-4 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Mood Glows
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {["😊", "🔥", "💜", "✨", "🌈", "💫"].map((emoji, i) => (
              <div key={i} className="p-3 bg-[#0b0e14] rounded-lg border border-[#2a2f3e] text-center hover:scale-110 transition-transform cursor-pointer">
                <div className="text-2xl">{emoji}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Neon Themes Section */}
        <Card
          className="bg-[#1a1f2e] border border-[#2a2f3e] p-6 mb-8"
          style={{
            boxShadow: "0 0 15px rgba(255, 0, 204, 0.3), 0 0 30px rgba(255, 0, 204, 0.1)",
          }}
        >
          <h3 className="text-xl font-bold text-[#ff00cc] mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Neon Themes
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-[#ff00cc] to-[#9d4edd] rounded-lg border-2 border-[#ff00cc] text-center cursor-pointer hover:scale-105 transition-transform">
              <p className="text-white font-bold">Magenta Dream</p>
              <p className="text-white text-xs opacity-75">Active</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-[#00eaff] to-[#0099ff] rounded-lg border border-[#2a2f3e] text-center hover:border-[#00eaff] transition-colors cursor-pointer hover:scale-105">
              <p className="text-white font-bold">Cyan Wave</p>
              <p className="text-white text-xs opacity-75">Available</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-[#9d4edd] to-[#ff00cc] rounded-lg border border-[#2a2f3e] text-center hover:border-[#9d4edd] transition-colors cursor-pointer hover:scale-105">
              <p className="text-white font-bold">Purple Haze</p>
              <p className="text-white text-xs opacity-75">Available</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-[#00ff88] to-[#00eaff] rounded-lg border border-[#2a2f3e] text-center hover:border-[#00ff88] transition-colors cursor-pointer hover:scale-105">
              <p className="text-white font-bold">Neon Green</p>
              <p className="text-white text-xs opacity-75">Available</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
