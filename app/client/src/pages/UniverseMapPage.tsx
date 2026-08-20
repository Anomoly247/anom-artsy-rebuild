import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import UniverseMap from "@/components/UniverseMap";
import { LivingWorldWeb } from "@/components/LivingWorldWeb";
import { Button } from "@/components/ui/button";
import { useOwnerView } from "@/contexts/OwnerViewContext";

export default function UniverseMapPage() {
  const [, navigate] = useLocation();
  const { linkConfig } = useOwnerView();

  return (
    <main className="ao-world-page min-h-screen bg-[#050914] text-[#20cde2]">
      <LivingWorldWeb variant="cyan" />
      <header className="relative z-10 border-b border-[#20cde2]/40 bg-[#050914]/95 px-6 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55]">AO Universe Navigation</p>
            <h1 className="mt-2 text-2xl font-black text-[#20cde2]">Living World Map</h1>
          </div>
          <Button
            variant="outline"
            className="gap-2 border-[#e853dc]/70 text-[#e853dc] hover:bg-[#e853dc]/10"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Welcome Home
          </Button>
        </div>
      </header>
      <div className="relative z-10">
        <UniverseMap shopUrl={linkConfig.store} />
      </div>
    </main>
  );
}
