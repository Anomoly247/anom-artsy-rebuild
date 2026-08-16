import { useEffect } from "react";

interface ExternalRedirectProps {
  destination: string;
  label: string;
}

export default function ExternalRedirect({ destination, label }: ExternalRedirectProps) {
  useEffect(() => {
    window.location.replace(destination);
  }, [destination]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#03050c] px-6 text-center text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(32,205,226,0.18),transparent_34%),radial-gradient(circle_at_80%_70%,rgba(232,83,220,0.15),transparent_36%),linear-gradient(rgba(32,205,226,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(32,205,226,0.05)_1px,transparent_1px)] bg-[size:auto,auto,42px_42px,42px_42px]" />
      <section className="relative max-w-xl rounded-2xl border border-[#20cde2]/60 bg-[#03050c]/85 p-8 shadow-[0_0_50px_rgba(32,205,226,0.22)] backdrop-blur">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#d7ab4e]">Anom Artsy Connection</p>
        <h1 className="mb-4 font-serif text-3xl text-[#20cde2]">Opening {label}</h1>
        <p className="mb-6 text-sm leading-6 text-slate-300">You are being connected to the live Anom Originals experience.</p>
        <a
          href={destination}
          className="inline-flex rounded-full border border-[#20cde2] px-5 py-3 text-sm font-semibold text-[#20cde2] transition hover:bg-[#20cde2] hover:text-[#03050c]"
        >
          Continue now
        </a>
      </section>
    </main>
  );
}
