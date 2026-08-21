import { Check, ExternalLink, LockKeyhole, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";

type PreviewOption = {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: "background" | "glow";
  imageUrl?: string | null;
  previewClass: string;
  priceAnom: string;
  priceReal: string;
  previewOnly?: boolean;
};

const previewFallbacks: PreviewOption[] = [
  {
    id: 0,
    slug: "moonberry-background",
    name: "Moonberry Farm",
    description: "A cozy story-world background from Anom’s Corner.",
    category: "background",
    imageUrl: "/media/anoms-corner/moonberry-1920x1080.webp",
    previewClass: "bg-ao-midnight",
    priceAnom: "Preview",
    priceReal: "0",
    previewOnly: true,
  },
  {
    id: 0,
    slug: "cyan-thread-glow",
    name: "Cyan Thread Glow",
    description: "A calm cyan halo for a connected identity.",
    category: "glow",
    previewClass: "shadow-ao-cyan",
    priceAnom: "Preview",
    priceReal: "0",
    previewOnly: true,
  },
  {
    id: 0,
    slug: "gold-orbit-glow",
    name: "Gold Orbit Glow",
    description: "A warm mission accent for profiles and approved spaces.",
    category: "glow",
    previewClass: "shadow-ao-gold",
    priceAnom: "Preview",
    priceReal: "0",
    previewOnly: true,
  },
];

export default function StoreCosmeticPreview() {
  const { isAuthenticated } = useAuth();
  const { data: catalog = [] } = trpc.store.listCatalog.useQuery();
  const unlockMutation = trpc.store.unlockWithCoin.useMutation({
    onSuccess: () => toast.success("Cosmetic unlocked. It is now available in your entitlements."),
    onError: (error) => toast.error(error.message),
  });
  const checkoutMutation = trpc.store.createCheckout.useMutation({
    onError: (error) => toast.error(error.message),
  });
  const [selectedSlug, setSelectedSlug] = useState(previewFallbacks[0].slug);

  const options = useMemo<PreviewOption[]>(() => {
    const published = catalog
      .filter((item) => item.category === "background" || item.category === "glow")
      .map((item) => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        description: item.description ?? "Approved AO cosmetic.",
        category: item.category as "background" | "glow",
        imageUrl: item.imageUrl,
        previewClass: item.previewClass ?? "bg-ao-midnight",
        priceAnom: String(item.priceAnom ?? "0"),
        priceReal: String(item.priceReal ?? "0"),
      }));
    return published.length > 0 ? published : previewFallbacks;
  }, [catalog]);

  const selected = options.find((option) => option.slug === selectedSlug) ?? options[0];
  const isImagePreview = selected?.category === "background" && selected.imageUrl;

  return (
    <section className="relative overflow-hidden border border-ao-cyan/30 bg-ao-surface p-5 shadow-ao-cyan sm:p-7" aria-labelledby="cosmetic-preview-title">
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="ao-kicker text-ao-gold">STORE LAB // PREVIEW</p>
          <h2 id="cosmetic-preview-title" className="mt-2 font-ao-display text-3xl text-ao-white">Try on your next world layer.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ao-copy-muted">Preview approved backgrounds and glow treatments before using Anom Coin or a membership entitlement.</p>
        </div>
        <Sparkles className="h-7 w-7 text-ao-cyan" aria-hidden="true" />
      </div>

      <div className="relative z-10 mt-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div
          className={`relative min-h-[280px] overflow-hidden border border-white/15 ${selected?.previewClass ?? "bg-ao-midnight"}`}
          style={isImagePreview ? { backgroundImage: `linear-gradient(110deg, rgba(5,9,20,.92), rgba(5,9,20,.28)), url(${selected.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
          aria-label={`Preview of ${selected?.name}`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(32,205,226,.28),transparent_35%),radial-gradient(circle_at_30%_75%,rgba(232,83,220,.22),transparent_32%)]" aria-hidden="true" />
          <div className="relative flex min-h-[280px] flex-col justify-end p-6">
            <p className="font-ao-mono text-xs font-bold uppercase tracking-[0.24em] text-ao-gold">{selected?.category}</p>
            <h3 className="mt-2 font-ao-display text-4xl text-ao-white">{selected?.name}</h3>
            <p className="mt-2 max-w-lg text-sm text-ao-copy-muted">{selected?.description}</p>
          </div>
        </div>

        <div className="space-y-3" aria-label="Cosmetic choices">
          {options.map((option) => {
            const active = option.slug === selected?.slug;
            return (
              <button
                key={option.slug}
                type="button"
                onClick={() => setSelectedSlug(option.slug)}
                className={`flex w-full items-center justify-between border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ao-focus ${active ? "border-ao-cyan bg-ao-cyan/10" : "border-white/10 bg-ao-midnight/70 hover:border-ao-cyan/60"}`}
                aria-pressed={active}
              >
                <span>
                  <span className="block text-sm font-bold text-ao-white">{option.name}</span>
                  <span className="mt-1 block text-xs text-ao-copy-subtle">{option.priceAnom === "Preview" ? "Preview only" : `${option.priceAnom} Anom Coin`}</span>
                </span>
                {active ? <Check className="h-5 w-5 text-ao-cyan" aria-hidden="true" /> : null}
              </button>
            );
          })}
          {selected?.previewOnly ? (
            <p className="border border-ao-gold/30 bg-ao-gold/5 p-3 text-xs leading-5 text-ao-copy-muted">This is a safe preview record. A Guardian-approved catalog item will enable a server-confirmed unlock.</p>
          ) : isAuthenticated ? (
            <div className="space-y-2">
              <Button className="w-full bg-ao-cyan text-ao-midnight hover:bg-ao-cyan/90" onClick={() => unlockMutation.mutate({ catalogItemId: selected.id })} disabled={unlockMutation.isPending || checkoutMutation.isPending}>
                <LockKeyhole className="mr-2 h-4 w-4" aria-hidden="true" />
                Unlock with Anom Coin
              </Button>
              {Number(selected.priceReal) > 0 ? (
                <Button variant="outline" className="w-full border-ao-gold/60 text-ao-gold hover:bg-ao-gold/10" onClick={async () => {
                  try {
                    const result = await checkoutMutation.mutateAsync({ purchaseType: "catalog_item", referenceId: selected.id, requestKey: `catalog-item-${selected.id}-${crypto.randomUUID()}` });
                    if (result.url) window.location.assign(result.url);
                  } catch {
                    // The mutation toast contains the server-confirmed error.
                  }
                }} disabled={unlockMutation.isPending || checkoutMutation.isPending}>
                  <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                  Buy digitally · ${Number(selected.priceReal).toFixed(2)}
                </Button>
              ) : null}
            </div>
          ) : (
            <Link href="/login" className="block border border-ao-gold/60 p-3 text-center text-sm font-bold text-ao-gold hover:bg-ao-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ao-focus">Sign in to unlock cosmetics</Link>
          )}
        </div>
      </div>
    </section>
  );
}
