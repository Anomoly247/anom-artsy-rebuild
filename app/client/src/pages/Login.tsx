import { useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

export default function Login() {
  const started = useRef(false);
  const [error, setError] = useState<string | null>(null);

  const beginSignIn = () => {
    if (started.current) return;
    started.current = true;

    try {
      startLogin();
    } catch {
      started.current = false;
      setError("Secure sign-in is temporarily unavailable. Please try again shortly.");
    }
  };

  useEffect(() => {
    beginSignIn();
  }, []);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#060812] px-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(32,205,226,0.16),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(232,83,220,0.18),transparent_35%)]" />
      <section className="relative w-full max-w-md rounded-2xl border border-[#20cde2]/40 bg-[#0b0e14]/90 p-8 text-center shadow-[0_0_45px_rgba(32,205,226,0.15)] backdrop-blur-xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#e853dc]/50 bg-[#e853dc]/10 text-[#20cde2]">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#d7ab4e]">AO Identity Gateway</p>
        <h1 className="mt-3 text-2xl font-semibold text-[#20cde2]">Connecting you securely</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">Your sign-in request is being sent to the protected authentication service.</p>
        {error ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-[#e853dc]">{error}</p>
            <Button type="button" onClick={beginSignIn} className="bg-[#e853dc] text-white hover:bg-[#e853dc]/90">Try Sign In Again</Button>
          </div>
        ) : (
          <Button type="button" variant="outline" onClick={beginSignIn} className="mt-6 border-[#20cde2]/50 bg-transparent text-[#20cde2] hover:bg-[#20cde2]/10 hover:text-[#20cde2]">Continue to Sign In</Button>
        )}
      </section>
    </main>
  );
}
