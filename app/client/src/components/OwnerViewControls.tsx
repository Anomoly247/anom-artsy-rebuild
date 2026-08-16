import { useEffect, useState } from "react";
import { Eye, Link2, RotateCcw, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOwnerView } from "@/contexts/OwnerViewContext";
import { DEFAULT_LINK_CONFIG, type LinkConfig } from "@/lib/linkConfig";

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function OwnerViewToggle() {
  const { isOwner, isAdminView, toggleAdminView } = useOwnerView();
  if (!isOwner) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[70] flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-[#20cde2]/50 bg-[#03050c]/90 p-1 shadow-[0_0_30px_rgba(32,205,226,0.18)] backdrop-blur-xl">
        <span className="hidden items-center gap-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d7ab4e] sm:flex">
          <ShieldCheck className="h-3.5 w-3.5" /> Owner
        </span>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          aria-pressed={!isAdminView}
          onClick={() => toggleAdminView()}
          className={`h-8 rounded-full px-3 text-xs ${!isAdminView ? "bg-[#20cde2] text-[#03050c] hover:bg-[#20cde2]/90" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
        >
          <Eye className="mr-1.5 h-3.5 w-3.5" /> Public View
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          aria-pressed={isAdminView}
          onClick={() => toggleAdminView()}
          className={`h-8 rounded-full px-3 text-xs ${isAdminView ? "bg-[#e853dc] text-white hover:bg-[#e853dc]/90" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
        >
          <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" /> Admin View
        </Button>
      </div>
    </div>
  );
}

export function OwnerPanel() {
  const { isOwner, isAdminView, linkConfig, updateLink, resetLinks } = useOwnerView();
  const [draft, setDraft] = useState<LinkConfig>(linkConfig);

  useEffect(() => {
    setDraft(linkConfig);
  }, [linkConfig]);

  if (!isOwner || !isAdminView) return null;

  const updateDraft = (key: keyof LinkConfig, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
    if (isValidHttpUrl(value)) updateLink(key, value);
  };

  const reset = () => {
    resetLinks();
    setDraft(DEFAULT_LINK_CONFIG);
  };

  return (
    <aside className="fixed right-4 top-20 z-[60] w-[min(92vw,430px)] overflow-hidden rounded-2xl border border-[#e853dc]/50 bg-[#03050c]/95 text-white shadow-[0_0_55px_rgba(232,83,220,0.22)] backdrop-blur-2xl">
      <div className="border-b border-white/10 bg-gradient-to-r from-[#e853dc]/15 via-transparent to-[#20cde2]/10 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#d7ab4e]">Owner Controls</p>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-[#20cde2]"><SlidersHorizontal className="h-5 w-5" /> Owner Panel</h2>
          </div>
          <span className="rounded-full border border-[#e853dc]/50 px-2 py-1 text-[10px] uppercase tracking-wider text-[#e853dc]">Live preview</span>
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-400">Changes are saved to this browser and apply immediately when you return to Public View. They do not modify the repository.</p>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-white"><Link2 className="h-4 w-4 text-[#20cde2]" /> Link Manager</div>
        <LinkField label="Enter Sanctuary / Universe" value={draft.universe} onChange={(value) => updateDraft("universe", value)} />
        <LinkField label="Store / Merch" value={draft.store} onChange={(value) => updateDraft("store", value)} />
        <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <span className="text-[11px] leading-4 text-slate-500">Valid HTTPS links preview as soon as they are complete.</span>
          <Button type="button" size="sm" variant="outline" onClick={reset} className="shrink-0 border-white/20 bg-transparent text-slate-200 hover:bg-white/10 hover:text-white">
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset
          </Button>
        </div>
      </div>
    </aside>
  );
}

function LinkField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-medium text-slate-300">{label}</span>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
        inputMode="url"
        className="h-10 border-white/15 bg-black/30 text-sm text-white placeholder:text-slate-600 focus-visible:border-[#20cde2] focus-visible:ring-[#20cde2]/30"
      />
    </label>
  );
}
