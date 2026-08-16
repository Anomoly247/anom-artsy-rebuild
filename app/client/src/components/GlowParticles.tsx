import React, { useEffect, useState } from "react";

interface GlowParticlesProps {
  triggerKey: string | number;
  type?: "earn" | "spend";
}

export const GlowParticles: React.FC<GlowParticlesProps> = ({ triggerKey, type = "earn" }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!triggerKey) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    setActive(true);
    const timer = setTimeout(() => setActive(false), 1200);
    return () => clearTimeout(timer);
  }, [triggerKey]);

  if (!active) return null;

  const color = type === "earn" ? "bg-cyan-400 text-cyan-950 shadow-[0_0_20px_#00ffff]" : "bg-pink-500 text-pink-950 shadow-[0_0_20px_#ff00ff]";

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 flex items-center justify-center">
      <div className={`animate-ping absolute w-32 h-32 rounded-full opacity-40 ${type === "earn" ? "bg-cyan-400" : "bg-pink-500"}`} />
      <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest animate-bounce ${color}`}>
        {type === "earn" ? "+ Glow Points Surge!" : "Points Updated"}
      </div>
    </div>
  );
};
