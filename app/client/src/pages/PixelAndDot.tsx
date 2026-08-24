import { ArrowLeft, BookOpen, Cat, Heart, Lightbulb, Play, Shield, Sparkles, Star } from "lucide-react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LivingWorldWeb } from "@/components/LivingWorldWeb";

const palette = {
  base: "#050914",
  cyan: "#20cde2",
  magenta: "#e853dc",
  gold: "#d8ae55",
};

const characterCards = [
  {
    name: "Pixel",
    role: "Older Brother / Gentle Guide",
    identity: "Light blue hoodie with an AO logo",
    detail: "Blue star shoes, a curious mind, and a steady instinct to make room for his little sister.",
    image: "/assets/pixel-avatar.png",
    icon: Shield,
    accent: palette.cyan,
    symbol: "P",
  },
  {
    name: "Dot",
    role: "Baby Sister / Bright Spark",
    identity: "Fuzzy pink hooded blanket with stars",
    detail: "Pink star shoes, wide-eyed wonder, and a tiny brave heart that turns every moment into a story.",
    image: "/assets/dot-avatar.png",
    icon: Star,
    accent: palette.magenta,
    symbol: "D",
  },
];

const episodes = [
  {
    id: "grandma-moves-in",
    title: "Grandma Moves In",
    series: "Pixel & Dot - Season 1",
    description: "When Grandma joins the household, Pixel and Dot learn about sharing space, welcoming family, and finding extra love in everyday routines.",
    youtubeId: "dQw4w9WgXcQ", // Replace with your YouTube Video ID or short link
    badge: "Featured Episode",
  },
  {
    id: "looking-closer",
    title: "Look Closer",
    series: "Pixel & Dot Shorts",
    description: "Pixel shows Dot how the smallest details in nature and art can unlock huge imaginative adventures.",
    youtubeId: "dQw4w9WgXcQ",
    badge: "Short",
  },
];

const archiveSignals = [
  {
    label: "01 / Wonder",
    title: "Look Closer",
    text: "The smallest detail can open a whole new door. Pixel helps Dot notice the magic hiding in plain sight.",
    icon: Sparkles,
    accent: palette.gold,
  },
  {
    label: "02 / Heart",
    title: "Kindness First",
    text: "Gentle lessons about empathy, listening, and standing up for family when things feel unfamiliar.",
    icon: Heart,
    accent: palette.magenta,
  },
  {
    label: "03 / Spark",
    title: "Creative Solutions",
    text: "Turning household moments into bright, colorful discoveries with curiosity and team thinking.",
    icon: Lightbulb,
    accent: palette.cyan,
  },
];

export default function PixelAndDot() {
  const [, navigate] = useLocation();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050914] text-[#a0a8c0]">
      <LivingWorldWeb variant="magenta" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8 sm:px-10 lg:px-14">
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#20cde2] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#20cde2]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to AO Homeworld
          </Link>

          <Button
            onClick={() => navigate("/anoms-corner")}
            className="btn-neon-magenta text-xs"
          >
            <Cat className="mr-2 h-4 w-4" />
            Visit Anom's Corner
          </Button>
        </div>

        {/* Hero Banner */}
        <section className="mt-12 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e853dc]/40 bg-[#e853dc]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#e853dc]">
            <BookOpen className="h-3.5 w-3.5" />
            Educational & Family Series
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Pixel & <span className="text-[#e853dc]">Dot</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#7a7f8e]">
            A curious light sprite and a sleepy, grounded force. Gentle stories about sharing, empathy, and figuring people out inside the AO Living World.
          </p>
        </section>

        {/* Character Showcase Grid */}
        <section className="mt-14 grid gap-8 md:grid-cols-2">
          {characterCards.map((card) => {
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

        {/* Episode Archive & Video Shorts */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-white">Watch Shorts & Episodes</h2>
              <p className="mt-1 text-sm text-[#7a7f8e]">Animated stories and lessons from the series.</p>
            </div>
            <Button onClick={() => navigate("/youtube-manager")} className="btn-neon-cyan text-xs">
              <Play className="mr-2 h-4 w-4" />
              All Broadcasts
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {episodes.map((ep) => (
              <div
                key={ep.id}
                className="rounded-xl border border-[#2a2f3e] bg-[#0d1b2b] p-6 backdrop-blur transition-all hover:border-[#e853dc]/40"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d8ae55]">
                    {ep.series}
                  </span>
                  <span className="rounded-full bg-[#e853dc]/20 px-2.5 py-0.5 text-[10px] font-semibold text-[#e853dc]">
                    {ep.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{ep.title}</h3>
                <p className="text-sm text-[#7a7f8e] mb-4">{ep.description}</p>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black/60 border border-[#2a2f3e] flex items-center justify-center">
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${ep.youtubeId}`}
                    title={ep.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Core Values / Archive Signals */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-white">Series Values</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {archiveSignals.map((signal) => {
              const SignalIcon = signal.icon;
              return (
                <div
                  key={signal.title}
                  className="rounded-xl border border-[#2a2f3e] bg-[#050914]/60 p-6 backdrop-blur"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-[#7a7f8e]">
                    {signal.label}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <SignalIcon className="h-5 w-5" style={{ color: signal.accent }} />
                    <h3 className="text-lg font-bold text-white">{signal.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-[#a0a8c0]">{signal.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-16 rounded-2xl border border-[#e853dc]/30 bg-gradient-to-r from-[#e853dc]/10 via-[#050914] to-[#20cde2]/10 p-8 text-center backdrop-blur">
          <h3 className="text-2xl font-bold text-white">Want to explore more family activities?</h3>
          <p className="mt-2 text-sm text-[#7a7f8e]">Head over to Anom's Corner for interactive games, coloring, and stories.</p>
          <div className="mt-6 flex justify-center gap-4">
            <Button onClick={() => navigate("/anoms-corner")} className="btn-neon-magenta px-6 py-3 font-bold">
              Open Anom's Corner
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-[#2a2f3e] pt-8 text-center text-xs text-[#7a7f8e]">
          <p>&copy; 2026 Anom Artsy. Pixel & Dot is part of the AO Creative Studio.</p>
        </footer>
      </div>
    </main>
  );
}
