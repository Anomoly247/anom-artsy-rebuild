import { ArrowLeft, ExternalLink, Heart, Sparkles, ShoppingBag, Star, Shield, Trophy } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LivingWorldWeb } from "@/components/LivingWorldWeb";
import StoreCosmeticPreview from "@/components/StoreCosmeticPreview";
import StoreMembershipSection from "@/components/StoreMembershipSection";

const storeUrl = "https://anomarsty.lol/";

const storeSignals = [
  {
    icon: Sparkles,
    title: "AO Supporter Circle",
    text: "Digital art, identity pieces, and world artifacts made inside the AO creative studio.",
    accent: "text-[#20cde2]",
  },
  {
    icon: Heart,
    title: "Made with meaning",
    text: "Every collection belongs to the living world and supports the social-good direction of the Universe.",
    accent: "text-[#e853dc]",
  },
  {
    icon: Star,
    title: "World-connected",
    text: "Return to the Map whenever you want to move from merchandise back into stories, games, and communities.",
    accent: "text-[#d8ae55]",
  },
];

export default function Store() {
  const [, navigate] = useLocation();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050914] text-[#a0a8c0]">
      <LivingWorldWeb variant="magenta" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8 sm:px-10 lg:px-14">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#20cde2] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#20cde2]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to AO Homeworld
          </Link>

          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#e853dc] px-4 py-2 text-xs font-bold text-black transition hover:bg-[#e853dc]/80"
          >
            <ShoppingBag className="h-4 w-4" />
            Official AO Shop
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Hero Section */}
        <section className="mt-12 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e853dc]/40 bg-[#e853dc]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#e853dc]">
            <ShoppingBag className="h-3.5 w-3.5" />
            AO Supporter Circle & Store
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Supporter <span className="text-[#e853dc]">Vault</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#7a7f8e]">
            Unlock exclusive cosmetic overlays, support ongoing series production, and join the AO Supporter Circle.
          </p>
        </section>

        {/* Core Store Signals */}
        <section className="mt-12 grid gap-6 sm:grid-cols-3">
          {storeSignals.map((signal) => {
            const SignalIcon = signal.icon;
            return (
              <div
                key={signal.title}
                className="rounded-xl border border-[#2a2f3e] bg-[#0d1b2b]/80 p-6 backdrop-blur"
              >
                <SignalIcon className={`h-6 w-6 ${signal.accent} mb-3`} />
                <h3 className="text-lg font-bold text-white mb-1">{signal.title}</h3>
                <p className="text-xs text-[#a0a8c0] leading-relaxed">{signal.text}</p>
              </div>
            );
          })}
        </section>

        {/* Supporter Membership Section */}
        <section className="mt-16">
          <StoreMembershipSection />
        </section>

        {/* Cosmetic Previews Section */}
        <section className="mt-16">
          <StoreCosmeticPreview />
        </section>

        {/* External Shop Redirect Banner */}
        <section className="mt-16 rounded-2xl border border-[#20cde2]/30 bg-gradient-to-r from-[#20cde2]/10 via-[#050914] to-[#e853dc]/10 p-8 text-center backdrop-blur">
          <h3 className="text-2xl font-bold text-white">Looking for physical merchandise & prints?</h3>
          <p className="mt-2 text-sm text-[#7a7f8e]">
            Visit the main AO store portal for apparel, prints, and physical artwork releases.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <a
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-neon-cyan px-6 py-3 font-bold inline-flex items-center gap-2"
            >
              Open AO Shop <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-[#2a2f3e] pt-8 text-center text-xs text-[#7a7f8e]">
          <p>&copy; 2026 Anom Artsy. AO Supporter Circle belongs to the AO Creative Studio.</p>
        </footer>
      </div>
    </main>
  );
}
