import { ArrowLeft, Clapperboard, Radio, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import HandoffArchiveSignals from "@/components/HandoffArchiveSignals";
import { LivingWorldWeb } from "@/components/LivingWorldWeb";

const signals = [
  { title: "Snack Vault Chronicles", detail: "Five-panel story reel / Sassy Patrol signal", text: "A playful broadcast lane for the pack’s snack heist stories, told as short illustrated transmissions.", accent: "#e853dc", icon: Clapperboard },
  { title: "Coin Hunt Trailer", detail: "Game trailer / Financial District relay", text: "A cross-world transmission connecting the arcade loop, missions, and the shared Anom Coin economy.", accent: "#20cde2", icon: Radio },
  { title: "Sassy Patrol Reel", detail: "Community signal / Broadcast archive", text: "A living media slot for patrol reports, safety stories, and future AO broadcasts that deserve a home.", accent: "#d8ae55", icon: Sparkles },
];

export default function Broadcast() {
  const [, navigate] = useLocation();
  return (
    <div className="ao-world-page min-h-screen text-white" style={{ backgroundColor: "#050914" }}>
      <LivingWorldWeb variant="gold" />
      <nav className="sticky top-0 z-20 border-b border-[#20cde2]/30 bg-[#050914]/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2 text-[#20cde2] hover:bg-[#20cde2]/10 hover:text-[#20cde2]"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back to Universe Map</Button>
          <span className="hidden text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55] sm:inline">AO / Broadcast Tower</span>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
        <section className="relative overflow-hidden rounded-2xl border border-[#e853dc]/60 bg-[radial-gradient(circle_at_14%_18%,rgba(255,47,208,0.16),transparent_32%),radial-gradient(circle_at_88%_12%,rgba(0,240,255,0.14),transparent_34%),#0f111b] p-7 shadow-[0_0_28px_rgba(255,47,208,0.16)] sm:p-12">
          <div className="relative max-w-3xl"><p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#d8ae55]">Community Entry / Media Relay</p><h1 className="text-4xl font-black tracking-tight text-[#e853dc] sm:text-6xl">// BROADCAST TOWER //</h1><p className="mt-4 text-xl font-semibold text-[#20cde2] sm:text-2xl">Stories in the air. Signals across worlds.</p><p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">The Broadcast Tower is the handoff’s media-and-storytelling community: a place for trailers, reels, patrol reports, and cross-world transmissions.</p></div>
        </section>
        <section className="mt-10 grid gap-5 lg:grid-cols-3" aria-label="Broadcast archive signals">
          {signals.map((signal) => { const Icon = signal.icon; return <article key={signal.title} className="relative flex min-h-[250px] flex-col rounded-xl border bg-[#0d1b2b] p-6" style={{ borderColor: `${signal.accent}99`, boxShadow: `0 0 22px ${signal.accent}22` }}><div className="flex items-center justify-between"><Icon className="h-8 w-8" style={{ color: signal.accent }} aria-hidden="true" /><span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: signal.accent }}>Archive signal</span></div><div className="mt-8 flex-1"><h2 className="text-2xl font-black" style={{ color: signal.accent }}>{signal.title}</h2><p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-[#d8ae55]">{signal.detail}</p><p className="mt-4 text-sm leading-6 text-slate-400">{signal.text}</p></div></article>; })}
        </section>
        <HandoffArchiveSignals
          route="/broadcast"
          title="Source-Mapped Broadcast Archive"
          intro="The handoff’s three broadcast records now sit alongside the existing tower signals. External media remains reference-only until stable copies and Guardian approval are complete."
          accent="magenta"
        />
      </main>
    </div>
  );
}
