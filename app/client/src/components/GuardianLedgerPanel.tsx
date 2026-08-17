import { BookOpen, Coins, ExternalLink, Heart, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { aoHandoffRecords } from "@/data/aoHandoffContent";

const reviewCandidates = aoHandoffRecords
  .filter((record) => record.status !== "source-mapped")
  .slice(0, 8);

export default function GuardianLedgerPanel() {
  const utils = trpc.useUtils();
  const { data: queue = [], isLoading: queueLoading } = trpc.guardian.getQueue.useQuery({ status: "pending" });
  const { data: balance } = trpc.coin.getBalance.useQuery();
  const { data: socialGood } = trpc.socialGood.getScore.useQuery();
  const { data: coinHistory = [] } = trpc.coin.history.useQuery();
  const reviewMutation = trpc.guardian.review.useMutation({
    onSuccess: async (_result, input) => {
      toast.success(`Guardian review marked ${input.status}.`);
      await utils.guardian.getQueue.invalidate();
    },
    onError: (error) => toast.error(`Guardian review failed: ${error.message}`),
  });

  const pendingIds = new Set(queue.map((item) => item.sourceRecordId));
  const visibleCandidates = queue.length > 0
    ? queue.map((item) => {
        const source = aoHandoffRecords.find((record) => record.id === item.sourceRecordId);
        return {
          id: item.sourceRecordId,
          route: item.route ?? source?.route ?? "unassigned",
          snippet: item.reviewerNote || source?.snippet || "Queued authored source record awaiting Guardian review.",
          status: item.status,
          mediaType: source?.mediaType ?? "Unclassified",
          worldPath: source?.worldPath ?? "Source path not yet mapped",
          sourceUrl: source?.sourceUrl,
          created: source?.created ?? "Not recorded",
        };
      })
    : reviewCandidates.map((record) => ({
        id: record.id,
        route: record.route ?? "unassigned",
        snippet: record.snippet,
        status: record.status === "pending-review" ? "pending" : "pending",
        mediaType: record.mediaType ?? "Unclassified",
        worldPath: record.worldPath ?? "Source path not yet mapped",
        sourceUrl: record.sourceUrl,
        created: record.created ?? "Not recorded",
      }));

  const review = (sourceRecordId: string, route: string, status: "pending" | "approved" | "rejected") => {
    reviewMutation.mutate({ sourceRecordId, route, status });
  };

  return (
    <section className="mt-10 space-y-6" aria-labelledby="guardian-ledger-title">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="ao-kicker">Guardian / Owner Controls</p>
          <h2 id="guardian-ledger-title" className="mt-2 font-ao-display text-3xl font-bold text-ao-cyan">Review, Protect, Record</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-ao-copy-muted">Guardian review is a publication safeguard. It does not change authorship, Anom Coin balance, or Social Good Score.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="border-ao-cyan/50 bg-ao-surface p-5 shadow-ao-cyan">
          <div className="flex items-center justify-between"><span className="ao-kicker">Anom Coin</span><Coins className="h-5 w-5 text-ao-cyan" aria-hidden="true" /></div>
          <p className="mt-4 text-3xl font-bold text-ao-cyan">{balance?.balance ?? "0"}</p>
          <p className="mt-2 text-sm text-ao-copy-muted">Spendable balance and transaction history.</p>
          <Link href="/games" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-ao-cyan underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ao-focus">Open Games Hub <ExternalLink className="h-4 w-4" aria-hidden="true" /></Link>
        </Card>
        <Card className="border-ao-magenta/50 bg-ao-surface p-5 shadow-ao-magenta">
          <div className="flex items-center justify-between"><span className="ao-kicker">Social Good Score</span><Heart className="h-5 w-5 text-ao-magenta" aria-hidden="true" /></div>
          <p className="mt-4 text-3xl font-bold text-ao-magenta">{socialGood?.totalScore ?? 0}</p>
          <p className="mt-2 text-sm text-ao-copy-muted">Impact metric kept separate from coins.</p>
          <Link href="/mission-hub" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-ao-magenta underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ao-focus">Open Mission Hub <ExternalLink className="h-4 w-4" aria-hidden="true" /></Link>
        </Card>
        <Card className="border-ao-gold/50 bg-ao-surface p-5 shadow-ao-gold">
          <div className="flex items-center justify-between"><span className="ao-kicker">Ledger Signal</span><BookOpen className="h-5 w-5 text-ao-gold" aria-hidden="true" /></div>
          <p className="mt-4 text-3xl font-bold text-ao-gold">{coinHistory.length}</p>
          <p className="mt-2 text-sm text-ao-copy-muted">Recorded Anom Coin transactions for this identity.</p>
          <p className="mt-4 text-xs font-bold uppercase tracking-ao-kicker text-ao-gold">Guardian keeps review state separate</p>
        </Card>
      </div>

      <Card className="border-ao-cyan/40 bg-ao-midnight/90 p-5 shadow-ao-cyan sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="ao-kicker">Authored Source Queue</p>
            <h3 className="mt-2 font-ao-display text-2xl font-bold text-ao-white">Guardian Review Queue</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ao-copy-muted">Queue a source record before publication, approve it after review, or reject it while preserving the original record and provenance.</p>
          </div>
          <ShieldCheck className="h-8 w-8 shrink-0 text-ao-gold" aria-hidden="true" />
        </div>

        {queueLoading ? <p className="mt-6 text-sm text-ao-copy-muted">Loading Guardian queue…</p> : null}
        {!queueLoading && visibleCandidates.length === 0 ? <p className="mt-6 rounded-ao-md border border-ao-gold/40 bg-ao-gold/5 p-4 text-sm text-ao-copy-muted">No pending records. The queue is clear.</p> : null}
        <div className="mt-6 space-y-4">
          {visibleCandidates.map((record) => {
            const isQueued = pendingIds.has(record.id);
            return (
              <article key={record.id} className="rounded-ao-md border border-ao-surface-soft bg-ao-surface-raised p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <p className="break-all text-xs font-bold uppercase tracking-ao-kicker text-ao-gold">{record.id}</p>
                    <p className="mt-2 text-sm leading-6 text-ao-copy">{record.snippet}</p>
                    <div className="mt-3 grid gap-2 text-xs text-ao-copy-subtle sm:grid-cols-2">
                      <p><span className="font-bold text-ao-cyan">Source record:</span> retained</p>
                      <p><span className="font-bold text-ao-cyan">Media:</span> {record.mediaType}</p>
                      <p><span className="font-bold text-ao-cyan">World path:</span> {record.worldPath}</p>
                      <p><span className="font-bold text-ao-cyan">Created:</span> {record.created}</p>
                      <p><span className="font-bold text-ao-cyan">Destination:</span> {record.route}</p>
                      <p><span className="font-bold text-ao-cyan">Authorship:</span> unchanged</p>
                    </div>
                    {record.sourceUrl ? <a href={record.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-bold text-ao-gold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ao-focus">Open original source reference</a> : null}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {!isQueued ? <Button size="sm" variant="outline" className="border-ao-gold/60 text-ao-gold hover:bg-ao-gold/10" onClick={() => review(record.id, record.route, "pending")} disabled={reviewMutation.isPending}>Queue for review</Button> : null}
                    <Button size="sm" className="bg-ao-cyan text-ao-midnight hover:bg-ao-cyan/90" onClick={() => review(record.id, record.route, "approved")} disabled={reviewMutation.isPending}>Approve</Button>
                    <Button size="sm" variant="outline" className="border-ao-magenta/60 text-ao-magenta hover:bg-ao-magenta/10" onClick={() => review(record.id, record.route, "rejected")} disabled={reviewMutation.isPending}>Reject</Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Card>
    </section>
  );
}
