import { Button } from "@/components/ui/button";
import { Zap, Heart, Sparkles, ShoppingBag, Trophy, ArrowRight } from "lucide-react";
import { useLocation, Link } from "wouter";
import { startGoogleLogin } from "@/authEntryRoutes";
import { useAuth } from "@/_core/hooks/useAuth";
import UniverseMap from "@/components/UniverseMap";
import { LivingWorldWeb } from "@/components/LivingWorldWeb";
import SignUpConnectors from "@/components/SignUpConnectors";
import { useOwnerView } from "@/contexts/OwnerViewContext";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { linkConfig } = useOwnerView();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050914] text-[#a0a8c0]">
      <LivingWorldWeb variant="cyan" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-14">
        {/* Top Header */}
        <header className="flex items-center justify-between border-b border-[#2a2f3e] pb-6">
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold tracking-wider text-white">
              AO <span className="text-[#20cde2]">UNIVERSE</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={() => navigate("/games")} className="btn-neon-cyan text-xs font-bold">
              <Zap className="mr-2 h-4 w-4" /> District B Arcade
            </Button>

            {!isAuthenticated ? (
              <Button onClick={startGoogleLogin} className="btn-neon-magenta text-xs font-bold">
                Sign In
              </Button>
            ) : (
              <Button onClick={() => navigate("/lounges")} className="btn-neon-gold text-xs font-bold">
                Lounges
              </Button>
            )}
          </div>
        </header>

        {/* Hero Banner */}
        <section className="mt-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#20cde2]/40 bg-[#20cde2]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#20cde2] mb-4">
            <Sparkles className="h-4 w-4 text-[#e853dc]" />
            Interactive Node System
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Identity in every <span className="text-[#e853dc]">pixel.</span>
          </h1>
          <p className="mt-4 text-lg text-[#7a7f8e] leading-relaxed">
            Select a universe node below to explore story worlds, mini-games, community lounges, and original studio releases.
          </p>
        </section>

        {/* Interactive Universe Map Canvas replacing grid box section */}
        <section className="mt-12 rounded-3xl border border-[#2a2f3e] bg-[#0d1b2b]/90 p-6 backdrop-blur shadow-[0_0_50px_rgba(32,205,226,0.1)]">
          <div className="flex items-center justify-between mb-4 px-2">
            <div>
              <h2 className="text-xl font-bold text-white">Universe Map Navigation</h2>
              <p className="text-xs text-[#7a7f8e]">Click any node to navigate directly to that world sector.</p>
            </div>
            <Button onClick={() => navigate("/neon-gallery")} className="btn-neon-magenta text-xs">
              Open Neon Gallery <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="relative min-h-[500px] w-full rounded-2xl border border-[#2a2f3e] bg-[#050914] overflow-hidden">
            <UniverseMap shopUrl={linkConfig.store} />
          </div>
        </section>

        {/* Identity Amplified / Connect Section */}
        <section className="mt-16 grid gap-8 md:grid-cols-2 items-center rounded-2xl border border-[#2a2f3e] bg-[#0d1b2b]/80 p-8 backdrop-blur">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#20cde2]">Social Good Meets Creative Power</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">Identity, Amplified</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#a0a8c0]">
              Every interaction inside the AO Universe supports creator initiatives, social-good programs, and original storytelling.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button onClick={() => navigate("/store")} className="btn-neon-cyan font-bold text-xs">
                <ShoppingBag className="mr-2 h-4 w-4" /> Supporter Vault
              </Button>
              <Button onClick={() => navigate("/pixel-and-dot")} className="btn-neon-magenta font-bold text-xs">
                Pixel & Dot Series
              </Button>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="rounded-xl border border-[#2a2f3e] bg-[#050914] p-6 text-center">
              <h3 className="text-lg font-bold text-white mb-2">Join Anom Artsy</h3>
              <p className="text-xs text-[#7a7f8e] mb-6">Create your profile, earn Glow Points, and unlock lounges.</p>
              <SignUpConnectors />
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-[#2a2f3e] pt-8 text-center text-xs text-[#7a7f8e]">
          <p>&copy; 2026 Anom Artsy. Identity in every pixel.</p>
        </footer>
      </div>
    </main>
  );
}
