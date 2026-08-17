import { ArrowLeft, Brush, Image, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import HandoffArchiveSignals from "@/components/HandoffArchiveSignals";
import { LivingWorldWeb } from "@/components/LivingWorldWeb";

const gallerySignals = [
  { title: "Identity Fragments", detail: "AO logo concepts / identity archive", text: "A protected gallery lane for approved marks, symbols, themes, and visual fragments that help the Universe recognize itself.", accent: "#20cde2", icon: Image },
  { title: "Creator Signal Wall", detail: "Five archived records / creator lane", text: "A place to surface approved creator work, character identity, and the visual language of the worlds already in motion.", accent: "#e853dc", icon: Brush },
  { title: "Background Relay", detail: "Neon environment / one background source", text: "A living backdrop lane for atmosphere, interface surfaces, and future world-card art that stays inside the AO palette.", accent: "#d8ae55", icon: Sparkles },
];

export default function NeonGallery() {
  const [, navigate] = useLocation();
  return (
    <div className="ao-world-page min-h-screen text-white" style={{ backgroundColor: "#050914" }}>
      <LivingWorldWeb variant="cyan" />
      <nav className="sticky top-0 z-20 border-b border-[#20cde2]/30 bg-[#050914]/95 px-6 py-4 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4"><Button variant="ghost" onClick={() => navigate("/")} className="gap-2 text-[#20cde2] hover:bg-[#20cde2]/10 hover:text-[#20cde2]"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back to Universe Map</Button><span className="hidden text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55] sm:inline">AO / Neon Gallery</span></div></nav>
      <main className="mx-auto max-w-7xl px-6 py-10 sm:py-14"><section className="relative overflow-hidden rounded-2xl border border-[#20cde2]/60 bg-[radial-gradient(circle_at_15%_20%,rgba(0,240,255,0.16),transparent_32%),radial-gradient(circle_at_90%_10%,rgba(255,47,208,0.14),transparent_34%),#0f111b] p-7 shadow-[0_0_28px_rgba(0,240,255,0.16)] sm:p-12"><div className="relative max-w-3xl"><p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#d8ae55]">Community Entry / Art & Identity</p><h1 className="text-4xl font-black tracking-tight text-[#20cde2] sm:text-6xl">// NEON GALLERY //</h1><p className="mt-4 text-xl font-semibold text-[#e853dc] sm:text-2xl">Art, identity, and the marks we leave behind.</p><p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">The Neon Gallery is the handoff’s art-and-identity community: a protected place for approved creator work, visual systems, logos, backgrounds, and identity fragments.</p></div></section><section className="mt-10 grid gap-5 lg:grid-cols-3" aria-label="Neon Gallery signals">{gallerySignals.map((signal) => { const Icon = signal.icon; return <article key={signal.title} className="relative flex min-h-[250px] flex-col rounded-xl border bg-[#0d1b2b] p-6" style={{ borderColor: `${signal.accent}99`, boxShadow: `0 0 22px ${signal.accent}22` }}><div className="flex items-center justify-between"><Icon className="h-8 w-8" style={{ color: signal.accent }} aria-hidden="true" /><span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: signal.accent }}>Approved lane</span></div><div className="mt-8 flex-1"><h2 className="text-2xl font-black" style={{ color: signal.accent }}>{signal.title}</h2><p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-[#d8ae55]">{signal.detail}</p><p className="mt-4 text-sm leading-6 text-slate-400">{signal.text}</p></div></article>; })}</section>
          <HandoffArchiveSignals
            route="/neon-gallery"
            title="Source-Mapped Identity Archive"
            intro="Creator identity, AO marks, and visual environment records are now attached to the Neon Gallery route. The gallery remains additive and review-gated while approved local media is prepared."
            accent="cyan"
          />
        </main>
    </div>
  );
}
