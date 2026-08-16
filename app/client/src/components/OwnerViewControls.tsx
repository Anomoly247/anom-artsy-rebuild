import { useEffect, useState } from "react";
import { Eye, Link2, Plus, RotateCcw, Save, ShieldCheck, SlidersHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOwnerView } from "@/contexts/OwnerViewContext";
import { DEFAULT_LINK_CONFIG, normalizeLinkConfig, type LinkConfig } from "@/lib/linkConfig";

function isValidHttpUrl(value: string, allowEmpty = false) {
  if (allowEmpty && value === "") return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isDraftValid(config: LinkConfig) {
  const socialValues = Object.values(config.social);
  return (
    isValidHttpUrl(config.universe) &&
    isValidHttpUrl(config.store) &&
    socialValues.every((value) => isValidHttpUrl(value, true)) &&
    isValidHttpUrl(config.banner.ctaUrl) &&
    config.partners.every((partner) => partner.label.trim().length > 0 && isValidHttpUrl(partner.url))
  );
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
        <Button type="button" size="sm" variant="ghost" aria-pressed={!isAdminView} onClick={() => !isAdminView || toggleAdminView()} className={`h-8 rounded-full px-3 text-xs ${!isAdminView ? "bg-[#20cde2] text-[#03050c] hover:bg-[#20cde2]/90" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>
          <Eye className="mr-1.5 h-3.5 w-3.5" /> Public View
        </Button>
        <Button type="button" size="sm" variant="ghost" aria-pressed={isAdminView} onClick={() => isAdminView || toggleAdminView()} className={`h-8 rounded-full px-3 text-xs ${isAdminView ? "bg-[#e853dc] text-white hover:bg-[#e853dc]/90" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>
          <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" /> Admin View
        </Button>
      </div>
    </div>
  );
}

export function OwnerPanel() {
  const { isOwner, isAdminView, linkConfig, updateLink, saveLinks, isSavingLinks, resetLinks } = useOwnerView();
  const [draft, setDraft] = useState<LinkConfig>(linkConfig);

  useEffect(() => {
    setDraft(linkConfig);
  }, [linkConfig]);

  if (!isOwner || !isAdminView) return null;

  const applyDraft = (next: LinkConfig, patch: Parameters<typeof updateLink>[0]) => {
    setDraft(next);
    updateLink(patch);
  };

  const updateCore = (key: "universe" | "store", value: string) => {
    const next = { ...draft, [key]: value } as LinkConfig;
    setDraft(next);
    if (isValidHttpUrl(value)) updateLink({ [key]: value });
  };

  const updateSocial = (key: keyof LinkConfig["social"], value: string) => {
    const next = { ...draft, social: { ...draft.social, [key]: value } };
    setDraft(next);
    if (isValidHttpUrl(value, true)) updateLink({ social: { [key]: value } as Partial<LinkConfig["social"]> });
  };

  const updateBanner = (patch: Partial<LinkConfig["banner"]>) => {
    const next = { ...draft, banner: { ...draft.banner, ...patch } };
    applyDraft(next, { banner: patch });
  };

  const updatePartner = (index: number, patch: Partial<LinkConfig["partners"][number]>) => {
    const partners = draft.partners.map((partner, partnerIndex) => partnerIndex === index ? { ...partner, ...patch } : partner);
    const next = { ...draft, partners };
    setDraft(next);
    if (partners.every((partner) => partner.label.trim() && isValidHttpUrl(partner.url))) updateLink({ partners });
  };

  const addPartner = () => {
    setDraft((current) => ({ ...current, partners: [...current.partners, { label: "", url: "" }] }));
  };

  const removePartner = (index: number) => {
    const partners = draft.partners.filter((_, partnerIndex) => partnerIndex !== index);
    applyDraft({ ...draft, partners }, { partners });
  };

  const save = async () => {
    if (!isDraftValid(draft)) {
      toast.error("Finish each URL and partner label before saving.");
      return;
    }
    try {
      await saveLinks(normalizeLinkConfig(draft));
      toast.success("Owner configuration saved permanently.");
    } catch {
      toast.error("Could not save owner configuration. Please try again.");
    }
  };

  const reset = () => {
    resetLinks();
    setDraft(DEFAULT_LINK_CONFIG);
  };

  return (
    <aside className="fixed right-4 top-20 z-[60] max-h-[calc(100vh-6rem)] w-[min(92vw,480px)] overflow-y-auto overflow-x-hidden rounded-2xl border border-[#e853dc]/50 bg-[#03050c]/95 text-white shadow-[0_0_55px_rgba(232,83,220,0.22)] backdrop-blur-2xl">
      <div className="sticky top-0 z-10 border-b border-white/10 bg-[#03050c]/95 px-5 py-4 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#d7ab4e]">Owner Controls</p>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-[#20cde2]"><SlidersHorizontal className="h-5 w-5" /> Owner Panel</h2>
          </div>
          <span className="rounded-full border border-[#e853dc]/50 px-2 py-1 text-[10px] uppercase tracking-wider text-[#e853dc]">Live preview</span>
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-400">Draft edits preview instantly. Use Save Permanently to store them in the shared AO backend for future sessions and devices.</p>
      </div>

      <div className="space-y-6 p-5">
        <section className="space-y-4">
          <SectionHeading icon={<Link2 className="h-4 w-4 text-[#20cde2]" />} label="Core destinations" />
          <LinkField label="Enter Sanctuary / Universe" value={draft.universe} onChange={(value) => updateCore("universe", value)} />
          <LinkField label="Store / Merch" value={draft.store} onChange={(value) => updateCore("store", value)} />
        </section>

        <section className="space-y-4 border-t border-white/10 pt-5">
          <SectionHeading icon={<Link2 className="h-4 w-4 text-[#e853dc]" />} label="Social media links" />
          <div className="grid gap-3 sm:grid-cols-2">
            <LinkField label="YouTube" value={draft.social.youtube} onChange={(value) => updateSocial("youtube", value)} allowEmpty />
            <LinkField label="Instagram" value={draft.social.instagram} onChange={(value) => updateSocial("instagram", value)} allowEmpty />
            <LinkField label="GitHub" value={draft.social.github} onChange={(value) => updateSocial("github", value)} allowEmpty />
            <LinkField label="TikTok" value={draft.social.tiktok} onChange={(value) => updateSocial("tiktok", value)} allowEmpty />
            <LinkField label="X / Twitter" value={draft.social.x} onChange={(value) => updateSocial("x", value)} allowEmpty />
          </div>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-5">
          <SectionHeading icon={<SlidersHorizontal className="h-4 w-4 text-[#d7ab4e]" />} label="Custom banner" />
          <label className="flex items-center gap-3 text-xs text-slate-300"><input type="checkbox" checked={draft.banner.enabled} onChange={(event) => updateBanner({ enabled: event.target.checked })} className="h-4 w-4 accent-[#e853dc]" /> Show this banner in Public View</label>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField label="Eyebrow" value={draft.banner.eyebrow} onChange={(value) => updateBanner({ eyebrow: value })} />
            <TextField label="CTA label" value={draft.banner.ctaLabel} onChange={(value) => updateBanner({ ctaLabel: value })} />
          </div>
          <TextField label="Banner title" value={draft.banner.title} onChange={(value) => updateBanner({ title: value })} />
          <TextAreaField label="Banner message" value={draft.banner.message} onChange={(value) => updateBanner({ message: value })} />
          <LinkField label="Banner CTA URL" value={draft.banner.ctaUrl} onChange={(value) => updateBanner({ ctaUrl: value })} />
        </section>

        <section className="space-y-4 border-t border-white/10 pt-5">
          <div className="flex items-center justify-between"><SectionHeading icon={<Link2 className="h-4 w-4 text-[#20cde2]" />} label="External partner sites" /><Button type="button" size="sm" variant="outline" onClick={addPartner} disabled={draft.partners.length >= 8} className="border-[#20cde2]/40 bg-transparent text-[#20cde2] hover:bg-[#20cde2]/10 hover:text-[#20cde2]"><Plus className="mr-1 h-3.5 w-3.5" /> Add</Button></div>
          {draft.partners.length === 0 && <p className="rounded-lg border border-dashed border-white/15 px-3 py-4 text-center text-xs text-slate-500">No partner sites configured yet.</p>}
          {draft.partners.map((partner, index) => <div key={`partner-${index}`} className="rounded-lg border border-white/10 bg-black/20 p-3"><div className="mb-2 flex items-center justify-between"><span className="text-[10px] uppercase tracking-wider text-[#d7ab4e]">Partner {index + 1}</span><Button type="button" size="icon" variant="ghost" onClick={() => removePartner(index)} className="h-7 w-7 text-slate-500 hover:bg-[#e853dc]/10 hover:text-[#e853dc]"><Trash2 className="h-3.5 w-3.5" /></Button></div><div className="grid gap-3 sm:grid-cols-2"><TextField label="Display label" value={partner.label} onChange={(value) => updatePartner(index, { label: value })} /><LinkField label="Partner URL" value={partner.url} onChange={(value) => updatePartner(index, { url: value })} /></div></div>)}
        </section>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-5">
          <span className="text-[11px] leading-4 text-slate-500">HTTPS URLs only. Maximum 8 partners.</span>
          <div className="flex shrink-0 gap-2"><Button type="button" size="sm" variant="outline" onClick={reset} className="border-white/20 bg-transparent text-slate-200 hover:bg-white/10 hover:text-white"><RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset</Button><Button type="button" size="sm" onClick={save} disabled={!isDraftValid(draft) || isSavingLinks} className="bg-[#e853dc] text-white hover:bg-[#e853dc]/90"><Save className="mr-1.5 h-3.5 w-3.5" /> {isSavingLinks ? "Saving…" : "Save Permanently"}</Button></div>
        </div>
      </div>
    </aside>
  );
}

function SectionHeading({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <div className="flex items-center gap-2 text-sm font-medium text-white">{icon}{label}</div>;
}

function LinkField({ label, value, onChange, allowEmpty = false }: { label: string; value: string; onChange: (value: string) => void; allowEmpty?: boolean }) {
  const invalid = value.length > 0 && !isValidHttpUrl(value);
  return <label className="block space-y-2"><span className="text-xs font-medium text-slate-300">{label}</span><Input value={value} onChange={(event) => onChange(event.target.value)} spellCheck={false} inputMode="url" aria-invalid={invalid} placeholder={allowEmpty ? "Optional" : "https://"} className={`h-10 border-white/15 bg-black/30 text-sm text-white placeholder:text-slate-600 focus-visible:border-[#20cde2] focus-visible:ring-[#20cde2]/30 ${invalid ? "border-[#e853dc]" : ""}`} />{invalid && <span className="text-[10px] text-[#e853dc]">Enter a valid http(s) URL.</span>}</label>;
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block space-y-2"><span className="text-xs font-medium text-slate-300">{label}</span><Input value={value} onChange={(event) => onChange(event.target.value)} className="h-10 border-white/15 bg-black/30 text-sm text-white placeholder:text-slate-600 focus-visible:border-[#20cde2] focus-visible:ring-[#20cde2]/30" /></label>;
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block space-y-2"><span className="text-xs font-medium text-slate-300">{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} className="w-full resize-y rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#20cde2] focus:ring-2 focus:ring-[#20cde2]/30" /></label>;
}
