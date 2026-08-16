import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Lock } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useMemo, useState } from "react";
import { toast } from "sonner";

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

  // Fetch user's lounges
  const { data: myLounges = [], isLoading: loungesLoading } = trpc.lounge.getMyLounges.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  const loungeIds = useMemo(
    () => myLounges.filter((lounge): lounge is NonNullable<typeof lounge> => Boolean(lounge)).map((lounge) => lounge.id),
    [myLounges],
  );
  const { data: unreadCounts = [] } = trpc.lounge.getUnreadCounts.useQuery(
    { loungeIds },
    { enabled: isAuthenticated && loungeIds.length > 0, refetchInterval: 5000 }
  );
  const unreadByLounge = new Map(unreadCounts.map((entry) => [entry.loungeId, entry.unreadCount]));

  // Create lounge mutation
  const createMutation = trpc.lounge.create.useMutation({
    onSuccess: (lounge) => {
      if (lounge) {
        toast.success(`Lounge "${lounge.name}" created!`);
      }
      setFormData({ name: "", type: "family", description: "", neonTheme: "magenta" });
      setIsCreateOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to create lounge: ${error.message}`);
    },
  });

  const handleCreateLounge = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a lounge name");
      return;
    }

    createMutation.mutate({
      name: formData.name,
      type: formData.type,
      description: formData.description || undefined,
      neonTheme: formData.neonTheme,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-[#00eaff] text-xl">Loading Lounges...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#00eaff] text-xl mb-4">Please sign in to access lounges</p>
          <Button className="btn-neon-magenta" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#00eaff]">
      {/* Navigation */}
      <nav className="border-b border-[#2a2f3e] px-6 py-4 sticky top-0 bg-[#0b0e14]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <Button onClick={() => navigate("/")} className="shrink-0 bg-[#2a2f3e] hover:bg-[#3a3f4e] text-[#00eaff] gap-1">
              🏠 Home
            </Button>
            <h1 className="whitespace-nowrap text-xl font-bold neon-text-magenta sm:text-2xl">Private Lounges</h1>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="btn-neon-cyan w-full gap-2 sm:w-auto">
                <Plus className="w-4 h-4" />
                Create Lounge
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1a1f2e] border border-[#2a2f3e]">
              <DialogHeader>
                <DialogTitle className="text-[#ff00cc]">Create a New Lounge</DialogTitle>
                <DialogDescription className="text-[#7a7f8e]">
                  Create a private space for family, friends, or coworkers to connect.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-[#00eaff] text-sm font-medium">Lounge Name</label>
                  <Input
                    placeholder="e.g., The Family Hub"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-[#0b0e14] border-[#2a2f3e] text-[#00eaff] placeholder-[#7a7f8e]"
                  />
                </div>

                <div>
                  <label className="text-[#00eaff] text-sm font-medium">Lounge Type</label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className="bg-[#0b0e14] border-[#2a2f3e] text-[#00eaff]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1f2e] border-[#2a2f3e]">
                      <SelectItem value="family" className="text-[#00eaff]">
                        👨‍👩‍👧‍👦 Family
                      </SelectItem>
                      <SelectItem value="friends" className="text-[#00eaff]">
                        👫 Friends
                      </SelectItem>
                      <SelectItem value="coworkers" className="text-[#00eaff]">
                        💼 Coworkers
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-[#00eaff] text-sm font-medium">Description (Optional)</label>
                  <Textarea
                    placeholder="What's this lounge about?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-[#0b0e14] border-[#2a2f3e] text-[#00eaff] placeholder-[#7a7f8e]"
                  />
                </div>

                <div>
                  <label className="text-[#00eaff] text-sm font-medium">Neon Theme</label>
                  <Select value={formData.neonTheme} onValueChange={(value: any) => setFormData({ ...formData, neonTheme: value })}>
                    <SelectTrigger className="bg-[#0b0e14] border-[#2a2f3e] text-[#00eaff]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1f2e] border-[#2a2f3e]">
                      <SelectItem value="magenta" className="text-[#ff00cc]">
                        Magenta
                      </SelectItem>
                      <SelectItem value="cyan" className="text-[#00eaff]">
                        Cyan
                      </SelectItem>
                      <SelectItem value="purple" className="text-[#9d4edd]">
                        Purple
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full btn-neon-magenta"
                  onClick={handleCreateLounge}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Create Lounge"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {loungesLoading ? (
          <div className="text-center py-12">
            <p className="text-[#7a7f8e]">Loading lounges...</p>
          </div>
        ) : myLounges.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-[#ff00cc] opacity-50" />
            <p className="text-[#7a7f8e] mb-6">No lounges yet. Create one to get started!</p>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="btn-neon-cyan gap-2">
                  <Plus className="w-4 h-4" />
                  Create Your First Lounge
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1a1f2e] border border-[#2a2f3e]">
                <DialogHeader>
                  <DialogTitle className="text-[#ff00cc]">Create a New Lounge</DialogTitle>
                  <DialogDescription className="text-[#7a7f8e]">
                    Create a private space for family, friends, or coworkers to connect.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-[#00eaff] text-sm font-medium">Lounge Name</label>
                    <Input
                      placeholder="e.g., The Family Hub"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-[#0b0e14] border-[#2a2f3e] text-[#00eaff] placeholder-[#7a7f8e]"
                    />
                  </div>

                  <div>
                    <label className="text-[#00eaff] text-sm font-medium">Lounge Type</label>
                    <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger className="bg-[#0b0e14] border-[#2a2f3e] text-[#00eaff]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1f2e] border-[#2a2f3e]">
                        <SelectItem value="family" className="text-[#00eaff]">
                          👨‍👩‍👧‍👦 Family
                        </SelectItem>
                        <SelectItem value="friends" className="text-[#00eaff]">
                          👫 Friends
                        </SelectItem>
                        <SelectItem value="coworkers" className="text-[#00eaff]">
                          💼 Coworkers
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-[#00eaff] text-sm font-medium">Description (Optional)</label>
                    <Textarea
                      placeholder="What's this lounge about?"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-[#0b0e14] border-[#2a2f3e] text-[#00eaff] placeholder-[#7a7f8e]"
                    />
                  </div>

                  <div>
                    <label className="text-[#00eaff] text-sm font-medium">Neon Theme</label>
                    <Select value={formData.neonTheme} onValueChange={(value: any) => setFormData({ ...formData, neonTheme: value })}>
                      <SelectTrigger className="bg-[#0b0e14] border-[#2a2f3e] text-[#00eaff]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1f2e] border-[#2a2f3e]">
                        <SelectItem value="magenta" className="text-[#ff00cc]">
                          Magenta
                        </SelectItem>
                        <SelectItem value="cyan" className="text-[#00eaff]">
                          Cyan
                        </SelectItem>
                        <SelectItem value="purple" className="text-[#9d4edd]">
                          Purple
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full btn-neon-magenta"
                    onClick={handleCreateLounge}
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? "Creating..." : "Create Lounge"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myLounges.map((lounge) => {
              if (!lounge) return null;
              return (
                <Card
                  key={lounge.id}
                  className="bg-[#1a1f2e] border border-[#2a2f3e] p-6 cursor-pointer hover:border-[#ff00cc] transition-colors"
                  onClick={() => navigate(`/lounges/${lounge.id}`)}
                  style={{
                    boxShadow:
                      lounge.neonTheme === "magenta"
                        ? "0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)"
                        : lounge.neonTheme === "cyan"
                          ? "0 0 10px rgba(0, 234, 255, 0.5), 0 0 20px rgba(0, 234, 255, 0.3)"
                          : "0 0 10px rgba(157, 78, 221, 0.5), 0 0 20px rgba(157, 78, 221, 0.3)",
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#00eaff] mb-1">{lounge.name}</h3>
                      <p className="text-sm text-[#7a7f8e] capitalize">{lounge.type} Lounge</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {(unreadByLounge.get(lounge.id) || 0) > 0 && (
                        <span
                          className="rounded-full border border-[#ff00cc] bg-[#ff00cc]/20 px-2 py-1 text-xs font-bold text-[#ff00cc]"
                          aria-label={`${unreadByLounge.get(lounge.id)} unread messages`}
                        >
                          {unreadByLounge.get(lounge.id)} new
                        </span>
                      )}
                      <Lock className="w-5 h-5 text-[#ff00cc]" />
                    </div>
                  </div>

                  {lounge.description && (
                    <p className="text-[#7a7f8e] text-sm mb-4 line-clamp-2">{lounge.description}</p>
                  )}

                  <div className="flex items-center gap-2 text-[#00eaff] text-sm">
                    <Users className="w-4 h-4" />
                    <span>{(unreadByLounge.get(lounge.id) || 0) > 0 ? "Open unread messages" : "View & Join"}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
