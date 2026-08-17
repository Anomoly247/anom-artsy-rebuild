import { ArrowLeft, BadgeCheck, Cat, Dog, Heart, Landmark, Play, Shield, Sparkles, Utensils } from "lucide-react";
import { useLocation } from "wouter";
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
    identity: "Miniature pinscher",
    detail: "Pink bomber jacket. Small frame. Full perimeter awareness.",
    icon: Dog,
    accent: palette.magenta,
    symbol: "T",
  },
  {
    name: "Clifford",
    role: "Executive Leadership",
    identity: "Green-eyed tabby",
    detail: "BOSS chain. Goggles. Perpetually abstaining from the meeting.",
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
    detail: "Orange tabby BOSS-chain stories, executive distractions, and the cyberpunk snack saga.",
    signals: ["BOSS chain", "Boss Distraction EP2", "Cyberpunk Snack Saga"],
    icon: Landmark,
    accent: palette.cyan,
  },
  {
    name: "The Snack Quarter",
    subtitle: "Tater Nugget’s Domain",
    count: "43 archived records",
    detail: "Chipin-girl security, treat-heist energy, midnight munchies, and the pack’s loudest patrol reports.",
    signals: ["Treat Heist Getaway", "Episode 2: The Heist", "Snack Vault Chronicles"],
    icon: Utensils,
    accent: palette.magenta,
  },
];

const adventureBeats = [
  {
    label: "01 / Perimeter",
    title: "The Watch",
    text: "Tater patrols every threshold, hallway, and suspiciously crinkly bag in the district.",
    icon: Shield,
    accent: palette.magenta,
  },
  {
    label: "02 / Command",
    title: "The Briefing",
    text: "Clifford reviews the situation from a position of executive distance and superior whisker control.",
    icon: BadgeCheck,
    accent: palette.cyan,
  },
  {
    label: "03 / Pack",
    title: "The Promise",
    text: "Their adventures are tiny in scale, enormous in heart, and always centered on showing up for each other.",
    icon: Heart,
    accent: palette.gold,
  },
];

export default function CliffordAndTater() {
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
            AO / Security Division
          </span>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
        <section className="relative overflow-hidden rounded-2xl border border-[#20cde2]/60 bg-[radial-gradient(circle_at_15%_20%,rgba(0,240,255,0.14),transparent_32%),radial-gradient(circle_at_90%_10%,rgba(255,47,208,0.14),transparent_34%),#0f111b] p-7 shadow-[0_0_28px_rgba(0,240,255,0.16)] sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-[#e853dc]/25" />
          <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full border border-[#d8ae55]/20" />
          <div className="relative max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#d8ae55]">World Entry / Pack Record 02</p>
            <h1 className="text-4xl font-black tracking-tight text-[#20cde2] drop-shadow-[0_0_12px_rgba(0,240,255,0.35)] sm:text-6xl">
              // CLIFFORD &amp; TATER //
            </h1>
            <p className="mt-4 text-xl font-semibold text-[#e853dc] sm:text-2xl">Small Adventures. Big Heart.</p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              A living corner of the Universe where security, leadership, and snack-based diplomacy keep the pack moving forward.
            </p>
            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#d8ae55]/60 bg-[#d8ae55]/10 px-5 py-3 text-sm font-bold text-[#d8ae55] shadow-[0_0_18px_rgba(255,210,63,0.16)]">
              <Heart className="h-4 w-4" aria-hidden="true" />
              Tater protects Clifford. Stand up for your pack.
            </div>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="role-roster-title">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55]">Official Brand Card / Active Roles</p>
              <h2 id="role-roster-title" className="text-3xl font-bold text-[#20cde2]">The Pack Roster</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-400">Two distinct energies. One shared perimeter. Every world needs beings who make it feel alive.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {roleCards.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.name}
                  className="relative overflow-hidden rounded-xl border bg-[#102238] p-6 transition-transform duration-200 hover:-translate-y-1"
                  style={{ borderColor: `${card.accent}99`, boxShadow: `0 0 22px ${card.accent}26` }}
                >
                  <div className="absolute -right-8 -top-8 flex h-28 w-28 items-center justify-center rounded-full border" style={{ borderColor: `${card.accent}44`, color: `${card.accent}55` }}>
                    <span className="text-5xl font-black">{card.symbol}</span>
                  </div>
                  <div className="relative flex items-start justify-between gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#050914]" style={{ color: card.accent }}>
                      <Icon className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <span className="rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ borderColor: `${card.accent}99`, color: card.accent }}>
                      Active
                    </span>
                  </div>
                  <h3 className="relative mt-6 text-3xl font-black" style={{ color: card.accent }}>{card.name}</h3>
                  <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-[#d8ae55]">{card.role}</p>
                  <p className="mt-5 text-lg font-semibold text-white">{card.identity}</p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">{card.detail}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="community-lanes-title">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55]">Handoff Content / Existing Communities</p>
              <h2 id="community-lanes-title" className="text-3xl font-bold text-[#20cde2]">Two Places, One Pack</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-400">The new archive material settles into the communities already living inside this world. Nothing is replaced; the record gets richer.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {communityLanes.map((lane) => {
              const Icon = lane.icon;
              return (
                <article key={lane.name} className="relative overflow-hidden rounded-xl border bg-[#0d1b2b] p-6" style={{ borderColor: `${lane.accent}99`, boxShadow: `0 0 22px ${lane.accent}22` }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#050914]" style={{ color: lane.accent }}>
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <span className="rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ borderColor: `${lane.accent}99`, color: lane.accent }}>{lane.count}</span>
                  </div>
                  <h3 className="mt-6 text-2xl font-black" style={{ color: lane.accent }}>{lane.name}</h3>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d8ae55]">{lane.subtitle}</p>
                  <p className="mt-4 text-sm leading-6 text-slate-400">{lane.detail}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {lane.signals.map((signal) => <span key={signal} className="inline-flex items-center gap-2 rounded-full border border-[#20405c] bg-[#050914] px-3 py-2 text-xs font-semibold text-slate-300"><Play className="h-3 w-3" style={{ color: lane.accent }} aria-hidden="true" />{signal}</span>)}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="adventure-log-title">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55]">Living World Signals</p>
              <h2 id="adventure-log-title" className="text-3xl font-bold text-[#e853dc]">Adventure Log</h2>
            </div>
            <Sparkles className="hidden h-8 w-8 text-[#d8ae55] sm:block" aria-hidden="true" />
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {adventureBeats.map((beat) => {
              const Icon = beat.icon;
              return (
                <article key={beat.label} className="rounded-xl border border-[#20405c] bg-[#0d1b2b] p-5 shadow-[0_0_18px_rgba(0,0,0,0.24)]">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: beat.accent }}>{beat.label}</span>
                    <Icon className="h-5 w-5" style={{ color: beat.accent }} aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{beat.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{beat.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <HandoffArchiveSignals
          route="/clifford-and-tater"
          title="The Pack Archive Signal"
          intro="The handoff’s Heartfield Commons and Snack Quarter records now live inside the world they belong to. The source record stays visible while final media publication remains review-gated."
          accent="cyan"
        />

        <section className="mt-12 rounded-xl border border-[#d8ae55]/50 bg-[#d8ae55]/5 p-6 text-center shadow-[0_0_22px_rgba(255,210,63,0.1)] sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55]">Pack Protocol</p>
          <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">Protect the small moments. Back your people.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400">Clifford and Tater remind every visitor that loyalty is an active choice, courage can wear a pink bomber jacket, and leadership sometimes looks like a cat in goggles.</p>
        </section>
      </main>
    </div>
  );
}
