import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Lock, ArrowLeft, MessageSquare, Sparkles } from "lucide-react";
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { LivingWorldWeb } from "@/components/LivingWorldWeb";

export default function Lounges() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "family" as "family" | "friends" | "coworkers",
    description: "",
    neonTheme: "magenta" as "magenta" | "cyan" | "purple",
  });

  const utils = trpc.useUtils();

  // Fetch user's lounges
  const { data: myLounges = [], isLoading: loungesLoading } = trpc.lounge.getMyLounges.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const loungeIds = useMemo(
    () => myLounges.filter((lounge): lounge is NonNullable<typeof lounge> => Boolean(lounge)).map((lounge) => lounge.id),
    [myLounges]
  );

  const { data: unreadCounts = [] } = trpc.lounge.getUnreadCounts.useQuery(
    { loungeIds },
    { enabled: isAuthenticated && loungeIds.length > 0, refetchInterval: 5000 }
  );

  const unreadByLounge = new Map(unreadCounts.map((entry) => [entry.loungeId, entry.unreadCount]));

  // Create lounge mutation
  const createLoungeMutation = trpc.lounge.create.useMutation({
    onSuccess: (newLounge) => {
      toast.success("Lounge created successfully!");
      setIsCreateOpen(false);
      setFormData({ name: "", type: "family", description: "", neonTheme: "magenta" });
      utils.lounge.getMyLounges.invalidate();
      if (newLounge?.id) navigate(`/lounge/${newLounge.id}`);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create lounge");
    },
  });

  const handleCreateLounge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter a lounge name");
      return;
    }
    createLoungeMutation.mutate(formData);
  };

  if (loading || loungesLoading) {
    return (
      <div className="min-h-screen bg-[#050914] flex items-center justify-center text-[#20cde2]">
        Loading AO Lounges...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050914] flex flex-col items-center justify-center p-6 text-center text-[#a0a8c0]">
        <Lock className="h-12 w-12 text-[#e853dc] mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Sanctuary Authentication Required</h1>
        <p className="text-sm max-w-md mb-6">Please sign in to access your private community lounges.</p>
        <Button className="btn-neon-cyan" onClick={() => navigate("/")}>
          Return to Homeworld
        </Button>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050914] text-[#a0a8c0]">
      <LivingWorldWeb variant="magenta" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8 sm:px-10 lg:px-14">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#20cde2] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#20cde2]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to AO Homeworld
          </Link>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="btn-neon-magenta text-xs font-bold">
                <Plus className="mr-2 h-4 w-4" /> Create Lounge
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0d1b2b] border border-[#e853dc] text-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-[#e853dc]">Create a Sanctuary Lounge</DialogTitle>
                <DialogDescription className="text-xs text-[#a0a8c0]">
                  Set up a private room for family, friends, or collaborators with custom neon themes.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreateLounge} className="space-y-4 mt-4">
                <div>
                  <label className="text-xs font-bold text-[#20cde2]">Lounge Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. AO Creative Circle"
                    className="bg-[#050914] border-[#2a2f3e] text-white mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#20cde2]">Category Type</label>
                  <Select
                    value={formData.type}
                    onValueChange={(val: "family" | "friends" | "coworkers") => setFormData({ ...formData, type: val })}
                  >
                    <SelectTrigger className="bg-[#050914] border-[#2a2f3e] text-white mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0d1b2b] border-[#2a2f3e] text-white">
                      <SelectItem value="family">Family Sanctuary</SelectItem>
                      <SelectItem value="friends">Friends Hub</SelectItem>
                      <SelectItem value="coworkers">Collaborators Circle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#20cde2]">Neon Accent Theme</label>
                  <Select
                    value={formData.neonTheme}
                    onValueChange={(val: "magenta" | "cyan" | "purple") => setFormData({ ...formData, neonTheme: val })}
                  >
                    <SelectTrigger className="bg-[#050914] border-[#2a2f3e] text-white mt-1">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0d1b2b] border-[#2a2f3e] text-white">
                      <SelectItem value="magenta">Hot Magenta</SelectItem>
                      <SelectItem value="cyan">Electric Cyan</SelectItem>
                      <SelectItem value="purple">Cyber Purple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#20cde2]">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What is this lounge about?"
                    className="bg-[#050914] border-[#2a2f3e] text-white mt-1"
                  />
                </div>

                <Button type="submit" disabled={createLoungeMutation.isPending} className="w-full btn-neon-magenta mt-2">
                  {createLoungeMutation.isPending ? "Initializing..." : "Launch Lounge"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Hero Banner */}
        <section className="mt-12 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e853dc]/40 bg-[#e853dc]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#e853dc]">
            <Users className="h-3.5 w-3.5" />
            Sanctuary Community Lounges
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Private <span className="text-[#e853dc]">Lounges</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#7a7f8e]">
            Gather with your inner circle, share custom updates, and stay connected inside themed rooms across the AO Living World.
          </p>
        </section>

        {/* Lounge Grid */}
        <section className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Active Lounges</h2>
            <span className="text-xs font-bold text-[#d8ae55] uppercase tracking-wider">
              {myLounges.length} Sanctuary Rooms
            </span>
          </div>

          {myLounges.length === 0 ? (
            <div className="rounded-2xl border border-[#2a2f3e] bg-[#0d1b2b]/50 p-12 text-center backdrop-blur">
              <MessageSquare className="mx-auto h-12 w-12 text-[#20cde2] mb-3" />
              <h3 className="text-xl font-bold text-white">No Lounges Joined Yet</h3>
              <p className="text-sm text-[#7a7f8e] mt-2 mb-6 max-w-md mx-auto">
                Create your first sanctuary room or join an invite link to start communicating with your team.
              </p>
              <Button onClick={() => setIsCreateOpen(true)} className="btn-neon-cyan text-xs font-bold">
                <Plus className="mr-2 h-4 w-4" /> Create Your First Lounge
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myLounges.map((lounge) => {
                if (!lounge) return null;
                const unread = unreadByLounge.get(lounge.id) || 0;
                return (
                  <div
                    key={lounge.id}
                    onClick={() => navigate(`/lounge/${lounge.id}`)}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#2a2f3e] bg-[#0d1b2b]/80 p-6 backdrop-blur transition-all hover:border-[#e853dc]/50 hover:shadow-[0_0_25px_rgba(232,83,220,0.15)]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#d8ae55]">
                        {lounge.type || "Sanctuary"}
                      </span>
                      {unread > 0 && (
                        <span className="rounded-full bg-[#e853dc] px-2.5 py-0.5 text-[10px] font-black text-black">
                          {unread} new
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{lounge.name}</h3>
                    <p className="text-sm text-[#7a7f8e] line-clamp-2 mb-6">
                      {lounge.description || "Active community lounge in the AO Living World."}
                    </p>

                    <div className="flex items-center justify-between border-t border-[#2a2f3e] pt-4 text-xs font-semibold text-[#20cde2]">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" /> Members
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform">Enter Room &rarr;</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-[#2a2f3e] pt-8 text-center text-xs text-[#7a7f8e]">
          <p>&copy; 2026 Anom Artsy. Private lounges belong to the AO Creative Studio network.</p>
        </footer>
      </div>
    </main>
  );
}
