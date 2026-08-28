import { Crown, ShieldCheck, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";

const previewPlans = [
  {
    slug: "guardian-apprentice",
    name: "Guardian Apprentice",
    description: "A first membership layer for identity styling, approved backgrounds, and the growing AO journey.",
    price: "Preview tier",
    storage: "Starter identity space",
    accent: "text-ao-cyan",
  },
  {
    slug: "world-builder",
    name: "World Builder",
    description: "Expanded room for curated identity pieces, collectible backgrounds, and world-connected customization.",
    price: "Preview tier",
    storage: "Expanded identity space",
    accent: "text-ao-magenta",
  },
  {
    slug: "universe-guardian",
    name: "Universe Guardian",
    description: "A future access tier for deeper participation, approved collections, and Guardian-led community privileges.",
    price: "Preview tier",
    storage: "Full identity space",
    accent: "text-ao-gold",
  },
];

export default function StoreMembershipSection() {
  const { data: plans = [] } = trpc.store.listMembershipPlans.useQuery();
  const visiblePlans = plans.length > 0
    ? plans.map((plan) => ({
        slug: plan.slug,
        name: plan.name,
        description: plan.description ?? "Approved AO membership plan.",
        price: plan.priceAnom ? `${plan.priceAnom} Anom Coin` : "Membership tier",
        storage: plan.storageLimit ? `${plan.storageLimit} identity spaces` : "Approved identity privileges",
        accent: "text-ao-cyan",
      }))
    : previewPlans;

  return (
    <section className="mt-20 border border-ao-gold/30 bg-ao-panel/80 p-6 backdrop-blur-sm sm:p-8" aria-labelledby="membership-title">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="ao-kicker text-ao-gold">MEMBERSHIP // ACCESS LAYERS</p>
          <h2 id="membership-title" className="mt-3 font-ao-display text-3xl text-ao-copy sm:text-4xl">Choose how you grow inside the world.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white">Membership is an access layer, not a replacement for Anom Coin or Social Good. Each tier will unlock approved privileges only after the server confirms the membership.</p>
        </div>
        <Crown className="h-8 w-8 text-ao-gold" aria-hidden="true" />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {visiblePlans.map((plan) => (
          <article key={plan.slug} className="border border-white/10 bg-ao-midnight/80 p-5">
            <div className="flex items-center justify-between gap-3">
              <Sparkles className={`h-5 w-5 ${plan.accent}`} aria-hidden="true" />
              <span className="font-ao-mono text-[10px] uppercase tracking-[0.18em] text-ao-copy-subtle">{plan.price}</span>
            </div>
            <h3 className="mt-6 font-ao-display text-2xl text-ao-copy">{plan.name}</h3>
            <p className="mt-3 min-h-[84px] text-sm leading-6 text-white">{plan.description}</p>
            <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-ao-copy-subtle">
              <ShieldCheck className="h-4 w-4 text-ao-cyan" aria-hidden="true" />
              <span>{plan.storage}</span>
            </div>
            <button type="button" disabled className="mt-5 w-full cursor-not-allowed border border-white/15 px-4 py-3 text-sm font-semibold text-ao-copy-subtle opacity-80">Guardian review + membership checkout next</button>
          </article>
        ))}
      </div>
    </section>
  );
}
