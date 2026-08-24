import { ArrowLeft, Eye, Filter, Layers, Palette, Shield, Sparkles, Trophy } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LivingWorldWeb } from "@/components/LivingWorldWeb";

const palette = {
  base: "#050914",
  cyan: "#20cde2",
  magenta: "#e853dc",
  gold: "#d8ae55",
};

const rarityTiers = [
  {
    name: "Novelty",
    description: "Single e-idea pieces and preliminary concepts.",
    color: "text-slate-300",
    border: "border-slate-600",
    bg: "bg-slate-900/40",
  },
  {
    name: "Curiosity",
    description: "Fuller sets and exploratory world artifacts.",
    color: "text-[#20cde2]",
    border: "border-[#20cde2]/50",
    bg: "bg-[#20cde2]/10",
  },
  {
    name: "Relic",
    description: "Large collections and foundational series identity.",
    color: "text-[#e853dc]",
    border: "border-[#e853dc]/50",
    bg: "bg-[#e853dc]/10",
  },
  {
    name: "Anomoly",
    description: "Top-tier bespoke art and ultra-rare vault unlocks.",
    color: "text-[#d8ae55]",
    border: "border-[#d8ae55]/50",
    bg: "bg-[#d8ae55]/10",
  },
];

const galleryItems = [
  {
    id: "cyber-punk-emblem",
    title: "AO Cyberpunk Emblem",
    tier: "Anomoly",
    category: "Identity Piece",
    image: "/assets/ao-emblem.png",
    accent: palette.gold,
    description: "High-contrast electric cyan and hot magenta neon signature overlay.",
  },
  {
    id: "district-b-skyline",
    title: "District B Skyline",
    tier: "Relic",
    category: "World Artifact",
    image: "/assets/district-b-skyline.png",
    accent: palette.magenta,
    description: "Architectural study of the upper grid and moving light corridors.",
  },
  {
    id: "pixel-dot-badge",
    title: "Pixel & Dot Star Emblem",
    tier: "Curiosity",
    category: "Character Badge",
    image: "/assets/pixel-dot-star.png",
    accent: palette.cyan,
    description: "Educational series identity mark featuring the dual star motif.",
  },
  {
    id: "tater-security-patch",
    title: "K9 Security Insignia",
    tier: "Curiosity",
    category: "Vault Badge",
    image: "/assets/k9-patch.png",
    accent: palette.cyan,
    description: "Official perimeter patrol crest assigned to Tater's domain.",
  },
];

export default function NeonGallery() {
  const [, navigate] = useLocation();
  const [selectedTier, setSelectedTier] = useState<string>("All");

  const filteredItems = selectedTier === "All" 
    ? galleryItems 
    : galleryItems.filter((item) => item.tier === selectedTier);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050914] text-[#a0a8c0]">
      <LivingWorldWeb variant="magenta" />

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

          <Button
            onClick={() => navigate("/store")}
            className="btn-neon-magenta text-xs"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Visit Store / Vault
          </Button>
        </div>

        {/* Hero Banner */}
        <section className="mt-12 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e853dc]/40 bg-[#e853dc]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#e853dc]">
            <Palette className="h-3.5 w-3.5" />
            AO Creative Studio Archive
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Neon <span className="text-[#e853dc]">Gallery</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#7a7f8e]">
            Digital art, character identity pieces, and world artifacts across four distinct rarity tiers inside the AO studio.
          </p>
        </section>

        {/* Rarity Tiers Breakdown */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-white mb-6">Rarity Tiers</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {rarityTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl border p-5 backdrop-blur ${tier.border} ${tier.bg}`}
              >
                <h3 className={`text-lg font-extrabold ${tier.color}`}>{tier.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#a0a8c0]">{tier.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Filter Controls */}
        <section className="mt-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="flex items-center gap-2 text-white font-bold text-xl">
              <Filter className="h-5 w-5 text-[#20cde2]" />
              <h3>Artwork Archive</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {["All", "Novelty", "Curiosity", "Relic", "Anomoly"].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                    selectedTier === tier
                      ? "bg-[#20cde2] text-[#050914]"
                      : "border border-[#2a2f3e] bg-[#0d1b2b] text-[#a0a8c0] hover:border-[#20cde2]"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Items Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-[#2a2f3e] bg-[#0d1b2b]/80 p-6 backdrop-blur transition-all duration-300 hover:border-[#e853dc]/50 hover:shadow-[0_0_30px_rgba(232,83,220,0.15)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7a7f8e]">
                    {item.category}
                  </span>
                  <span
                    className="rounded-full px-3 py-0.5 text-xs font-bold uppercase"
                    style={{ backgroundColor: `${item.accent}20`, color: item.accent, border: `1px solid ${item.accent}50` }}
                  >
                    {item.tier}
                  </span>
                </div>

                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#050914] border border-[#2a2f3e] flex items-center justify-center mb-4">
                  <div className="text-center p-4">
                    <Sparkles className="mx-auto h-8 w-8 mb-2" style={{ color: item.accent }} />
                    <span className="text-xs font-semibold text-slate-400">[ Visual Preview: {item.title} ]</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-[#a0a8c0] mb-6">{item.description}</p>

                <Button
                  onClick={() => navigate("/store")}
                  className="w-full btn-neon-magenta gap-2 text-xs font-bold"
                >
                  <Eye className="h-4 w-4" />
                  View Vault Specs
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-[#2a2f3e] pt-8 text-center text-xs text-[#7a7f8e]">
          <p>&copy; 2026 Anom Artsy. All digital assets belong to AO Creative Studio.</p>
        </footer>
      </div>
    </main>
  );
}
