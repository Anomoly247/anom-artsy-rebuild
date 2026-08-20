import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startGoogleLogin } from "@/authEntryRoutes";
import { Link } from "wouter";

const loginMessages: Record<string, string> = {
  identifier: "Google signed you in, but the AO identity service could not read the account identifier. Your account was not changed.",
  database: "Google signed you in, but the AO identity record is still being prepared. Your account was not changed.",
  callback: "The secure return from Google did not complete. Your account was not changed; please try again.",
};

function getLoginError() {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("error");
}

export default function Login() {
  const started = useRef(false);
  const initialError = getLoginError();
  const [error, setError] = useState<string | null>(initialError ? loginMessages[initialError] ?? loginMessages.callback : null);

  const beginSignIn = () => {
    if (started.current) return;
    started.current = true;

    try {
      startGoogleLogin();
    } catch {
      started.current = false;
      setError("Secure sign-in is temporarily unavailable. Please try again shortly.");
    }
  };

  useEffect(() => {
    if (!initialError) beginSignIn();
  }, [initialError]);

  const hasCallbackError = Boolean(initialError);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#060812] px-6 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(32,205,226,0.16),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(232,83,220,0.18),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(32,205,226,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(232,83,220,0.06)_1px,transparent_1px)] [background-size:52px_52px]" />
      <section className="relative w-full max-w-lg border border-[#20cde2]/40 bg-[#0b0e14]/95 p-8 text-center shadow-[0_0_45px_rgba(32,205,226,0.15)] backdrop-blur-xl sm:p-10">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#e853dc]/50 bg-[#e853dc]/10 text-[#20cde2]">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#d7ab4e]">AO Identity Gateway</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#20cde2]">{hasCallbackError ? "The signal needs a reset" : "Connecting you securely"}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          {hasCallbackError
            ? "The Universe received your sign-in attempt, but the final identity handoff needs attention."
            : "Your sign-in request is being sent to the protected authentication service."}
        </p>
        {error ? (
          <div className="mt-6 border border-[#e853dc]/40 bg-[#e853dc]/10 p-4 text-left">
            <p className="text-sm leading-6 text-[#ffd8f5]">{error}</p>
          </div>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button type="button" onClick={beginSignIn} className="bg-[#e853dc] text-white hover:bg-[#e853dc]/90">
            {hasCallbackError ? "Try Sign In Again" : "Continue to Sign In"}
          </Button>
          <Link href="/universe" className="inline-flex items-center justify-center gap-2 border border-[#20cde2]/50 px-4 py-2 text-sm font-semibold text-[#20cde2] hover:bg-[#20cde2]/10">
            <ArrowLeft className="h-4 w-4" /> Return to the Map
          </Link>
        </div>
        <div className="mt-8 border-t border-white/10 pt-5 text-xs leading-5 text-slate-400">
          Admin access uses a separate protected entry and is not exposed as a public bypass on the homepage.
        </div>
      </section>
    </main>
  );
}
