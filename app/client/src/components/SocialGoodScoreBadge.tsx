import { Heart } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function SocialGoodScoreBadge() {
  const { data, isLoading } = trpc.socialGood.getScore.useQuery(undefined, {
    staleTime: 30_000,
  });

  return (
    <div
      className="fixed right-4 top-4 z-50 inline-flex items-center gap-2 rounded-full border border-[#d8ae55]/70 bg-[#050914]/90 px-3 py-2 text-xs font-bold text-[#d8ae55] shadow-[0_0_18px_rgba(255,210,63,0.18)] backdrop-blur"
      aria-label="Global Social Good Score"
      title="Global Social Good Score"
    >
      <Heart className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">Social Good</span>
      <span>{isLoading ? "…" : (data?.totalScore ?? 0)}</span>
    </div>
  );
}
