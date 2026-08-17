import { ArrowLeft, BookOpen, Cat, Heart, Lightbulb, Shield, Sparkles, Star } from "lucide-react";
import { useLocation } from "wouter";
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
    identity: "Light blue hoodie with an A logo",
    detail: "Blue star shoes, a curious mind, and a steady instinct to make room for his little sister.",
    icon: Shield,
    accent: palette.cyan,
    symbol: "P",
  },
  {
    name: "Dot",
    role: "Baby Sister / Bright Spark",
    identity: "Fuzzy pink hooded blanket with stars",
    detail: "Pink star shoes, wide-eyed wonder, and a tiny brave heart that turns every moment into a story.",
    icon: Star,
    accent: palette.magenta,
    symbol: "D",
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
    label: "02 / Learning",
    title: "Ask Together",
    text: "Every question is welcome here. Their story world turns curiosity, care, and discovery into shared adventures.",
    icon: Lightbulb,
    accent: palette.cyan,
  },
  {
    label: "03 / Connection",
    title: "Stay Close",
    text: "A cozy sibling protector story where imagination is safer, brighter, and more joyful when it is shared.",
    icon: Heart,
    accent: palette.magenta,
  },
];

const storyLibrary = [
  "The Star-Shoe Trail",
  "Dot's First Big Question",
  "Pixel's Pocket Guide to Wonder",
  "The Blanket Fort Broadcast",
];

export default function PixelAndDot() {
  const [, navigate] = useLocation();

  return (
    <div className="ao-world-page min-h-screen text-white" style={{ backgroundColor: palette.base }}>
      <LivingWorldWeb variant="cyan" />
      <nav className="sticky top-0 z-20 border-b border-[#20cde2]/30 bg-[#050914]/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2 text-[#20cde2] hover:bg-[#20cde2]/10 hover:text-[#20cde2]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Universe Map
          </Button>
          <span className="hidden text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55] sm:inline">
            AO / Storybook Library
          </span>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
        <section className="relative overflow-hidden rounded-2xl border border-[#20cde2]/60 bg-[radial-gradient(circle_at_15%_20%,rgba(0,240,255,0.14),transparent_32%),radial-gradient(circle_at_90%_10%,rgba(255,47,208,0.14),transparent_34%),#0f111b] p-7 shadow-[0_0_28px_rgba(0,240,255,0.16)] sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-[#e853dc]/25" />
          <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full border border-[#d8ae55]/20" />
          <div className="relative max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#d8ae55]">World Entry / Story Archive 01</p>
            <h1 className="text-4xl font-black tracking-tight text-[#20cde2] drop-shadow-[0_0_12px_rgba(0,240,255,0.35)] sm:text-6xl">
              // PIXEL &amp; DOT //
            </h1>
            <p className="mt-4 text-xl font-semibold text-[#e853dc] sm:text-2xl">Stories, Wonder &amp; Imagination.</p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              The permanent story world for imagination, learning, and connection—where a cozy sibling bond makes every ordinary moment feel like an expedition.
            </p>
            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#d8ae55]/60 bg-[#d8ae55]/10 px-5 py-3 text-sm font-bold text-[#d8ae55] shadow-[0_0_18px_rgba(255,210,63,0.16)]">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              A family-safe archive connected to Anom's Corner.
            </div>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="character-roster-title">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55]">Official Story Card / Resident Siblings</p>
              <h2 id="character-roster-title" className="text-3xl font-bold text-[#20cde2]">The Cozy Core</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-400">Pixel and Dot are the heart of a storybook world built for gentle discovery, safe wonder, and staying connected.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {characterCards.map((character) => {
              const Icon = character.icon;
              return (
                <article
                  key={character.name}
                  className="relative overflow-hidden rounded-xl border bg-[#102238] p-6 transition-transform duration-200 hover:-translate-y-1"
                  style={{ borderColor: `${character.accent}99`, boxShadow: `0 0 22px ${character.accent}26` }}
                >
                  <div className="absolute -right-8 -top-8 flex h-28 w-28 items-center justify-center rounded-full border" style={{ borderColor: `${character.accent}44`, color: `${character.accent}55` }}>
                    <span className="text-5xl font-black">{character.symbol}</span>
                  </div>
                  <div className="relative flex items-start justify-between gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#050914]" style={{ color: character.accent }}>
                      <Icon className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <span className="rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ borderColor: `${character.accent}99`, color: character.accent }}>
                      Story resident
                    </span>
                  </div>
                  <h3 className="relative mt-6 text-3xl font-black" style={{ color: character.accent }}>{character.name}</h3>
                  <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-[#d8ae55]">{character.role}</p>
                  <p className="mt-5 text-lg font-semibold text-white">{character.identity}</p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">{character.detail}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="archive-signals-title">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55]">Family-Safe Narrative Archive</p>
              <h2 id="archive-signals-title" className="text-3xl font-bold text-[#e853dc]">Story Signals</h2>
            </div>
            <Sparkles className="hidden h-8 w-8 text-[#d8ae55] sm:block" aria-hidden="true" />
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {archiveSignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <article key={signal.label} className="rounded-xl border border-[#20405c] bg-[#0d1b2b] p-5 shadow-[0_0_18px_rgba(0,0,0,0.24)]">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: signal.accent }}>{signal.label}</span>
                    <Icon className="h-5 w-5" style={{ color: signal.accent }} aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{signal.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{signal.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-12 rounded-xl border border-[#d8ae55]/50 bg-[#d8ae55]/5 p-6 shadow-[0_0_22px_rgba(255,210,63,0.1)] sm:p-8" aria-labelledby="storybook-library-title">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55]">Anom's Corner Connection</p>
              <h2 id="storybook-library-title" className="mt-3 text-2xl font-black text-white sm:text-3xl">The Storybook Library</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">This permanent archive is the story-world companion to Anom's Corner: a warm shelf for family-safe tales, learning moments, and the little connections that stay with us.</p>
            </div>
            <BookOpen className="h-10 w-10 shrink-0 text-[#d8ae55]" aria-hidden="true" />
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {storyLibrary.map((story, index) => (
              <div key={story} className="flex items-center gap-3 rounded-lg border border-[#20405c] bg-[#050914]/70 px-4 py-3">
                <span className="text-xs font-bold text-[#e853dc]">0{index + 1}</span>
                <span className="text-sm font-semibold text-[#20cde2]">{story}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-7 border-[#e853dc]/70 bg-transparent font-bold text-[#e853dc] hover:bg-[#e853dc]/10 hover:text-[#e853dc]" onClick={() => navigate("/anoms-corner")}>
            <Cat className="mr-2 h-4 w-4" aria-hidden="true" />
            Visit Anom's Corner
          </Button>
        </section>
      </main>
    </div>
  );
}
