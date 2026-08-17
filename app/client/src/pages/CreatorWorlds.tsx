import { ArrowLeft, Compass, Crown, Network, Sparkles, WandSparkles } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LivingWorldWeb } from "@/components/LivingWorldWeb";

const palette = {
  base: "#050914",
  cyan: "#20cde2",
  magenta: "#e853dc",
  gold: "#d8ae55",
};

const worldSignals = [
  {
    label: "01 / Open Slot",
    title: "Your World, Your Signal",
    text: "A reserved world layer for future creator-led places, characters, stories, and systems that belong inside the AO Universe.",
    icon: Compass,
    accent: palette.cyan,
  },
  {
    label: "02 / Shared Build",
    title: "Collaboration Station",
    text: "Turn a world idea into a shared project brief, a set of tasks, and a visible path from first spark to living destination.",
    icon: Network,
    accent: palette.magenta,
    route: "/collaboration",
    action: "Open Collaboration",
  },
  {
    label: "03 / Stewardship",
    title: "Owner Control",
    text: "Keep the canon, permissions, content status, and release decisions aligned before a creator world becomes public.",
    icon: Crown,
    accent: palette.gold,
    route: "/owner",
    action: "Open Stewardship",
  },
];

export default function CreatorWorlds() {
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
            AO / Creator Worlds
          </span>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
        <section className="relative overflow-hidden rounded-2xl border border-[#20cde2]/60 bg-[radial-gradient(circle_at_15%_20%,rgba(0,240,255,0.14),transparent_32%),radial-gradient(circle_at_90%_10%,rgba(255,47,208,0.14),transparent_34%),#0f111b] p-7 shadow-[0_0_28px_rgba(0,240,255,0.16)] sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-[#e853dc]/25" />
          <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full border border-[#d8ae55]/20" />
          <div className="relative max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#d8ae55]">World Entry / Open Slot 04</p>
            <h1 className="text-4xl font-black tracking-tight text-[#20cde2] drop-shadow-[0_0_12px_rgba(0,240,255,0.35)] sm:text-6xl">
              // CREATOR WORLDS //
            </h1>
            <p className="mt-4 text-xl font-semibold text-[#e853dc] sm:text-2xl">Your World. Open Slot.</p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              A future-facing world layer for creator-led places inside Anom’s Universe. Bring a signal, shape a story, and build with care before the gates open.
            </p>
            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#d8ae55]/60 bg-[#d8ae55]/10 px-5 py-3 text-sm font-bold text-[#d8ae55] shadow-[0_0_18px_rgba(255,210,63,0.16)]">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Future user-generated worlds / template slot ready
            </div>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="world-signals-title">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55]">Living World Protocol</p>
              <h2 id="world-signals-title" className="text-3xl font-bold text-[#20cde2]">The Open Slot</h2>
            </div>
            <WandSparkles className="hidden h-8 w-8 text-[#e853dc] sm:block" aria-hidden="true" />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {worldSignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <article
                  key={signal.label}
                  className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-xl border bg-[#0d1b2b] p-6 transition-transform duration-200 hover:-translate-y-1"
                  style={{ borderColor: `${signal.accent}99`, boxShadow: `0 0 22px ${signal.accent}26` }}
                >
                  <div className="absolute -right-8 -top-8 flex h-28 w-28 items-center justify-center rounded-full border" style={{ borderColor: `${signal.accent}44`, color: `${signal.accent}55` }}>
                    <Icon className="h-12 w-12" aria-hidden="true" />
                  </div>
                  <div className="relative flex items-center justify-between gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: signal.accent }}>{signal.label}</span>
                    {signal.route && <span className="rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.18em]" style={{ borderColor: `${signal.accent}99`, color: signal.accent }}>Open</span>}
                  </div>
                  <div className="relative mt-8 flex-1">
                    <h3 className="text-2xl font-black" style={{ color: signal.accent }}>{signal.title}</h3>
                    <p className="mt-4 text-sm leading-6 text-slate-400">{signal.text}</p>
                  </div>
                  {signal.route && (
                    <Button
                      variant="outline"
                      onClick={() => navigate(signal.route!)}
                      className="relative mt-6 w-full gap-2 bg-transparent font-bold"
                      style={{ borderColor: `${signal.accent}99`, color: signal.accent }}
                    >
                      {signal.action}
                    </Button>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-12 rounded-xl border border-[#d8ae55]/50 bg-[#d8ae55]/5 p-6 text-center shadow-[0_0_22px_rgba(255,210,63,0.1)] sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55]">Creator World Guardrails</p>
          <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">Make it yours. Keep it kind. Let it earn its place.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Creator Worlds stays additive: approved worlds can grow beside the existing AO destinations without erasing the stories, beings, or pathways already living here.
          </p>
        </section>
      </main>
    </div>
  );
}
