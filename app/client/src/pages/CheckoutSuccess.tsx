import { CheckCircle2, LoaderCircle, ShieldCheck, XCircle } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

export default function CheckoutSuccess() {
  const { isAuthenticated } = useAuth();
  const sessionId = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("session_id") : null;
  const statusQuery = trpc.store.getCheckoutStatus.useQuery(
    { sessionId: sessionId ?? "missing" },
    { enabled: Boolean(sessionId && isAuthenticated), refetchInterval: (query) => query.state.data?.status === "paid" ? false : 2500 },
  );

  const status = statusQuery.data?.status;
  const paid = status === "paid";
  const failed = status === "failed" || status === "expired";

  return (
    <main className="min-h-screen bg-ao-midnight px-6 py-16 text-ao-copy sm:px-10">
      <div className="mx-auto max-w-2xl border border-ao-cyan/30 bg-ao-panel/85 p-8 text-center shadow-ao-cyan backdrop-blur-sm sm:p-12">
        {paid ? <CheckCircle2 className="mx-auto h-14 w-14 text-ao-cyan" aria-hidden="true" /> : failed ? <XCircle className="mx-auto h-14 w-14 text-ao-magenta" aria-hidden="true" /> : <LoaderCircle className="mx-auto h-14 w-14 animate-spin text-ao-gold" aria-hidden="true" />}
        <p className="mt-6 ao-kicker text-ao-cyan">AO CHECKOUT // SERVER CONFIRMATION</p>
        <h1 className="mt-3 font-ao-display text-4xl sm:text-5xl">{paid ? "Access confirmed." : failed ? "Checkout needs attention." : "Payment received. Confirming access…"}</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-ao-copy-muted">
          {paid ? "Your digital purchase has been confirmed by the AO server. Any Anom Coin, identity item, or membership grant is now recorded in the shared ledger." : failed ? "The server did not complete this checkout. No digital access is granted until a verified payment event is fulfilled." : "Stripe has returned you to the Universe. The Guardian and server-confirmed access path is checking the signed payment event now."}
        </p>
        <div className="mt-7 flex items-center justify-center gap-2 text-xs text-ao-copy-subtle"><ShieldCheck className="h-4 w-4 text-ao-cyan" /> No access is granted from client-side preview state.</div>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link href="/store" className="border border-ao-cyan bg-ao-cyan px-5 py-3 text-sm font-semibold text-ao-midnight">Return to Store</Link>
          <Link href="/dashboard" className="border border-ao-gold/70 px-5 py-3 text-sm font-semibold text-ao-gold">Return to Universe Map</Link>
        </div>
      </div>
    </main>
  );
}
