import { ArrowUpRight, ShieldCheck, Sparkles, Star, Users } from "lucide-react";
import { useLocation } from "wouter";
import { aoCityNodes, sanctuaryIdentityPrinciples } from "@/content/aoCitySanctuaryContent";

const accentClasses = {
  cyan: "border-[#20cde2]/50 text-[#20cde2]",
  magenta: "border-[#e853dc]/50 text-[#e853dc]",
  gold: "border-[#d8ae55]/60 text-[#d8ae55]",
} as const;

const readinessLabels = {
  live: "Live route",
  "content-awaiting": "Content awaiting",
  "review-gated": "Guardian review",
} as const;

export function AOCityPulse() {
  const [, navigate] = useLocation();

  return (
    <section className="relative z-10 border-y border-[#20405c] bg-[#08101c]/90 px-6 py-12" aria-labelledby="ao-city-pulse-title">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55]">AO-City Core / Authored Packet</p>
            <h2 id="ao-city-pulse-title" className="mt-2 text-3xl font-black text-[#20cde2]">Six places. One living rhythm.</h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-400">The first authored content layer connects the Map to its guides, pillars, readiness states, and Guardian-reviewed future.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {aoCityNodes.map((node) => (
            <article key={node.id} className="flex min-h-[210px] flex-col border border-[#20405c] bg-[#0e1726]/90 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d8ae55]">{node.pillar}</p>
                  <h3 className="mt-2 text-xl font-black text-white">{node.title}</h3>
                </div>
                <span className="border border-[#20405c] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">{readinessLabels[node.readiness]}</span>
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[#e853dc]">Guide: {node.guide} · {node.signal}</p>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{node.description}</p>
              <button type="button" onClick={() => navigate(node.route)} className="mt-5 inline-flex items-center gap-2 self-start text-xs font-bold uppercase tracking-[0.16em] text-[#20cde2] hover:text-white">
                Open destination <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SanctuaryIdentityPulse() {
  return (
    <section className="relative z-10 border-y border-[#20405c] bg-[#070d18]/90 px-6 py-12" aria-labelledby="sanctuary-identity-title">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-[#d8ae55]" aria-hidden="true" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55]">Sanctuary Identity / Authored Principles</p>
            <h2 id="sanctuary-identity-title" className="mt-2 text-3xl font-black text-[#20cde2]">A member space with a memory.</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {sanctuaryIdentityPrinciples.map((principle) => (
            <article key={principle.id} className={`border bg-[#0e1726]/90 p-5 ${accentClasses[principle.accent]}`}>
              <div className="mb-4 flex items-center gap-2" aria-hidden="true">
                {principle.id === "identity" ? <Sparkles className="h-5 w-5" /> : principle.id === "social-good" ? <Star className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{principle.accent}</span>
              </div>
              <h3 className="text-xl font-black text-white">{principle.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{principle.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
