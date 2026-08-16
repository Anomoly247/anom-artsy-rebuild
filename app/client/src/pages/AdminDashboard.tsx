import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Users, ShoppingBag, TrendingUp, Settings, AlertCircle, Play, CreditCard, Shield, BarChart3, Activity, Flag, Eye, EyeOff, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function AdminDashboard() {
  const { isAuthenticated, loading, user } = useAuth();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch admin data
  const { data: merchRequests = [], isLoading: requestsLoading } = trpc.admin.getMerchRequests.useQuery(
    { status: undefined },
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const { data: analytics = { 
    totalUsers: 0, 
    totalLounges: 0, 
    totalMerchRequests: 0, 
    pendingMerchRequests: 0,
    totalDonations: 0 as any,
    totalCoinSpent: 0 as any,
    activeMembers: 0 as any,
    newMembersThisWeek: 0 as any
  }} = trpc.admin.getAnalytics.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  // Approve/reject mutations
  const approveMutation = trpc.admin.approveMerchRequest.useMutation({
    onSuccess: () => {
      toast.success("Request approved!");
    },
    onError: (error) => {
      toast.error(`Failed to approve: ${error.message}`);
    },
  });

  const rejectMutation = trpc.admin.rejectMerchRequest.useMutation({
    onSuccess: () => {
      toast.success("Request rejected.");
    },
    onError: (error) => {
      toast.error(`Failed to reject: ${error.message}`);
    },
  });

  const handleApproveMerch = (id: string) => {
    approveMutation.mutate({ requestId: parseInt(id) });
  };

  const handleRejectMerch = (id: string) => {
    rejectMutation.mutate({ requestId: parseInt(id) });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-[#00eaff] text-xl">Loading Admin Dashboard...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#00eaff] text-xl mb-4">Please sign in</p>
          <Button className="btn-neon-magenta" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-[#ff00cc]" />
          <p className="text-[#00eaff] text-xl mb-4">Admin access required</p>
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
      <nav className="border-b border-[#2a2f3e] px-6 py-4 sticky top-0 bg-[#0b0e14]/95 backdrop-blur z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="text-[#7a7f8e]">
              ← Back
            </Button>
            <h1 className="text-2xl font-bold neon-text-magenta">Admin Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="text-[#ff00cc] border-[#2a2f3e] gap-2" onClick={() => navigate("/owner-settings")}>
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6" style={{ boxShadow: "0 0 10px rgba(255, 0, 204, 0.5)" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#7a7f8e] text-sm">Total Users</p>
                <p className="text-3xl font-bold text-[#ff00cc]">{analytics?.totalUsers || 0}</p>
              </div>
              <Users className="w-8 h-8 text-[#ff00cc] opacity-50" />
            </div>
          </Card>

          <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6" style={{ boxShadow: "0 0 10px rgba(0, 234, 255, 0.5)" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#7a7f8e] text-sm">Active Members</p>
                <p className="text-3xl font-bold text-[#00eaff]">{(analytics as any)?.activeMembers || 0}</p>
              </div>
              <Activity className="w-8 h-8 text-[#00eaff] opacity-50" />
            </div>
          </Card>

          <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6" style={{ boxShadow: "0 0 10px rgba(157, 78, 221, 0.5)" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#7a7f8e] text-sm">Total Donations</p>
                <p className="text-3xl font-bold text-[#9d4edd]">${(analytics as any)?.totalDonations || 0}</p>
              </div>
              <CreditCard className="w-8 h-8 text-[#9d4edd] opacity-50" />
            </div>
          </Card>

          <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6" style={{ boxShadow: "0 0 10px rgba(255, 215, 0, 0.5)" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#7a7f8e] text-sm">Coin Economy</p>
                <p className="text-3xl font-bold text-[#ffd700]">{(analytics as any)?.totalCoinSpent || 0}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-[#ffd700] opacity-50" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="bg-[#1a1f2e] border border-[#2a2f3e] mb-8 grid w-full grid-cols-5">
            <TabsTrigger value="content" className="text-[#00eaff]">
              <Eye className="w-4 h-4 mr-2" />
              Content Control
            </TabsTrigger>
            <TabsTrigger value="users" className="text-[#00eaff]">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="merch" className="text-[#00eaff]">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Merch
            </TabsTrigger>
            <TabsTrigger value="reports" className="text-[#00eaff]">
              <Flag className="w-4 h-4 mr-2" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-[#00eaff]">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Content Control Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex gap-4 mb-6">
              <Input 
                placeholder="Search content..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#1a1f2e] border-[#2a2f3e] text-[#00eaff]"
              />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[#1a1f2e] border border-[#2a2f3e] text-[#00eaff] px-4 rounded"
              >
                <option value="all">All Content</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>

            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
              <h3 className="text-xl font-bold text-[#ff00cc] mb-4">Content Moderation</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#0b0e14] rounded border border-[#2a2f3e]">
                  <div>
                    <p className="text-[#00eaff] font-semibold">Social Feed Posts</p>
                    <p className="text-[#7a7f8e] text-sm">Monitor and moderate community posts</p>
                  </div>
                  <Button variant="outline" className="text-[#ff00cc] border-[#2a2f3e]">Review</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#0b0e14] rounded border border-[#2a2f3e]">
                  <div>
                    <p className="text-[#00eaff] font-semibold">Lounge Messages</p>
                    <p className="text-[#7a7f8e] text-sm">Monitor lounge chat and conversations</p>
                  </div>
                  <Button variant="outline" className="text-[#ff00cc] border-[#2a2f3e]">Review</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#0b0e14] rounded border border-[#2a2f3e]">
                  <div>
                    <p className="text-[#00eaff] font-semibold">User Profiles</p>
                    <p className="text-[#7a7f8e] text-sm">Review profile content and images</p>
                  </div>
                  <Button variant="outline" className="text-[#ff00cc] border-[#2a2f3e]">Review</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex gap-4 mb-6">
              <Input 
                placeholder="Search users..." 
                className="bg-[#1a1f2e] border-[#2a2f3e] text-[#00eaff]"
              />
              <select className="bg-[#1a1f2e] border border-[#2a2f3e] text-[#00eaff] px-4 rounded">
                <option>All Users</option>
                <option>Basic</option>
                <option>VIP</option>
                <option>Super VIP</option>
              </select>
            </div>

            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
              <h3 className="text-xl font-bold text-[#ff00cc] mb-4">User Management</h3>
              <div className="space-y-2">
                <p className="text-[#7a7f8e]">Total Users: {analytics?.totalUsers || 0}</p>
                <p className="text-[#7a7f8e]">Active This Week: {(analytics as any)?.newMembersThisWeek || 0}</p>
                <p className="text-[#7a7f8e]">Currently Active: {(analytics as any)?.activeMembers || 0}</p>
              </div>
            </Card>
          </TabsContent>

          {/* Merch Tab */}
          <TabsContent value="merch" className="space-y-6">
            <h3 className="text-xl font-bold text-[#ff00cc]">Pending Merch Requests</h3>
            {requestsLoading ? (
              <p className="text-[#7a7f8e]">Loading requests...</p>
            ) : (merchRequests || []).length === 0 ? (
              <p className="text-[#7a7f8e]">No merch requests to review.</p>
            ) : null}
            <div className="space-y-4">
              {(merchRequests || []).map((request: any) => (
                <Card key={request.id} className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#00eaff] font-semibold">{request.title}</p>
                      <p className="text-[#7a7f8e] text-sm">{request.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-[#00eaff] text-[#0b0e14] hover:bg-[#00eaff]/80"
                        onClick={() => handleApproveMerch(request.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-[#ff00cc] text-[#0b0e14] hover:bg-[#ff00cc]/80"
                        onClick={() => handleRejectMerch(request.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
              <h3 className="text-xl font-bold text-[#ff00cc] mb-4">Content Reports</h3>
              <p className="text-[#7a7f8e]">No reports at this time.</p>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
                <h3 className="text-xl font-bold text-[#ff00cc] mb-4">Platform Growth</h3>
                <div className="space-y-2">
                  <p className="text-[#00eaff]">Total Users: {analytics?.totalUsers || 0}</p>
                  <p className="text-[#00eaff]">New This Week: {(analytics as any)?.newMembersThisWeek || 0}</p>
                  <p className="text-[#00eaff]">Active Lounges: {analytics?.totalLounges || 0}</p>
                </div>
              </Card>

              <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
                <h3 className="text-xl font-bold text-[#ff00cc] mb-4">Revenue Metrics</h3>
                <div className="space-y-2">
                  <p className="text-[#00eaff]">Total Donations: ${(analytics as any)?.totalDonations || 0}</p>
                  <p className="text-[#00eaff]">Coins in Circulation: {(analytics as any)?.totalCoinSpent || 0}</p>
                  <p className="text-[#00eaff]">Pending Merch: {analytics?.pendingMerchRequests || 0}</p>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
