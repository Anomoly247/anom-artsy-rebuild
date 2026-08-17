import { ArrowUpRight, Cat, Gamepad2, Heart, Radio, ShoppingBag, Sparkles, Star, Users, WandSparkles } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import type { LinkConfig } from "@/lib/linkConfig";

type UniverseMapProps = {
  shopUrl: LinkConfig["store"];
};

type WorldCard = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  signal: string;
  accent: string;
  icon: typeof Gamepad2;
  actionLabel: string;
  route?: string;
  externalUrl?: string;
};

export default function UniverseMap({ shopUrl }: UniverseMapProps) {
  const [, navigate] = useLocation();
  const worlds: WorldCard[] = [
    {
      id: "district-b",
      eyebrow: "Arcade District / Active",
      title: "District B Arcade",
      description: "Play Sky Navigator, Identity Grid, and high-score arcade challenges.",
      signal: "Play loop online",
      accent: "#20cde2",
      icon: Gamepad2,
      actionLabel: "Enter Arcade",
      route: "/district-b-arcade",
    },
    {
      id: "moonberry",
      eyebrow: "Moonberry Farm / Family",
      title: "Anom's Corner",
      description: "Pixel & Dot stories, Moonberry Farm, and gentle family adventures.",
      signal: "Stories unfolding",
      accent: "#e853dc",
      icon: Sparkles,
      actionLabel: "Visit Corner",
      route: "/anoms-corner",
    },
    {
      id: "pixel-dot",
      eyebrow: "Storybook Archive / Family",
      title: "Pixel & Dot",
      description: "A cozy sibling story world for imagination, learning, wonder, and connection.",
      signal: "Stories unfolding",
      accent: "#e853dc",
      icon: Star,
      actionLabel: "Enter Story World",
      route: "/pixel-and-dot",
    },
    {
      id: "clifford-tater",
      eyebrow: "Security Division / Living",
      title: "Clifford & Tater",
      description: "Small adventures, big heart, and a pack philosophy built on showing up.",
      signal: "New world entry",
      accent: "#d8ae55",
      icon: Cat,
      actionLabel: "Enter World",
      route: "/clifford-and-tater",
    },
    {
      id: "creator-worlds",
      eyebrow: "Creator Worlds / Open Slot",
      title: "Creator Worlds",
      description: "A future-facing world layer for creator-led places, characters, stories, and systems inside AO.",
      signal: "Template ready",
      accent: "#20cde2",
      icon: WandSparkles,
      actionLabel: "Open World Slot",
      route: "/creator-worlds",
    },
    {
      id: "neon-gallery",
      eyebrow: "Neon Gallery / Identity",
      title: "The Neon Gallery",
      description: "Approved art, identity fragments, creator signals, and neon environment work.",
      signal: "Gallery lane",
      accent: "#e853dc",
      icon: Sparkles,
      actionLabel: "Enter Gallery",
      route: "/neon-gallery",
    },
    {
      id: "sanctuary",
      eyebrow: "Sanctuary / Community",
      title: "The Sanctuary",
      description: "Lounges, identity, and social-good energy gathered under one neon sky.",
      signal: "Community pulse",
      accent: "#20cde2",
      icon: Users,
      actionLabel: "Open Sanctuary",
      route: "/sanctuary",
    },
    {
      id: "broadcast-tower",
      eyebrow: "Broadcast Tower / Live",
      title: "The Broadcast Tower",
      description: "Cross-world releases, story signals, and new transmissions from the AO universe.",
      signal: "Signal incoming",
      accent: "#d8ae55",
      icon: Radio,
      actionLabel: "Tune In",
      route: "/broadcast",
    },
    {
      id: "market",
      eyebrow: "Market Gate / External",
      title: "Anom Originals Shop",
      description: "Bespoke artwork, apparel, and verified creator gear from the physical realm.",
      signal: "Gate open",
      accent: "#e853dc",
      icon: ShoppingBag,
      actionLabel: "Browse Shop",
      externalUrl: shopUrl,
    },
  ];

  const enterWorld = (world: WorldCard) => {
    if (world.route) {
      navigate(world.route);
      return;
    }
    if (world.externalUrl) window.location.assign(world.externalUrl);
  };

  return (
    <section className="relative overflow-hidden border-y border-[#20405c] bg-[#050914] px-6 py-16" aria-labelledby="universe-map-title">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(0,240,255,0.08),transparent_32%),radial-gradient(circle_at_90%_35%,rgba(255,47,208,0.08),transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55]">Universe Navigation / Living Map</p>
            <h2 id="universe-map-title" className="mt-2 text-4xl font-black text-[#20cde2] drop-shadow-[0_0_10px_rgba(0,240,255,0.25)]">Choose Your World</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400">Every node is a place with its own rhythm, residents, and story loop. Enter gently. Stay curious.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {worlds.map((world) => {
            const Icon = world.icon;
            return (
              <article
                key={world.id}
                className="group relative flex min-h-[300px] flex-col overflow-hidden rounded-2xl border bg-[#12141e] p-5 transition-all duration-200 hover:-translate-y-1"
                style={{ borderColor: `${world.accent}99`, boxShadow: `0 0 24px ${world.accent}1c` }}
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full border transition-transform duration-300 group-hover:scale-110" style={{ borderColor: `${world.accent}35` }} />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#050914]" style={{ color: world.accent }}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <span className="rounded-full border border-[#20405c] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">{world.signal}</span>
                </div>
                <div className="relative mt-7 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: world.accent }}>{world.eyebrow}</p>
                  <h3 className="mt-3 text-xl font-black text-white">{world.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{world.description}</p>
                </div>
                <Button
                  variant="outline"
                  className="relative mt-7 w-full gap-2 bg-transparent font-bold transition-colors"
                  style={{ borderColor: `${world.accent}99`, color: world.accent }}
                  onClick={() => enterWorld(world)}
                >
                  {world.actionLabel}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 text-center text-xs uppercase tracking-[0.25em] text-slate-500">
          <Heart className="h-4 w-4 text-[#e853dc]" aria-hidden="true" />
          More worlds are breathing below the horizon
          <Heart className="h-4 w-4 text-[#e853dc]" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
