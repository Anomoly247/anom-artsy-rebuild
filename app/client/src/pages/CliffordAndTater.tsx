import { ArrowLeft, BadgeCheck, Cat, Dog, Heart, Landmark, Play, Shield, Sparkles, Utensils } from "lucide-react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import HandoffArchiveSignals from "@/components/HandoffArchiveSignals";
import { LivingWorldWeb } from "@/components/LivingWorldWeb";

const palette = {
  base: "#050914",
  cyan: "#20cde2",
  magenta: "#e853dc",
  gold: "#d8ae55",
};

const roleCards = [
  {
    name: "Tater",
    role: "K9 Security",
    identity: "Black & tan Chipin (Miniature Pinscher)",
    detail: "Pink bomber jacket. High-energy perimeter patrol, anxious gremlin charm, and constant alertness.",
    icon: Dog,
    accent: palette.magenta,
    symbol: "T",
  },
  {
    name: "Clifford",
    role: "Executive Leadership",
    identity: "Green-eyed tabby cat",
    detail: "BOSS chain, goggles, and stoic authority. Quiet guardian who presides over the AO vault.",
    icon: Cat,
    accent: palette.cyan,
    symbol: "C",
  },
];

const communityLanes = [
  {
    name: "Heartfield Commons",
    subtitle: "Clifford’s Domain",
    count: "9 archived records",
    detail: "Green-eyed tabby BOSS-chain stories, executive distractions, and the cyberpunk snack saga.",
    accent: palette.cyan,
  },
  {
    name: "Perimeter Patrol",
    subtitle: "Tater’s Domain",
    count: "12 security logs",
    detail: "High-alert sweeps, pink bomber jacket moments, and K9 vault defense reports.",
    accent: palette.magenta,
  },
];

const petReels = [
  {
    id: "snack-vault-security",
    title: "Snack Vault Security Sweep",
    star: "Tater & Clifford",
    description: "Tater inspects the perimeter while Clifford maintains high-altitude lounge oversight.",
    youtubeId: "dQw4w9WgXcQ",
    badge: "Security Log",
  },
  {
    id: "executive-nap-time",
    title: "Executive Decision: Nap Time",
    star: "Clifford",
    description: "Clifford evaluates the latest studio designs from his padded command station.",
    youtubeId: "dQw4w9WgXcQ",
    badge: "Reel Short",
  },
];

export default function CliffordAndTater() {
  const [, navigate] = useLocation();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050914] text-[#a0a8c0]">
      <LivingWorldWeb variant="cyan" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8 sm:px-10 lg:px-14">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#20cde2] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#20cde2]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to AO Homeworld
          </Link>

          <Button
            onClick={() => navigate("/games")}
            className="btn-neon-cyan text-xs"
          >
            <Shield className="mr-2 h-4 w-4" />
            District B Arcade
          </Button>
        </div>

        {/* Hero Banner */}
        <section className="mt-12 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#20cde2]/40 bg-[#20cde2]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#20cde2]">
            <BadgeCheck className="h-3.5 w-3.5" />
            AO Security & Executive Division
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Clifford & <span className="text-[#e853dc]">Tater</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#7a7f8e]">
            K9 Security and Executive Leadership. An anxious gremlin, a stoic guardian, and the achievement vault they preside over.
          </p>
        </section>

        {/* Pet Profiles Grid */}
        <section className="mt-14 grid gap-8 md:grid-cols-2">
          {roleCards.map((card) => {
            const CardIcon = card.icon;
            return (
              <div
                key={card.name}
                className="group relative overflow-hidden rounded-2xl border border-[#2a2f3e] bg-[#0d1b2b]/80 p-8 backdrop-blur transition-all duration-300 hover:border-[#20cde2]/50 hover:shadow-[0_0_30px_rgba(32,205,226,0.15)]"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-black text-slate-950 shadow-md"
                    style={{ backgroundColor: card.accent }}
                  >
                    {card.symbol}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{card.name}</h2>
                    <p className="text-sm font-semibold" style={{ color: card.accent }}>
                      {card.role}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-sm text-[#a0a8c0]">
                  <p className="flex items-center gap-2 font-medium text-slate-200">
                    <CardIcon className="h-4 w-4" style={{ color: card.accent }} />
                    {card.identity}
                  </p>
                  <p className="leading-relaxed">{card.detail}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Pet Reels & Video Shorts */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-white">Pet Reels & Vault Logs</h2>
              <p className="mt-1 text-sm text-[#7a7f8e]">Watch Clifford and Tater in action inside the studio.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {petReels.map((reel) => (
              <div
                key={reel.id}
                className="rounded-xl border border-[#2a2f3e] bg-[#0d1b2b] p-6 backdrop-blur transition-all hover:border-[#20cde2]/40"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d8ae55]">
                    Starring: {reel.star}
                  </span>
                  <span className="rounded-full bg-[#20cde2]/20 px-2.5 py-0.5 text-[10px] font-semibold text-[#20cde2]">
                    {reel.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{reel.title}</h3>
                <p className="text-sm text-[#7a7f8e] mb-4">{reel.description}</p>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black/60 border border-[#2a2f3e] flex items-center justify-center">
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${reel.youtubeId}`}
                    title={reel.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Domain Lanes */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-white">Domain Records</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {communityLanes.map((lane) => (
              <div
                key={lane.name}
                className="rounded-xl border border-[#2a2f3e] bg-[#050914]/60 p-6 backdrop-blur"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7a7f8e]">
                    {lane.subtitle}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: lane.accent }}>
                    {lane.count}
                  </span>
                </div>
                <h3 className="mt-2 text-xl font-bold text-white">{lane.name}</h3>
                <p className="mt-2 text-sm text-[#a0a8c0]">{lane.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <HandoffArchiveSignals
            route="/clifford-and-tater"
            title="The Pack Archive Signal"
            intro="The Heartfield Commons and Snack Quarter records live inside the world they belong to. The source record stays visible while media releases remain review-gated."
          />
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-[#2a2f3e] pt-8 text-center text-xs text-[#7a7f8e]">
          <p>&copy; 2026 Anom Artsy. Clifford & Tater belong to the AO Creative Studio.</p>
        </footer>
      </div>
    </main>
  );
}
