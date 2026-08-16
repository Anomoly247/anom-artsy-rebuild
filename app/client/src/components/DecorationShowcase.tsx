import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Heart, Smile, Shield, Sparkles } from "lucide-react";

interface Decoration {
  id: number;
  name: string;
  category: "badge" | "achievement" | "social_good" | "emote";
  imageUrl: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: Date;
}

interface DecorationShowcaseProps {
  decorations: Decoration[];
  title?: string;
  compact?: boolean;
}

export default function DecorationShowcase({
  decorations,
  title = "Decorations & Achievements",
  compact = false,
}: DecorationShowcaseProps) {
  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: "#7a7f8e",
      rare: "#00eaff",
      epic: "#b000ff",
      legendary: "#ffd700",
    };
    return colors[rarity] || "#7a7f8e";
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      badge: <Shield className="w-4 h-4" />,
      achievement: <Trophy className="w-4 h-4" />,
      social_good: <Heart className="w-4 h-4" />,
      emote: <Smile className="w-4 h-4" />,
    };
    return icons[category] || <Sparkles className="w-4 h-4" />;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      badge: "Badge",
      achievement: "Achievement",
      social_good: "Social Good",
      emote: "Emote",
    };
    return labels[category] || "Decoration";
  };

  if (decorations.length === 0) {
    return (
      <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6 text-center">
        <Sparkles className="w-8 h-8 text-[#7a7f8e] mx-auto mb-3" />
        <p className="text-[#7a7f8e]">No decorations yet. Earn them through gameplay and social good actions!</p>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-bold text-[#00eaff]">{title}</p>
        <div className="flex flex-wrap gap-2">
          {decorations.slice(0, 6).map((decoration) => (
            <div
              key={decoration.id}
              className="relative group"
              title={decoration.name}
            >
              <img
                src={decoration.imageUrl}
                alt={decoration.name}
                className="w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform"
                style={{ borderColor: getRarityColor(decoration.rarity) }}
              />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-[#0b0e14] border border-[#2a2f3e] rounded-lg p-2 whitespace-nowrap text-xs">
                  <p className="font-bold text-[#00eaff]">{decoration.name}</p>
                  <p className="text-[#7a7f8e]">{getCategoryLabel(decoration.category)}</p>
                </div>
              </div>
            </div>
          ))}
          {decorations.length > 6 && (
            <div className="w-8 h-8 rounded-full bg-[#2a2f3e] border-2 border-[#7a7f8e] flex items-center justify-center text-xs font-bold text-[#7a7f8e]">
              +{decorations.length - 6}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Group by category
  const grouped = decorations.reduce(
    (acc, decoration) => {
      if (!acc[decoration.category]) {
        acc[decoration.category] = [];
      }
      acc[decoration.category].push(decoration);
      return acc;
    },
    {} as Record<string, Decoration[]>
  );

  return (
    <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
      <h3 className="text-lg font-bold text-[#ff00cc] mb-6">{title}</h3>

      <div className="space-y-6">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <div className="text-[#00eaff]">{getCategoryIcon(category)}</div>
              <p className="font-bold text-[#00eaff] capitalize">{getCategoryLabel(category)}</p>
              <Badge className="bg-[#2a2f3e] text-[#7a7f8e] ml-auto">
                {items.length}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {items.map((decoration) => (
                <div
                  key={decoration.id}
                  className="group relative"
                >
                  <div
                    className="aspect-square rounded-lg overflow-hidden border-2 hover:scale-105 transition-transform cursor-pointer"
                    style={{ borderColor: getRarityColor(decoration.rarity) }}
                  >
                    <img
                      src={decoration.imageUrl}
                      alt={decoration.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Hover Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-48">
                    <div className="bg-[#0b0e14] border border-[#2a2f3e] rounded-lg p-3">
                      <p className="font-bold text-[#00eaff] mb-1">{decoration.name}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          className="text-xs"
                          style={{
                            backgroundColor: `${getRarityColor(decoration.rarity)}20`,
                            color: getRarityColor(decoration.rarity),
                            borderColor: getRarityColor(decoration.rarity),
                            border: "1px solid",
                          }}
                        >
                          {decoration.rarity.charAt(0).toUpperCase() +
                            decoration.rarity.slice(1)}
                        </Badge>
                      </div>
                      {decoration.unlockedAt && (
                        <p className="text-xs text-[#7a7f8e]">
                          Unlocked:{" "}
                          {new Date(decoration.unlockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Rarity Badge */}
                  <div
                    className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: getRarityColor(decoration.rarity),
                      color: "#0b0e14",
                    }}
                  >
                    ★
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
