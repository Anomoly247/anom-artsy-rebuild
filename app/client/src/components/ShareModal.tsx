import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle,
  Mail,
  Copy,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface ShareUrls {
  twitter: string;
  facebook: string;
  linkedin: string;
  whatsapp: string;
  email: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  shareUrls: ShareUrls;
  shareUrl: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  title,
  description,
  shareUrls,
  shareUrl,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const platforms = [
    {
      id: "twitter",
      name: "Twitter",
      icon: Twitter,
      color: "#1DA1F2",
      url: shareUrls.twitter,
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "#1877F2",
      url: shareUrls.facebook,
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      color: "#0A66C2",
      url: shareUrls.linkedin,
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: MessageCircle,
      color: "#25D366",
      url: shareUrls.whatsapp,
    },
    {
      id: "email",
      name: "Email",
      icon: Mail,
      color: "#EA4335",
      url: shareUrls.email,
    },
  ];

  const handleShare = (url: string, platform: string) => {
    window.open(url, "_blank", "width=600,height=400");
    toast.success(`Shared to ${platform}!`);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="bg-[#1a1f2e] border border-[#ff00cc] w-full max-w-md">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#ff00cc]">Share</h2>
            <button
              onClick={onClose}
              className="text-[#7a7f8e] hover:text-[#00eaff] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Title & Description */}
          <div className="mb-6 p-4 bg-[#0b0e14] rounded-lg border border-[#2a2f3e]">
            <p className="text-sm text-[#7a7f8e] mb-2">Share this:</p>
            <h3 className="text-lg font-bold text-[#00eaff] mb-2">{title}</h3>
            {description && (
              <p className="text-sm text-[#7a7f8e]">{description}</p>
            )}
          </div>

          {/* Copy Link Section */}
          <div className="mb-6">
            <p className="text-sm font-bold text-[#7a7f8e] mb-3">Direct Link</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-[#0b0e14] border border-[#2a2f3e] rounded-lg text-[#00eaff] text-sm"
              />
              <Button
                onClick={handleCopyLink}
                className={`${
                  copied
                    ? "bg-[#00eaff] text-black"
                    : "bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black"
                } font-bold`}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Social Platforms */}
          <div className="mb-6">
            <p className="text-sm font-bold text-[#7a7f8e] mb-3">Share To</p>
            <div className="grid grid-cols-2 gap-3">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <button
                    key={platform.id}
                    onClick={() => handleShare(platform.url, platform.name)}
                    className="flex items-center gap-2 p-3 bg-[#0b0e14] border border-[#2a2f3e] rounded-lg hover:border-[#00eaff] transition-colors group"
                  >
                    <Icon
                      className="w-5 h-5 group-hover:text-[#00eaff]"
                      style={{ color: platform.color }}
                    />
                    <span className="text-sm font-bold text-[#7a7f8e] group-hover:text-[#00eaff]">
                      {platform.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Close Button */}
          <Button
            onClick={onClose}
            className="w-full bg-[#2a2f3e] hover:bg-[#3a3f4e] text-[#7a7f8e] font-bold"
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}
