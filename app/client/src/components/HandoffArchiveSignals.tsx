import { Archive, Film, Image, LockKeyhole, MessageSquareText } from "lucide-react";
import { aoHandoffRecords } from "@/data/aoHandoffContent";

type HandoffArchiveSignalsProps = {
  route: string;
  title: string;
  intro: string;
  accent?: "cyan" | "magenta" | "gold";
};

const accentMap = {
  cyan: { text: "text-[#20cde2]", border: "border-[#20cde2]/50", glow: "shadow-[0_0_22px_rgba(0,240,255,0.12)]" },
  magenta: { text: "text-[#e853dc]", border: "border-[#e853dc]/50", glow: "shadow-[0_0_22px_rgba(255,47,208,0.12)]" },
  gold: { text: "text-[#d8ae55]", border: "border-[#d8ae55]/50", glow: "shadow-[0_0_22px_rgba(255,210,63,0.12)]" },
};

function mediaIcon(mediaType: string) {
  if (mediaType === "VIDEO") return Film;
  if (mediaType === "IMAGE") return Image;
  return MessageSquareText;
}

export default function HandoffArchiveSignals({ route, title, intro, accent = "cyan" }: HandoffArchiveSignalsProps) {
  const style = accentMap[accent];
  const records = aoHandoffRecords.filter((record) => record.route === route && record.status === "source-mapped");
  const mediaCounts = records.reduce<Record<string, number>>((counts, record) => {
    counts[record.mediaType] = (counts[record.mediaType] ?? 0) + 1;
    return counts;
  }, {});

  if (!records.length) return null;

  return (
    <section className={`mt-12 rounded-2xl border bg-[#0f111b] p-6 ${style.border} ${style.glow}`} aria-labelledby={`${route}-handoff-title`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55]">Meta AI Handoff / Source-Mapped Archive</p>
          <h2 id={`${route}-handoff-title`} className={`mt-2 text-3xl font-black ${style.text}`}>{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{intro}</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          <Archive className="h-4 w-4 text-[#d8ae55]" aria-hidden="true" />
          {records.length} preserved source records
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3" aria-label="Handoff media counts">
        {Object.entries(mediaCounts).map(([type, count]) => (
          <span key={type} className="border border-[#20405c] bg-[#050914] px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-300">
            {count} {type.replace("_", " ")}
          </span>
        ))}
        <span className="inline-flex items-center gap-2 border border-[#d8ae55]/40 bg-[#d8ae55]/5 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#d8ae55]">
          <LockKeyhole className="h-3 w-3" aria-hidden="true" /> Review-gated
        </span>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-3">
        {records.slice(0, 3).map((record) => {
          const Icon = mediaIcon(record.mediaType);
          return (
            <article key={record.id} className="border border-[#20405c] bg-[#050914] p-4">
              <div className="flex items-center justify-between gap-3">
                <Icon className={`h-5 w-5 ${style.text}`} aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{record.platform} / {record.mediaType}</span>
              </div>
              <p className="mt-4 text-sm font-semibold leading-5 text-slate-200">{record.snippet || "Source record preserved for review."}</p>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#d8ae55]">Source ID preserved · {record.created}</p>
            </article>
          );
        })}
      </div>

      <p className="mt-5 text-xs leading-5 text-slate-500">External media URLs remain provenance references. Stable approved copies and Guardian review are required before public playback or download.</p>
    </section>
  );
}
