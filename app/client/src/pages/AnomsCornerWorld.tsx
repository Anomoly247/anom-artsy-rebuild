import { ArrowLeft, BookOpen, Film, Heart, Home, Palette, Sparkles, Sprout, Star } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import HandoffArchiveSignals from "@/components/HandoffArchiveSignals";
import { LivingWorldWeb } from "@/components/LivingWorldWeb";

const palette = {
  base: "#050914",
  cyan: "#20cde2",
  magenta: "#e853dc",
  gold: "#d8ae55",
};

const cornerArchives = [
  {
    id: "moonberry" as const,
    name: "Moonberry Farm",
    route: "/moonberry-farm",
    role: "Cozy Planet / Storytelling Zone",
    identity: "A soft-lit world for wonder",
    detail: "Follow the moonberry paths through gentle tales, curious creatures, and the kind of quiet discovery that makes a family story feel like home.",
    icon: Sprout,
    accent: palette.magenta,
    symbol: "M",
  },
  {
    id: "shelf" as const,
    name: "The Story Shelf",
    route: "/archive",
    role: "Narrative Archive / Family Safe",
    identity: "A growing library of shared moments",
    detail: "Browse character stories, learning sparks, and warm adventures designed to be read, watched, and revisited together.",
    icon: BookOpen,
    accent: palette.cyan,
    symbol: "S",
  },
];

const cornerSignals = [
  {
    label: "01 / Gather",
    title: "Open the Door",
    text: "Anom's Corner is a welcoming family space where every story begins with a little room for imagination.",
    icon: Home,
    accent: palette.gold,
  },
  {
    label: "02 / Wonder",
    title: "Follow the Trail",
    text: "Moonberry Farm turns a simple walk, question, or picture into a gentle expedition across the AO universe.",
    icon: Star,
    accent: palette.magenta,
  },
  {
    label: "03 / Create",
    title: "Make It Cozy",
    text: "Creative resources invite drawing, reading, listening, and sharing without losing the warmth of the storybook world.",
    icon: Palette,
    accent: palette.cyan,
  },
];

const handoffArchiveSignals = [
  { title: "Pixel & Dot Storybook Library", detail: "8 archived records / family-safe space", accent: palette.cyan },
  { title: "Moonberry Farm Puzzle Lane", detail: "Anom’s Corner / cozy planet reference", accent: palette.magenta },
  { title: "Emotional Intelligence Stories", detail: "Connection, learning, and wonder", accent: palette.gold },
];

const libraryEntries = [
  { title: "Moonberry Morning", type: "Story archive", icon: BookOpen, accent: palette.magenta, route: "/archive/moonberry-morning" },
  { title: "Pixel & Dot: The First Page", type: "Character tale", icon: Heart, accent: palette.cyan, route: "/archive/pixel-and-dot" },
  { title: "Moonberry Farm Trailer Reel", type: "Book trailer", icon: Film, accent: palette.gold, route: "/archive/moonberry-farm-trailer-reel" },
  { title: "Cozy Corner Maker Kit", type: "Creative resource", icon: Sparkles, accent: palette.magenta, route: "/archive/cozy-corner-maker-kit" },
];

type LibraryEntry = (typeof libraryEntries)[number];

export default function AnomsCornerWorld() {
  const [, navigate] = useLocation();

  return (
    <div className="ao-world-page min-h-screen text-white" style={{ backgroundColor: palette.base }}>
      <LivingWorldWeb variant="magenta" />
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
            AO / Family Story Space
          </span>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
        <section className="relative overflow-hidden rounded-2xl border border-[#20cde2]/60 bg-[radial-gradient(circle_at_15%_20%,rgba(0,240,255,0.14),transparent_32%),radial-gradient(circle_at_90%_10%,rgba(255,47,208,0.14),transparent_34%),#0f111b] p-7 shadow-[0_0_28px_rgba(0,240,255,0.16)] sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-[#e853dc]/25" />
          <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full border border-[#d8ae55]/20" />
          <div className="relative max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#d8ae55]">World Entry / Family Archive 02</p>
            <h1 className="text-4xl font-black tracking-tight text-[#20cde2] drop-shadow-[0_0_12px_rgba(0,240,255,0.35)] sm:text-6xl">
              // ANOM&apos;S CORNER //
            </h1>
            <p className="mt-4 text-xl font-semibold text-[#e853dc] sm:text-2xl">Stories, Family &amp; Moonberry Farm.</p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              A dedicated storybook library and family space within the AO universe, where Moonberry Farm glows softly at the edge of imagination.
            </p>
            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#d8ae55]/60 bg-[#d8ae55]/10 px-5 py-3 text-sm font-bold text-[#d8ae55] shadow-[0_0_18px_rgba(255,210,63,0.16)]">
              <Heart className="h-4 w-4" aria-hidden="true" />
              A cozy home for safe stories, shared wonder, and creative connection.
            </div>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="corner-roster-title">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55]">Permanent World Card / Story Residents</p>
              <h2 id="corner-roster-title" className="text-3xl font-bold text-[#20cde2]">The Corner Library</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-400">A family-safe narrative archive with Moonberry Farm at its center: soft, curious, welcoming, and always open to another page.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {cornerArchives.map((archive) => {
              const Icon = archive.icon;
              return (
                <Link
                  key={archive.name}
                  href={archive.route}
                  className="group relative overflow-hidden rounded-xl border bg-[#102238] p-6 text-left transition-all duration-200 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d8ae55]"
                  style={{ borderColor: `${archive.accent}99`, boxShadow: `0 0 22px ${archive.accent}26` }}
                >
                  <div className="absolute -right-8 -top-8 flex h-28 w-28 items-center justify-center rounded-full border transition-transform duration-300 group-hover:scale-110" style={{ borderColor: `${archive.accent}44`, color: `${archive.accent}55` }}>
                    <span className="text-5xl font-black">{archive.symbol}</span>
                  </div>
                  <div className="relative flex items-start justify-between gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#050914]" style={{ color: archive.accent }}>
                      <Icon className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <span className="rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ borderColor: `${archive.accent}99`, color: archive.accent }}>
                      Enter world
                    </span>
                  </div>
                  <h3 className="relative mt-6 text-3xl font-black" style={{ color: archive.accent }}>{archive.name}</h3>
                  <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-[#d8ae55]">{archive.role}</p>
                  <p className="mt-5 text-lg font-semibold text-white">{archive.identity}</p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">{archive.detail}</p>
                  <p className="relative mt-5 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Open route / {archive.route.replace(/^\//, "")}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="corner-signals-title">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55]">Family-Safe Narrative Archive</p>
              <h2 id="corner-signals-title" className="text-3xl font-bold text-[#e853dc]">Corner Signals</h2>
            </div>
            <Sparkles className="hidden h-8 w-8 text-[#d8ae55] sm:block" aria-hidden="true" />
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {cornerSignals.map((signal) => {
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

        <section className="mt-12" aria-labelledby="handoff-archive-title">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55]">Handoff Content / Existing Space</p><h2 id="handoff-archive-title" className="text-3xl font-bold text-[#20cde2]">Archive Signals</h2></div><p className="max-w-xl text-sm leading-6 text-slate-400">The handoff’s family-safe records settle into Anom’s Corner as an additive shelf, not a replacement library.</p></div>
          <div className="grid gap-5 md:grid-cols-3">{handoffArchiveSignals.map((signal) => <article key={signal.title} className="rounded-xl border border-[#20405c] bg-[#0d1b2b] p-5" style={{ boxShadow: `0 0 18px ${signal.accent}18` }}><p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: signal.accent }}>{signal.detail}</p><h3 className="mt-4 text-xl font-bold text-white">{signal.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">Approved family-safe story, puzzle, and connection material mapped to the existing archive.</p></article>)}</div>
        </section>

        <HandoffArchiveSignals
          route="/anoms-corner"
          title="Source-Mapped Storybook Shelf"
          intro="Pixel & Dot, Moonberry Farm, and connection-focused handoff records now sit beside the existing family-safe shelf. The original archive and routes remain unchanged."
          accent="cyan"
        />

        <HandoffArchiveSignals
          route="/moonberry-farm"
          title="Moonberry Farm Source Signal"
          intro="Moonberry records are mapped to their dedicated cozy-planet destination while remaining discoverable from Anom’s Corner."
          accent="magenta"
        />

        <section className="mt-12 rounded-xl border border-[#d8ae55]/50 bg-[#d8ae55]/5 p-6 shadow-[0_0_22px_rgba(255,210,63,0.1)] sm:p-8" aria-labelledby="archive-shelf-title">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55]">Book Trailers / Cozy Creative Resources</p>
              <h2 id="archive-shelf-title" className="mt-3 text-2xl font-black text-white sm:text-3xl">The Moonberry Shelf</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">A growing shelf for family-safe narrative archives, gentle book trailers, and creative prompts that help every visitor make a little more room for wonder.</p>
            </div>
            <BookOpen className="h-10 w-10 shrink-0 text-[#d8ae55]" aria-hidden="true" />
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {libraryEntries.map((entry, index) => {
              const Icon = entry.icon;
              return (
                <Link
                  key={entry.title}
                  href={entry.route}
                  className="group flex items-center gap-3 rounded-lg border border-[#20405c] bg-[#050914]/70 px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-[#e853dc]/70 hover:bg-[#e853dc]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d8ae55]"
                  aria-label={`Open ${entry.title}`}
                >
                  <Icon className="h-5 w-5 transition-transform group-hover:scale-110" style={{ color: entry.accent }} aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#20cde2]">{entry.title}</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{entry.type} / 0{index + 1}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#d8ae55] opacity-0 transition-opacity group-hover:opacity-100">Open</span>
                </Link>
              );
            })}
          </div>
          <Button variant="outline" className="mt-7 border-[#e853dc]/70 bg-transparent font-bold text-[#e853dc] hover:bg-[#e853dc]/10 hover:text-[#e853dc]" onClick={() => navigate("/pixel-and-dot")}>
            <Star className="mr-2 h-4 w-4" aria-hidden="true" />
            Visit Pixel &amp; Dot
          </Button>
        </section>
      </main>

    </div>
  );
}
