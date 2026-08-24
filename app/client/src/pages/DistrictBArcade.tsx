import { ArrowLeft, BookOpen, Compass, Gamepad2, Grid3X3, Radar, Star, Trophy, Zap, Play } from "lucide-react";
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

const arcadeGames = [
  {
    id: "trivia",
    title: "AO Universe Trivia",
    category: "Knowledge / Speed",
    description: "Test your knowledge on District B lore, Pixel & Dot stories, and AO history to earn Glow Points.",
    reward: "+50 GP / Win",
    icon: Zap,
    accent: palette.cyan,
  },
  {
    id: "memory",
    title: "Identity Grid Memory",
    category: "Pattern / Focus",
    description: "Match high-contrast neon badges and unlock hidden cosmetic previews for your profile.",
    reward: "+75 GP / Win",
    icon: Grid3X3,
    accent: palette.magenta,
  },
  {
    id: "snack-vault",
    title: "Snack Vault Rush",
    category: "Action / Reaction",
    description: "Help Tater defend the vault against incoming snack heists before time runs out.",
    reward: "+100 GP / Win",
    icon: Trophy,
    accent: palette.gold,
  },
];

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
    <main className="relative min-h-screen overflow-hidden bg-[#050914] text-[#a0a8c0]">
      <LivingWorldWeb variant="cyan" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8 sm:px-10 lg:px-14">
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#20cde2] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#20cde2]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to AO Homeworld
          </Link>

          <Button
            onClick={() => navigate("/achievements")}
            className="btn-neon-gold text-xs"
          >
            <Trophy className="mr-2 h-4 w-4" />
            Trophy Room
          </Button>
        </div>

        {/* Hero Section */}
        <section className="mt-12 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#20cde2]/40 bg-[#20cde2]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#20cde2]">
            <Gamepad2 className="h-3.5 w-3.5" />
            District B Entertainment Sector
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            District B <span className="text-[#e853dc]">Arcade</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#7a7f8e]">
            High-contrast mini-games, leaderboard challenges, and Glow Point reward vaults. Play, earn, and customize your identity.
          </p>
        </section>

        {/* Playable Arcade Games */}
        <section className="mt-14">
          <h2 className="text-3xl font-extrabold text-white mb-6">Play & Earn</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {arcadeGames.map((game) => {
              const GameIcon = game.icon;
              return (
                <div
                  key={game.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#2a2f3e] bg-[#0d1b2b]/80 p-6 backdrop-blur transition-all hover:border-[#20cde2]/50 hover:shadow-[0_0_25px_rgba(32,205,226,0.15)]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#050914]" style={{ color: game.accent }}>
                        <GameIcon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-[#d8ae55]/20 px-3 py-1 text-xs font-bold text-[#d8ae55]">
                        {game.reward}
                      </span>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#7a7f8e]">{game.category}</span>
                    <h3 className="text-xl font-bold text-white mt-1 mb-2">{game.title}</h3>
                    <p className="text-sm text-[#a0a8c0] mb-6">{game.description}</p>
                  </div>

                  <Button
                    onClick={() => navigate("/games")}
                    className="w-full btn-neon-cyan gap-2 text-sm font-bold"
                  >
                    <Play className="h-4 w-4" />
                    Launch Game
                  </Button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Station Overview Grid */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6">Arcade Stations</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {stations.map((station) => {
              const StationIcon = station.icon;
              return (
                <div
                  key={station.title}
                  className="rounded-xl border border-[#2a2f3e] bg-[#050914]/60 p-6 backdrop-blur"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <StationIcon className="h-6 w-6" style={{ color: station.accent }} />
                    <h3 className="text-lg font-bold text-white">{station.title}</h3>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#7a7f8e] mb-2">{station.detail}</p>
                  <p className="text-sm text-[#a0a8c0]">{station.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-16">
          <HandoffArchiveSignals />
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-[#2a2f3e] pt-8 text-center text-xs text-[#7a7f8e]">
          <p>&copy; 2026 Anom Artsy. District B Arcade is part of the AO Living World.</p>
        </footer>
      </div>
    </main>
  );
}
