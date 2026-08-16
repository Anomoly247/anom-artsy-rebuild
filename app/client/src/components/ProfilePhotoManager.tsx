import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Trash2, Copy, Share2, Download, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  addProfilePhoto,
  updatePhotoSets,
  removeProfilePhoto,
  loadProfileSettings,
  generateShareableProfileUrl,
  exportProfileAsJSON,
} from "@/lib/profileSettings";
import type { ProfilePhoto } from "@/lib/profileSettings";

export default function ProfilePhotoManager() {
  const [photos, setPhotos] = useState(loadProfileSettings().photos);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        const newPhoto: ProfilePhoto = {
          id: `photo_${Date.now()}`,
          url: base64,
          uploadedAt: Date.now(),
          sets: {
            isProfileImage: photos.length === 0, // Set as profile image if first photo
            isBackgroundImage: false,
            isDefault: false,
          },
        };

        const updated = addProfilePhoto(newPhoto);
        setPhotos(updated.photos);
        toast.success("Photo uploaded successfully!");

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Failed to upload photo");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetAsProfileImage = (photoId: string) => {
    const updated = updatePhotoSets(photoId, { isProfileImage: true });
    setPhotos(updated.photos);
    toast.success("Set as profile image!");
  };

  const handleSetAsBackgroundImage = (photoId: string) => {
    const updated = updatePhotoSets(photoId, { isBackgroundImage: true });
    setPhotos(updated.photos);
    toast.success("Set as background image!");
  };

  const handleSetAsDefault = (photoId: string) => {
    const updated = updatePhotoSets(photoId, { isDefault: true });
    setPhotos(updated.photos);
    toast.success("Set as default!");
  };

  const handleDeletePhoto = (photoId: string) => {
    const updated = removeProfilePhoto(photoId);
    setPhotos(updated.photos);
    toast.success("Photo deleted!");
  };

  const handleShareProfile = () => {
    const shareUrl = generateShareableProfileUrl();
    navigator.clipboard.writeText(shareUrl);
    toast.success("Profile share link copied!");
  };

  const handleExportProfile = () => {
    const json = exportProfileAsJSON();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `profile_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Profile exported!");
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="bg-[#1a1f2e] border-2 border-[#ff00cc] p-6">
        <h3 className="text-xl font-bold text-[#ff00cc] mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Photo Library
        </h3>

        <div className="mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            disabled={isUploading}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black font-bold flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? "Uploading..." : "Upload Photo"}
          </Button>
        </div>

        {/* Photos Grid */}
        {photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative group rounded-lg overflow-hidden border-2 border-[#00eaff]/30 hover:border-[#00eaff] transition-all"
              >
                {/* Photo */}
                <img
                  src={photo.url}
                  alt="Profile photo"
                  className="w-full h-32 object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  <div className="flex gap-1 flex-wrap justify-center">
                    {photo.sets.isProfileImage && (
                      <Badge className="bg-[#ff00cc] text-black text-xs">Profile</Badge>
                    )}
                    {photo.sets.isBackgroundImage && (
                      <Badge className="bg-[#00eaff] text-black text-xs">Background</Badge>
                    )}
                    {photo.sets.isDefault && (
                      <Badge className="bg-[#ffd700] text-black text-xs">Default</Badge>
                    )}
                  </div>

                  <div className="flex gap-1 flex-wrap justify-center">
                    {!photo.sets.isProfileImage && (
                      <Button
                        size="sm"
                        onClick={() => handleSetAsProfileImage(photo.id)}
                        className="bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black text-xs h-6 px-2"
                      >
                        Profile
                      </Button>
                    )}
                    {!photo.sets.isBackgroundImage && (
                      <Button
                        size="sm"
                        onClick={() => handleSetAsBackgroundImage(photo.id)}
                        className="bg-[#00eaff] hover:bg-[#00eaff]/80 text-black text-xs h-6 px-2"
                      >
                        Background
                      </Button>
                    )}
                    {!photo.sets.isDefault && (
                      <Button
                        size="sm"
                        onClick={() => handleSetAsDefault(photo.id)}
                        className="bg-[#ffd700] hover:bg-[#ffd700]/80 text-black text-xs h-6 px-2"
                      >
                        Default
                      </Button>
                    )}
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs h-6 px-2 w-full"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[#7a7f8e]">
            <p>No photos yet. Upload your first photo to get started!</p>
          </div>
        )}
      </Card>

      {/* Sharing & Export Section */}
      <Card className="bg-[#1a1f2e] border-2 border-[#00eaff] p-6">
        <h3 className="text-xl font-bold text-[#00eaff] mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Share & Sync
        </h3>

        <div className="space-y-3">
          <Button
            onClick={handleShareProfile}
            className="w-full bg-[#00eaff] hover:bg-[#00eaff]/80 text-black font-bold flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy Shareable Profile Link
          </Button>

          <Button
            onClick={handleExportProfile}
            className="w-full bg-[#ffd700] hover:bg-[#ffd700]/80 text-black font-bold flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Profile as JSON
          </Button>

          <div className="bg-[#0b0e14] p-4 rounded-lg border border-[#2a2f3e]">
            <p className="text-sm text-[#7a7f8e] mb-2">
              <strong>Share your identity:</strong> Copy the link above and share it with friends or on social media to sync your profile settings across platforms.
            </p>
            <p className="text-xs text-[#7a7f8e]">
              Recipients can import your profile colors, theme, and photo library to match your Anom Artsy identity.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
