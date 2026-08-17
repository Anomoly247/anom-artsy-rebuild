import { ArrowLeft, ExternalLink, Heart, Sparkles, ShoppingBag, Star } from "lucide-react";
import { Link } from "wouter";
import { LivingWorldWeb } from "@/components/LivingWorldWeb";
import StoreCosmeticPreview from "@/components/StoreCosmeticPreview";
import StoreMembershipSection from "@/components/StoreMembershipSection";

const storeUrl = "https://anomartsy.lol/";

const storeSignals = [
  {
    icon: Sparkles,
    title: "Anom Originals",
    text: "Digital art, identity pieces, and world artifacts made inside the AO creative studio.",
    accent: "text-ao-cyan",
  },
  {
    icon: Heart,
    title: "Made with meaning",
    text: "Every collection belongs to the living world and supports the social-good direction of the Universe.",
    accent: "text-ao-magenta",
  },
  {
    icon: Star,
    title: "World-connected",
    text: "Return to the Map whenever you want to move from merchandise back into stories, games, and communities.",
    accent: "text-ao-gold",
  },
];

export default function Store() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-ao-midnight text-ao-copy">
      <LivingWorldWeb />
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8 sm:px-10 lg:px-14">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-ao-cyan transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ao-cyan">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Anom Artsy
        </Link>

        <section className="mt-16 max-w-4xl">
          <p className="font-ao-mono text-xs font-bold uppercase tracking-[0.28em] text-ao-gold">ANOM ORIGINALS // STORE GATE</p>
          <h1 className="mt-4 max-w-3xl font-ao-display text-5xl leading-[0.95] text-ao-copy sm:text-7xl">
            The store is another world inside the Universe.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-ao-copy-muted">
            Shop the actual Anom Artsy collection at anomartsy.lol. This in-universe Store gate keeps the storefront connected to the AO Map instead of sending visitors through the old Spreadshop destination.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href={storeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 border border-ao-cyan bg-ao-cyan px-6 py-3 font-semibold text-ao-midnight shadow-ao-cyan transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              Enter the Anom Artsy Store
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-3 border border-ao-gold/70 px-6 py-3 font-semibold text-ao-gold transition-colors hover:bg-ao-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ao-gold"
            >
              Return to the Universe Map
            </Link>
          </div>
        </section>

        <div className="mt-20">
          <StoreCosmeticPreview />
        </div>

        <StoreMembershipSection />

        <section className="mt-20 grid gap-5 md:grid-cols-3" aria-label="Store principles">
          {storeSignals.map(({ icon: Icon, title, text, accent }) => (
            <article key={title} className="border border-white/10 bg-ao-panel/80 p-6 backdrop-blur-sm">
              <Icon className={`h-6 w-6 ${accent}`} aria-hidden="true" />
              <h2 className="mt-7 font-ao-display text-2xl text-ao-copy">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-ao-copy-muted">{text}</p>
            </article>
          ))}
        </section>

        <p className="mt-16 border-t border-white/10 pt-6 text-sm text-ao-copy-subtle">
          Store destination: <span className="font-ao-mono text-ao-cyan">anomartsy.lol</span> · No Spreadshop redirect is used by this route.
        </p>
      </div>
    </main>
  );
}
