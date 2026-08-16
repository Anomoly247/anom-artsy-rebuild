import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { User, Zap, Award, Palette, Settings, LogOut, Edit2, Save, Share2, Copy, Check, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import ProfilePhotoManager from "@/components/ProfilePhotoManager";
import IdentitySyncCard from "@/components/IdentitySyncCard";
import ProfileCustomizer from "@/components/ProfileCustomizer";
import { useAuth } from "@/_core/hooks/useAuth";

const THEME_OPTIONS = [
  { id: "magenta", name: "Neon Magenta", color: "#ff00cc", preview: "🌸" },
  { id: "cyan", name: "Neon Cyan", color: "#00eaff", preview: "💎" },
  { id: "purple", name: "Neon Purple", color: "#b000ff", preview: "👾" },
];

const NAME_COLORS = [
  { id: "#ffffff", name: "White", color: "#ffffff" },
  { id: "#ff00cc", name: "Magenta", color: "#ff00cc" },
  { id: "#00eaff", name: "Cyan", color: "#00eaff" },
  { id: "#b000ff", name: "Purple", color: "#b000ff" },
  { id: "#ffd700", name: "Gold (VIP)", color: "#ffd700" },
  { id: "#c0c0c0", name: "Silver (VIP Max)", color: "#c0c0c0" },
];

export default function Profile() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"dashboard" | "customize" | "settings" | "share">("dashboard");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>("magenta");
  const [selectedNameColor, setSelectedNameColor] = useState<string>("#00eaff");
  const [copied, setCopied] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    bio: "",
  });

  // Fetch user profile with error handling
  const { data: profile, isLoading: profileLoading, error: profileError } = trpc.profile.getMe.useQuery(undefined, {
    enabled: !!user,
  });

  // Load settings when profile loads
  useEffect(() => {
    if (profile?.neonTheme) setSelectedTheme(profile.neonTheme);
    if (profile?.nameColor) setSelectedNameColor(profile.nameColor);
    if (profile?.bio) setEditData(prev => ({ ...prev, bio: profile.bio || "" }));
  }, [profile]);

  // Mutations
  const updateThemeMutation = trpc.settings.updateTheme.useMutation();
  const updateNameColorMutation = trpc.settings.updateNameColor.useMutation();
  const updateBioMutation = trpc.settings.updateBio.useMutation();

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] text-[#00eaff] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show error state if profile fails to load
  if (profileError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0b0e14] to-[#1a1f2e] flex items-center justify-center p-4">
        <Card className="border-2 border-[#ff00cc] bg-[#0b0e14]/80 p-8 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-[#ff00cc]" />
            <h2 className="text-xl font-bold text-[#ff00cc]">Unable to Load Profile</h2>
          </div>
          <p className="text-[#7a7f8e] text-sm mb-6">
            We're having trouble connecting to your profile data. This might be a temporary issue. Please try again later or contact support if the problem persists.
          </p>
          <div className="flex gap-3">
            <Button 
              onClick={() => window.location.reload()} 
              className="flex-1 bg-[#00eaff] hover:bg-[#00eaff]/80 text-black font-bold"
            >
              Retry
            </Button>
            <Button 
              onClick={() => navigate("/")} 
              className="flex-1 bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black font-bold"
            >
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0b0e14] text-[#00eaff] flex items-center justify-center">
        <Card className="border-2 border-[#ff00cc] bg-[#0b0e14]/80 p-8">
          <p className="text-[#ff00cc] mb-4">Please sign in to view your profile</p>
          <Button onClick={() => navigate("/")} className="bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black">
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  const handleUpdateProfile = async () => {
    try {
      await updateBioMutation.mutateAsync({
        bio: editData.bio,
      });
      toast.success("Profile updated!");
      setIsEditingProfile(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleThemeChange = async (theme: string) => {
    setSelectedTheme(theme);
    try {
      await updateThemeMutation.mutateAsync({ theme: theme as "magenta" | "cyan" | "purple" });
      toast.success("Theme updated!");
    } catch (error) {
      toast.error("Failed to update theme");
    }
  };

  const handleNameColorChange = async (color: string) => {
    setSelectedNameColor(color);
    try {
      await updateNameColorMutation.mutateAsync({ nameColor: color });
      toast.success("Name color updated!");
    } catch (error) {
      toast.error("Failed to update name color");
    }
  };

  const profileUrl = `${window.location.origin}/profile/${user?.id}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast.success("Profile link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareProfile = (platform: string) => {
    const message = `Check out my Anom Artsy profile: ${profileUrl}`;
    const encodedMessage = encodeURIComponent(message);
    
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400");
      toast.success(`Shared on ${platform}!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0e14] to-[#1a1f2e]">
      {/* Header */}
      <div className="border-b border-[#2a2f3e] bg-[#0b0e14]/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-[#ff00cc]">My Profile</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/")} className="text-[#00eaff] border-[#00eaff] hover:bg-[#00eaff]/10">
                ← Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: "dashboard", label: "Dashboard", icon: "📊" },
            { id: "customize", label: "Customize", icon: "🎨" },
            { id: "settings", label: "Settings", icon: "⚙️" },
            { id: "share", label: "Share", icon: "📤" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg border-2 font-bold transition-all ${
                activeTab === tab.id
                  ? "border-[#ff00cc] bg-[#ff00cc]/20 text-[#ff00cc]"
                  : "border-[#00eaff] bg-transparent text-[#00eaff] hover:bg-[#00eaff]/10"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#7a7f8e] text-sm">Level</p>
                    <p className="text-4xl font-bold text-[#ffd700]">{profile?.level || 1}</p>
                  </div>
                  <Zap className="w-12 h-12 text-[#ffd700] opacity-70" />
                </div>
              </Card>

              <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#7a7f8e] text-sm">Glow Points</p>
                    <p className="text-4xl font-bold text-[#00ffff]">{Number(profile?.anomCoinBalance || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })} GP</p>
                  </div>
                  <Award className="w-12 h-12 text-[#ffd700] opacity-70" />
                </div>
              </Card>
            </div>

            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
              <h3 className="text-xl font-bold text-[#ff00cc] mb-4">Bio</h3>
              <p className="text-[#7a7f8e]">{profile?.bio || "No bio yet. Add one in the Customize tab!"}</p>
            </Card>
          </div>
        )}

        {/* Customize Tab */}
        {activeTab === "customize" && (
          <div className="space-y-6">
            <Card className="bg-[#1a1f2e] border border-[#00eaff] p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#00eaff]">Live Profile Studio</h3>
                  <p className="text-sm text-[#7a7f8e]">Preview your profile identity, theme, badges, and bio together before saving.</p>
                </div>
                <Button onClick={() => setIsCustomizerOpen(true)} className="bg-[#00eaff] font-bold text-black hover:bg-[#00eaff]/80">
                  <Palette className="mr-2 h-4 w-4" />
                  Open Live Customizer
                </Button>
              </div>
            </Card>

            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
              <h3 className="text-xl font-bold text-[#ff00cc] mb-4">Neon Theme</h3>
              <div className="grid grid-cols-3 gap-4">
                {THEME_OPTIONS.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedTheme === theme.id
                        ? "border-[#ff00cc] bg-[#ff00cc]/20"
                        : "border-[#2a2f3e] hover:border-[#ff00cc]"
                    }`}
                  >
                    <div className="text-3xl mb-2">{theme.preview}</div>
                    <p className="text-sm text-[#7a7f8e]">{theme.name}</p>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
              <h3 className="text-xl font-bold text-[#ff00cc] mb-4">Name Color</h3>
              <div className="grid grid-cols-3 gap-4">
                {NAME_COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleNameColorChange(color.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedNameColor === color.id
                        ? "border-[#ff00cc] bg-[#ff00cc]/20"
                        : "border-[#2a2f3e] hover:border-[#ff00cc]"
                    }`}
                  >
                    <div 
                      className="w-8 h-8 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: color.id }}
                    />
                    <p className="text-sm text-[#7a7f8e]">{color.name}</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
              <h3 className="text-xl font-bold text-[#ff00cc] mb-4">Color & Theme Settings</h3>
              <p className="text-[#7a7f8e] text-sm mb-4">
                Choose your signature neon accent color and theme, just like creating a private lounge.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { id: "magenta", name: "Neon Magenta", color: "#ff00cc", preview: "🌸" },
                  { id: "cyan", name: "Neon Cyan", color: "#00eaff", preview: "💎" },
                  { id: "purple", name: "Neon Purple", color: "#b000ff", preview: "👾" },
                ].map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setSelectedTheme(theme.id);
                      updateThemeMutation.mutate({ theme: theme.id as any }, {
                        onSuccess: () => toast.success(`Neon theme updated to ${theme.name}!`),
                        onError: () => toast.error("Failed to update neon theme")
                      });
                    }}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      selectedTheme === theme.id
                        ? "border-[#ff00cc] bg-[#ff00cc]/20 text-[#ff00cc]"
                        : "border-[#2a2f3e] hover:border-[#ff00cc] text-[#7a7f8e]"
                    }`}
                  >
                    <div className="text-2xl mb-1">{theme.preview}</div>
                    <p className="text-xs font-bold">{theme.name}</p>
                  </button>
                ))}
              </div>

              <h4 className="text-lg font-bold text-[#00eaff] mb-3">Name Accent Color</h4>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {NAME_COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => {
                      setSelectedNameColor(color.id);
                      updateNameColorMutation.mutate({ nameColor: color.id }, {
                        onSuccess: () => toast.success(`Name color updated!`),
                        onError: () => toast.error("Failed to update name color")
                      });
                    }}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${
                      selectedNameColor === color.id
                        ? "border-[#00eaff] bg-[#00eaff]/20"
                        : "border-[#2a2f3e] hover:border-[#00eaff]"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: color.color }} />
                    <span className="text-xs text-[#7a7f8e]">{color.name}</span>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
              <h3 className="text-xl font-bold text-[#ff00cc] mb-4">Edit Bio</h3>
              {isEditingProfile ? (
                <div className="space-y-4">
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    className="w-full bg-[#0b0e14] border border-[#2a2f3e] rounded-lg p-3 text-[#00eaff] placeholder-[#7a7f8e] focus:border-[#ff00cc] focus:outline-none"
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateProfile} className="flex-1 bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black font-bold">
                      Save Bio
                    </Button>
                    <Button onClick={() => setIsEditingProfile(false)} variant="outline" className="flex-1 text-[#00eaff] border-[#00eaff]">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={() => setIsEditingProfile(true)} className="w-full bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black font-bold">
                  Edit Bio
                </Button>
              )}
            </Card>
          </div>
        )}

        {/* Share Tab */}
        {activeTab === "share" && (
          <div className="space-y-6">
            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
              <h3 className="text-xl font-bold text-[#ff00cc] mb-4">Share Your Profile</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={profileUrl}
                    readOnly
                    className="bg-[#0b0e14] border border-[#2a2f3e] text-[#00eaff]"
                  />
                  <Button
                    onClick={handleCopyLink}
                    className="bg-[#00eaff] hover:bg-[#00eaff]/80 text-black font-bold"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { platform: "twitter", icon: "𝕏", label: "Twitter" },
                    { platform: "facebook", icon: "f", label: "Facebook" },
                    { platform: "linkedin", icon: "in", label: "LinkedIn" },
                  ].map((social) => (
                    <Button
                      key={social.platform}
                      onClick={() => handleShareProfile(social.platform)}
                      className="bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black font-bold"
                    >
                      {social.icon}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
      <ProfileCustomizer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        userId={user.id}
      />
    </div>
  );
}
