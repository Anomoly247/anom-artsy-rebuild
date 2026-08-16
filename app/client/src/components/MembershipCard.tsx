import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Crown, Sparkles, Zap } from "lucide-react";

interface TierFeature {
  name: string;
  included: boolean;
}

interface MembershipCardProps {
  tier: "basic" | "vip" | "super_vip";
  name: string;
  displayName: string;
  price: number;
  benefits: string[];
  isCurrentTier?: boolean;
  onUpgrade?: () => void;
  onSelect?: () => void;
  featured?: boolean;
}

export default function MembershipCard({
  tier,
  name,
  displayName,
  price,
  benefits,
  isCurrentTier = false,
  onUpgrade,
  onSelect,
  featured = false,
}: MembershipCardProps) {
  const getTierIcon = () => {
    switch (tier) {
      case "vip":
        return <Crown className="w-6 h-6" />;
      case "super_vip":
        return <Sparkles className="w-6 h-6" />;
      default:
        return <Zap className="w-6 h-6" />;
    }
  };

  const getTierColor = () => {
    switch (tier) {
      case "vip":
        return "#00eaff";
      case "super_vip":
        return "#ffd700";
      default:
        return "#7a7f8e";
    }
  };

  const getBorderColor = () => {
    if (isCurrentTier) return "#ff00cc";
    if (featured) return getTierColor();
    return "#2a2f3e";
  };

  return (
    <Card
      className={`bg-[#1a1f2e] p-6 flex flex-col h-full transition-all ${
        featured ? "ring-2 scale-105" : ""
      }`}
      style={{
        borderColor: getBorderColor(),
        borderWidth: featured ? "2px" : "1px",
      }}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div style={{ color: getTierColor() }}>{getTierIcon()}</div>
          <h3 className="text-xl font-bold" style={{ color: getTierColor() }}>
            {displayName}
          </h3>
        </div>

        {isCurrentTier && (
          <Badge className="bg-[#ff00cc] text-black font-bold">Current Plan</Badge>
        )}
        {featured && (
          <Badge className="bg-[#ffd700] text-black font-bold">Most Popular</Badge>
        )}
      </div>

      {/* Price */}
      <div className="mb-6">
        {price > 0 ? (
          <>
            <p className="text-4xl font-bold" style={{ color: getTierColor() }}>
              ${price}
            </p>
            <p className="text-sm text-[#7a7f8e]">/month</p>
          </>
        ) : (
          <p className="text-3xl font-bold text-[#00eaff]">Free</p>
        )}
      </div>

      {/* Benefits */}
      <div className="space-y-3 mb-6 flex-1">
        {benefits.map((benefit, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <Check className="w-5 h-5 text-[#00eaff] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#7a7f8e]">{benefit}</p>
          </div>
        ))}
      </div>

      {/* Action Button */}
      {isCurrentTier ? (
        <Button
          disabled
          className="w-full bg-[#2a2f3e] text-[#7a7f8e] font-bold"
        >
          Current Plan
        </Button>
      ) : (
        <Button
          onClick={onUpgrade || onSelect}
          className="w-full font-bold"
          style={{
            backgroundColor: getTierColor(),
            color: tier === "super_vip" ? "#000" : "#fff",
          }}
        >
          {price > 0 ? "Upgrade Now" : "Select"}
        </Button>
      )}
    </Card>
  );
}
