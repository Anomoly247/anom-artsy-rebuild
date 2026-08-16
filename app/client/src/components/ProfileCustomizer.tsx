import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUploader from "./ImageUploader";
import DecorationShowcase from "./DecorationShowcase";
import {
  Camera,
  Image as ImageIcon,
  Palette,
  Settings,
  Save,
  X,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const THEME_OPTIONS = [
  { id: "magenta", name: "Neon Magenta", color: "#ff00cc", emoji: "🌸" },
  { id: "cyan", name: "Neon Cyan", color: "#00eaff", emoji: "💎" },
  { id: "purple", name: "Neon Purple", color: "#b000ff", emoji: "👾" },
] as const;

const NAME_COLOR_OPTIONS = [
  { id: "#ffffff", name: "White" },
  { id: "#ff00cc", name: "Magenta" },
  { id: "#00eaff", name: "Cyan" },
  { id: "#b000ff", name: "Purple" },
  { id: "#ffd700", name: "Gold" },
  { id: "#c0c0c0", name: "Silver" },
] as const;

interface ProfileCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

export default function ProfileCustomizer({
  isOpen,
  onClose,
  userId,
}: ProfileCustomizerProps) {
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [profileLayout, setProfileLayout] = useState<"compact" | "full" | "showcase">("full");
  const [isPublic, setIsPublic] = useState(true);
  const [showImageUploader, setShowImageUploader] = useState<"profile" | "background" | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<(typeof THEME_OPTIONS)[number]["id"]>("magenta");
  const [selectedNameColor, setSelectedNameColor] = useState("#00eaff");
  const { data: profile } = trpc.profile.getMe.useQuery(undefined, { enabled: isOpen });
  const updateTheme = trpc.settings.updateTheme.useMutation();
  const updateNameColor = trpc.settings.updateNameColor.useMutation();
  const updateProfile = trpc.profile.updateProfile.useMutation();

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || "");
      setSelectedTheme((profile.neonTheme as (typeof THEME_OPTIONS)[number]["id"]) || "magenta");
      setSelectedNameColor(profile.nameColor || "#00eaff");
    }
  }, [profile]);

  if (!isOpen) return null;

  const activeTheme = THEME_OPTIONS.find((theme) => theme.id === selectedTheme) || THEME_OPTIONS[0];

  const handleSave = async () => {
    try {
      await Promise.all([
        updateProfile.mutateAsync({ bio }),
        updateTheme.mutateAsync({ theme: selectedTheme }),
        updateNameColor.mutateAsync({ nameColor: selectedNameColor }),
      ]);
      toast.success("Profile customization saved!");
      onClose();
    } catch (error) {
      toast.error("Error saving profile");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="bg-[#1a1f2e] border border-[#ff00cc] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#ff00cc]">Customize Profile</h2>
            <button
              onClick={onClose}
              className="text-[#7a7f8e] hover:text-[#00eaff] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="pictures" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-[#0b0e14] border border-[#2a2f3e]">
              <TabsTrigger value="pictures" className="text-xs">
                <Camera className="w-4 h-4 mr-2" />
                Pictures
              </TabsTrigger>
              <TabsTrigger value="info" className="text-xs">
                <Settings className="w-4 h-4 mr-2" />
                Info
              </TabsTrigger>
              <TabsTrigger value="theme" className="text-xs">
                <Palette className="w-4 h-4 mr-2" />
                Theme
              </TabsTrigger>
              <TabsTrigger value="decorations" className="text-xs">
                <ImageIcon className="w-4 h-4 mr-2" />
                Badges
              </TabsTrigger>
            </TabsList>

            {/* Pictures Tab */}
            <TabsContent value="pictures" className="space-y-4 mt-4">
              <div className="space-y-4">
                {/* Profile Picture */}
                <div>
                  <p className="font-bold text-[#00eaff] mb-3">Profile Picture</p>
                  {showImageUploader === "profile" ? (
                    <ImageUploader
                      onImageSelect={(file: File) => {
                        setProfilePictureFile(file);
                        setShowImageUploader(null);
                      }}
                      onClose={() => setShowImageUploader(null)}
                      title="Upload Profile Picture"
                      description="Choose a square image for best results"
                    />
                  ) : (
                    <Button
                      onClick={() => setShowImageUploader("profile")}
                      className="w-full bg-[#b000ff] hover:bg-[#b000ff]/80 text-white font-bold"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Upload Profile Picture
                    </Button>
                  )}
                </div>

                {/* Background Image */}
                <div>
                  <p className="font-bold text-[#00eaff] mb-3">Background Image</p>
                  {showImageUploader === "background" ? (
                    <ImageUploader
                      onImageSelect={(file: File) => {
                        setBackgroundImageFile(file);
                        setShowImageUploader(null);
                      }}
                      onClose={() => setShowImageUploader(null)}
                      title="Upload Background Image"
                      description="Choose a wide image (16:9 aspect ratio recommended)"
                    />
                  ) : (
                    <Button
                      onClick={() => setShowImageUploader("background")}
                      className="w-full bg-[#b000ff] hover:bg-[#b000ff]/80 text-white font-bold"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Upload Background Image
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Info Tab */}
            <TabsContent value="info" className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-bold text-[#00eaff] mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  maxLength={500}
                  className="w-full h-24 px-3 py-2 bg-[#0b0e14] border border-[#2a2f3e] rounded-lg text-[#00eaff] placeholder-[#7a7f8e] focus:border-[#ff00cc] focus:outline-none resize-none"
                />
                <p className="text-xs text-[#7a7f8e] mt-1">
                  {bio.length}/500 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#00eaff] mb-2">
                  Profile Visibility
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={isPublic}
                      onChange={() => setIsPublic(true)}
                      className="w-4 h-4"
                    />
                    <span className="text-[#7a7f8e]">Public</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!isPublic}
                      onChange={() => setIsPublic(false)}
                      className="w-4 h-4"
                    />
                    <span className="text-[#7a7f8e]">Private</span>
                  </label>
                </div>
              </div>
            </TabsContent>

            {/* Theme Tab */}
            <TabsContent value="theme" className="space-y-5 mt-4">
              <div>
                <label className="block text-sm font-bold text-[#00eaff] mb-3">
                  Live Neon Theme Preview
                </label>
                <div
                  className="rounded-xl border-2 bg-[#0b0e14] p-5 transition-all duration-200"
                  style={{ borderColor: activeTheme.color, boxShadow: `0 0 24px ${activeTheme.color}44` }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full border-2 text-2xl"
                        style={{ borderColor: activeTheme.color, backgroundColor: `${activeTheme.color}22` }}
                      >
                        {activeTheme.emoji}
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: selectedNameColor }}>
                          {"Your Sanctuary Name"}
                        </p>
                        <p className="text-xs text-[#7a7f8e]">{activeTheme.name}</p>
                      </div>
                    </div>
                    <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ color: activeTheme.color, backgroundColor: `${activeTheme.color}18` }}>
                      LIVE
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-[#7a7f8e]">
                    Try a theme or name color below. The preview updates instantly; Save Changes applies it to your profile.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#00eaff] mb-3">Neon Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {THEME_OPTIONS.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedTheme(theme.id)}
                      className="rounded-lg border-2 p-3 text-center transition-all"
                      style={{
                        borderColor: selectedTheme === theme.id ? theme.color : "#2a2f3e",
                        backgroundColor: selectedTheme === theme.id ? `${theme.color}22` : "#0b0e14",
                        color: selectedTheme === theme.id ? theme.color : "#7a7f8e",
                      }}
                    >
                      <div className="text-2xl mb-1">{theme.emoji}</div>
                      <span className="text-xs font-bold">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#00eaff] mb-3">Name Color</label>
                <div className="grid grid-cols-3 gap-3">
                  {NAME_COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSelectedNameColor(color.id)}
                      className="flex items-center gap-2 rounded-lg border-2 p-2 text-left transition-all"
                      style={{ borderColor: selectedNameColor === color.id ? color.id : "#2a2f3e" }}
                    >
                      <span className="h-5 w-5 shrink-0 rounded-full border border-white/20" style={{ backgroundColor: color.id }} />
                      <span className="truncate text-xs text-[#7a7f8e]">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#00eaff] mb-3">Profile Layout</label>
                <div className="grid grid-cols-3 gap-3">
                  {["compact", "full", "showcase"].map((layout) => (
                    <button
                      key={layout}
                      type="button"
                      onClick={() => setProfileLayout(layout as any)}
                      className={`p-3 rounded-lg border-2 transition-colors capitalize font-bold ${
                        profileLayout === layout
                          ? "border-[#ff00cc] bg-[#ff00cc]/20 text-[#ff00cc]"
                          : "border-[#2a2f3e] bg-[#0b0e14] text-[#7a7f8e] hover:border-[#00eaff]"
                      }`}
                    >
                      {layout}
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Decorations Tab */}
            <TabsContent value="decorations" className="space-y-4 mt-4">
              {profile?.decorationPackageIds && profile.decorationPackageIds.length > 0 ? (
                <DecorationShowcase
                  decorations={profile.decorationPackageIds.map((id: number) => ({
                    id,
                    name: `Decoration ${id}`,
                    category: "badge" as const,
                    imageUrl: "",
                    rarity: "common" as const,
                  }))}
                  title="Your Decorations"
                />
              ) : (
                <Card className="bg-[#0b0e14] border border-[#2a2f3e] p-4 text-center">
                  <p className="text-[#7a7f8e]">
                    No decorations yet. Earn them through gameplay!
                  </p>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 text-[#7a7f8e] border-[#2a2f3e]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateProfile.isPending}
              className="flex-1 bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black font-bold disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
