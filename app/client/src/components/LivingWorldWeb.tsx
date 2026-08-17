import { type CSSProperties } from "react";

type LivingWorldWebProps = {
  variant?: "cyan" | "magenta" | "gold";
  className?: string;
};

const nodes: Array<{ className: string; style: CSSProperties }> = [
  { className: "ao-web-node ao-web-node-a", style: { left: "8%", top: "18%" } },
  { className: "ao-web-node ao-web-node-b", style: { left: "24%", top: "42%" } },
  { className: "ao-web-node ao-web-node-c", style: { left: "40%", top: "12%" } },
  { className: "ao-web-node ao-web-node-d", style: { left: "55%", top: "54%" } },
  { className: "ao-web-node ao-web-node-e", style: { left: "72%", top: "24%" } },
  { className: "ao-web-node ao-web-node-f", style: { left: "88%", top: "62%" } },
  { className: "ao-web-node ao-web-node-g", style: { left: "65%", top: "82%" } },
  { className: "ao-web-node ao-web-node-h", style: { left: "16%", top: "78%" } },
];

export function LivingWorldWeb({ variant = "cyan", className = "" }: LivingWorldWebProps) {
  return (
    <div className={`ao-living-web ao-living-web-${variant} ${className}`} aria-hidden="true">
      <div className="ao-web-grid" />
      <div className="ao-web-threads ao-web-threads-one" />
      <div className="ao-web-threads ao-web-threads-two" />
      <div className="ao-web-threads ao-web-threads-three" />
      <div className="ao-web-orbit ao-web-orbit-one" />
      <div className="ao-web-orbit ao-web-orbit-two" />
      {nodes.map((node) => (
        <span key={node.className} className={node.className} style={node.style} />
      ))}
    </div>
  );
}
