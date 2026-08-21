import { useState } from "react";
import { ExternalLink, LoaderCircle, LockKeyhole, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

function formatUsd(priceCents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(priceCents / 100);
}

export default function DigitalCheckoutSection() {
  const { isAuthenticated } = useAuth();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const { data: coinPacks = [], isLoading } = trpc.store.listCoinPacks.useQuery();
  const checkout = trpc.store.createCheckout.useMutation({
    onError: (error) => {
      setActiveKey(null);
      toast.error(error.message || "Checkout is not available yet.");
    },
  });

  async function beginCheckout(referenceId: number) {
    if (!isAuthenticated) {
      startLogin();
      return;
    }
    const requestKey = `coin-pack-${referenceId}-${crypto.randomUUID()}`;
    setActiveKey(requestKey);
    try {
      const result = await checkout.mutateAsync({ purchaseType: "coin_pack", referenceId, requestKey });
      if (!result.url) throw new Error("Stripe did not return a checkout URL");
      window.location.assign(result.url);
    } catch {
      setActiveKey(null);
    }
  }

  return (
    <section className="mt-20 border border-ao-cyan/30 bg-ao-panel/85 p-6 backdrop-blur-sm sm:p-8" aria-labelledby="coin-checkout-title">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="ao-kicker text-ao-cyan">DIGITAL CHECKOUT // COIN GATE</p>
          <h2 id="coin-checkout-title" className="mt-3 font-ao-display text-3xl text-ao-copy sm:text-4xl">Fund your AO identity with Anom Coin.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-ao-copy-muted">Coin packs are digital purchases only. The server confirms payment from Stripe before adding Coins to the shared ledger; Social Good Score and Guardian review remain separate systems.</p>
        </div>
        <LockKeyhole className="h-8 w-8 text-ao-cyan" aria-hidden="true" />
      </div>

      {isLoading ? (
        <div className="mt-8 flex items-center gap-3 text-sm text-ao-copy-muted"><LoaderCircle className="h-4 w-4 animate-spin" /> Loading approved Coin packs…</div>
      ) : coinPacks.length === 0 ? (
        <div className="mt-8 border border-white/10 bg-ao-midnight/70 p-5 text-sm leading-7 text-ao-copy-muted">Coin packs are staged for Guardian review. Checkout will appear here after an owner-approved pack is published.</div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {coinPacks.map((pack) => {
            const busy = activeKey?.startsWith(`coin-pack-${pack.id}-`) ?? false;
            return (
              <article key={pack.id} className="border border-white/10 bg-ao-midnight/80 p-5">
                <Sparkles className="h-5 w-5 text-ao-cyan" aria-hidden="true" />
                <h3 className="mt-5 font-ao-display text-2xl text-ao-copy">{pack.name}</h3>
                <p className="mt-3 min-h-[64px] text-sm leading-6 text-ao-copy-muted">{pack.description ?? "Approved digital Anom Coin pack."}</p>
                <div className="mt-5 flex items-baseline justify-between border-t border-white/10 pt-4">
                  <span className="font-ao-mono text-sm text-ao-cyan">{pack.coinAmount.toLocaleString()} COIN</span>
                  <span className="font-ao-mono text-sm text-ao-gold">{formatUsd(pack.priceCents, pack.currency)}</span>
                </div>
                <button type="button" onClick={() => void beginCheckout(pack.id)} disabled={busy || checkout.isPending} className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-ao-cyan bg-ao-cyan px-4 py-3 text-sm font-semibold text-ao-midnight transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60">
                  {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" aria-hidden="true" />}
                  {isAuthenticated ? "Continue to secure checkout" : "Sign in to checkout"}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
