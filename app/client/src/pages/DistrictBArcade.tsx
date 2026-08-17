import { ArrowLeft, BookOpen, Compass, Gamepad2, Grid3X3, Radar, Star, Trophy, Zap } from "lucide-react";
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

const stations = [
  {
    title: "Sky Navigator",
    description: "Chart the neon routes above District B and plot a safe course through the moving lights.",
    detail: "Compass station / exploration loop",
    icon: Compass,
    accent: palette.cyan,
  },
  {
    title: "Identity Grid",
    description: "Decode the district signals and align every identity marker before the next round begins.",
    detail: "Grid station / pattern loop",
    icon: Grid3X3,
    accent: palette.magenta,
  },
  {
    title: "High-Score Matrix",
    description: "Review the arcade record, chase a personal best, and leave a bright mark on the district wall.",
    detail: "Radar station / score loop",
    icon: Radar,
    accent: palette.gold,
  },
];

export default function DistrictBArcade() {
  const [, navigate] = useLocation();

  return (
    <div className="ao-world-page min-h-screen text-white" style={{ backgroundColor: palette.base }}>
      <LivingWorldWeb variant="gold" />
      <nav className="fixed inset-x-0 top-0 z-30 border-b border-[#20cde2]/30 bg-[#050914]/95 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2 text-[#20cde2] hover:bg-[#20cde2]/10 hover:text-[#20cde2]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Universe Map
          </Button>
          <span className="hidden text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55] sm:inline">AO / District B Arcade</span>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 pb-16 pt-28 sm:pt-32">
        <section className="relative overflow-hidden rounded-2xl border border-[#20cde2]/60 bg-[radial-gradient(circle_at_12%_18%,rgba(0,240,255,0.16),transparent_30%),radial-gradient(circle_at_88%_8%,rgba(255,47,208,0.18),transparent_34%),#0f111b] p-7 shadow-[0_0_30px_rgba(0,240,255,0.18)] sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-[#e853dc]/30" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full border border-[#d8ae55]/20" />
          <div className="relative max-w-4xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#d8ae55]">World Entry / Arcade District 01</p>
            <h1 className="text-4xl font-black tracking-tight text-[#20cde2] drop-shadow-[0_0_12px_rgba(0,240,255,0.35)] sm:text-6xl">// DISTRICT B ARCADE //</h1>
            <p className="mt-4 text-xl font-semibold text-[#e853dc] sm:text-2xl">Play Fast. Think Bright. Leave a Signal.</p>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">A living arcade world where every station turns curiosity into a challenge. District B is the high-energy play loop of the AO universe: a place to test memory, explore patterns, and celebrate the next high score together.</p>
            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#d8ae55]/60 bg-[#d8ae55]/10 px-5 py-3 text-sm font-bold text-[#d8ae55] shadow-[0_0_18px_rgba(255,210,63,0.16)]"><Zap className="h-4 w-4" aria-hidden="true" />Arcade systems online / three stations ready.</div>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-[#e853dc]/50 bg-[#050914]/70 p-6 shadow-[0_0_24px_rgba(255,47,208,0.12)] sm:p-8" aria-labelledby="district-b-stations-title">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55]">Living World Stations</p><h2 id="district-b-stations-title" className="mt-2 text-3xl font-black text-[#e853dc]">Choose Your Challenge</h2></div><p className="max-w-xl text-sm leading-6 text-slate-400">Every station is a different kind of focus. Enter the Games Hub to play, earn points, and keep your personal signal moving.</p></div>
          <div className="grid gap-5 lg:grid-cols-3">
            {stations.map((station) => {
              const Icon = station.icon;
              return (
                <Link key={station.title} href="/games" className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-xl border bg-[#102238] p-6 transition-all duration-200 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d8ae55]" style={{ borderColor: `${station.accent}99`, boxShadow: `0 0 22px ${station.accent}26` }}>
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border transition-transform duration-300 group-hover:scale-110" style={{ borderColor: `${station.accent}44` }} />
                  <div className="relative flex items-start justify-between gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#050914]" style={{ color: station.accent }}><Icon className="h-8 w-8" aria-hidden="true" /></div><span className="rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ borderColor: `${station.accent}99`, color: station.accent }}>Enter station</span></div>
                  <div className="relative mt-6 flex-1"><h3 className="text-2xl font-black" style={{ color: station.accent }}>{station.title}</h3><p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-[#d8ae55]">{station.detail}</p><p className="mt-4 text-sm leading-6 text-slate-400">{station.description}</p></div>
                  <p className="relative mt-5 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Open Games Hub / play now</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-[#20cde2]/40 bg-[#050914]/70 p-6 shadow-[0_0_24px_rgba(0,240,255,0.1)] sm:p-8" aria-labelledby="arcade-handoff-title">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55]">Handoff Content / Financial District</p><h2 id="arcade-handoff-title" className="text-3xl font-black text-[#20cde2]">Archive Signals in the Arcade</h2></div><p className="max-w-xl text-sm leading-6 text-slate-400">Eleven handoff records extend the existing Games Hub with event history, game-build references, and play-loop context.</p></div>
          <div className="grid gap-4 md:grid-cols-3">{[
            ["Coin Hunt", "Economy loop / trailer reference", palette.cyan],
            ["Mood Memes", "Game-build archive / identity lane", palette.magenta],
            ["Fubar event history", "Authored source record / review before AO adaptation", palette.gold],
          ].map(([title, detail, accent]) => <article key={title} className="rounded-xl border border-[#20405c] bg-[#0d1b2b] p-5" style={{ boxShadow: `0 0 18px ${accent}18` }}><p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: accent }}>{detail}</p><h3 className="mt-4 text-xl font-bold text-white">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">Additive archive content; preserve source attribution and review before public release.</p></article>)}</div>
        </section>

        <HandoffArchiveSignals
          route="/district-b-arcade"
          title="Source-Mapped Financial District Archive"
          intro="The generated registry now connects verified handoff records to the existing Arcade destination without exposing unapproved external media."
          accent="gold"
        />

        <section className="mt-10 grid gap-5 md:grid-cols-3" aria-label="Arcade world signals">
          {[
            { label: "01 / Focus", title: "Find the pattern", text: "Every round gives attention a new shape.", icon: Grid3X3, accent: palette.cyan },
            { label: "02 / Motion", title: "Move through the lights", text: "A good play loop keeps the whole district awake.", icon: Gamepad2, accent: palette.magenta },
            { label: "03 / Record", title: "Leave your signal", text: "Celebrate progress, not just the final number.", icon: Trophy, accent: palette.gold },
          ].map((signal) => {
            const Icon = signal.icon;
            return <article key={signal.label} className="rounded-xl border border-[#20405c] bg-[#0d1b2b] p-5"><div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: signal.accent }}>{signal.label}</span><Icon className="h-5 w-5" style={{ color: signal.accent }} aria-hidden="true" /></div><h3 className="mt-6 text-xl font-bold text-white">{signal.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{signal.text}</p></article>;
          })}
        </section>

        <section className="mt-10 flex flex-col items-start justify-between gap-5 rounded-xl border border-[#d8ae55]/50 bg-[#d8ae55]/5 p-6 shadow-[0_0_20px_rgba(255,210,63,0.1)] sm:flex-row sm:items-center sm:p-8"><div><p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55]">Arcade Gate / Next Move</p><h2 className="mt-2 text-2xl font-black text-white">Ready to enter the play loop?</h2><p className="mt-2 text-sm leading-6 text-slate-400">The original Games Hub holds the playable stations and score loop.</p></div><div className="flex flex-wrap gap-3"><Link href="/games" className="inline-flex items-center gap-2 rounded-md border border-[#20cde2]/70 bg-[#20cde2]/10 px-5 py-3 text-sm font-bold text-[#20cde2] transition-colors hover:bg-[#20cde2]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d8ae55]"><Star className="h-4 w-4" aria-hidden="true" />Launch Games Hub</Link><Link href="/archive" className="inline-flex items-center gap-2 rounded-md border border-[#e853dc]/70 bg-[#e853dc]/10 px-5 py-3 text-sm font-bold text-[#e853dc] transition-colors hover:bg-[#e853dc]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d8ae55]"><BookOpen className="h-4 w-4" aria-hidden="true" />Open Story Archive</Link></div></section>
      </main>
    </div>
  );
}
