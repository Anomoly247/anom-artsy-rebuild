import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  Shield,
  Lock,
  AlertCircle,
  Download,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Activity,
} from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function BusinessControlCenter() {
  const { isAuthenticated, loading, user } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [showSecrets, setShowSecrets] = useState(false);

  // Business metrics
  const metrics = {
    monthlyRevenue: "$176,770",
    activeMembers: 2847,
    vipSubscribers: 247,
    pendingOrders: 12,
    systemHealth: "99.8%",
  };

  // Payment credentials (masked for security)
  const paymentCredentials = [
    {
      id: 1,
      name: "Stripe",
      type: "API Key",
      status: "active",
      lastUpdated: "2026-05-10",
      masked: "sk_live_••••••••••••••••••••••••",
    },
    {
      id: 2,
      name: "PayPal Business",
      type: "OAuth",
      status: "active",
      lastUpdated: "2026-05-08",
      masked: "business@••••••••.com",
    },
    {
      id: 3,
      name: "Cash App",
      type: "Business Tag",
      status: "pending",
      lastUpdated: "Never",
      masked: "$••••••••••••",
    },
  ];

  // Activity log
  const activityLog = [
    {
      id: 1,
      action: "VIP Subscription Created",
      user: "Alex",
      timestamp: "2026-05-15 14:32",
      status: "success",
      details: "VIP tier subscription for $10/month",
    },
    {
      id: 2,
      action: "Merch Order Approved",
      user: "Jordan",
      timestamp: "2026-05-15 13:15",
      status: "success",
      details: "Neon Dragon Hoodie design approved",
    },
    {
      id: 3,
      action: "Payment Received",
      user: "System",
      timestamp: "2026-05-15 12:45",
      status: "success",
      details: "Stripe payment processed: $1,250.00",
    },
    {
      id: 4,
      action: "Failed Payment",
      user: "Sam",
      timestamp: "2026-05-15 10:20",
      status: "warning",
      details: "Card declined - customer notified",
    },
    {
      id: 5,
      action: "Settings Updated",
      user: "Admin",
      timestamp: "2026-05-14 16:00",
      status: "success",
      details: "Platform settings modified",
    },
  ];

  // Admin sessions
  const adminSessions = [
    {
      id: 1,
      device: "MacBook Pro",
      browser: "Chrome",
      location: "New York, USA",
      lastActive: "Just now",
      status: "active",
    },
    {
      id: 2,
      device: "iPhone",
      browser: "Safari",
      location: "New York, USA",
      lastActive: "2 hours ago",
      status: "active",
    },
    {
      id: 3,
      device: "Desktop",
      browser: "Firefox",
      location: "Unknown",
      lastActive: "3 days ago",
      status: "inactive",
    },
  ];

  const handleAddPaymentMethod = () => {
    toast.success("Opening payment method setup...");
  };

  const handleRotateCredential = (id: number) => {
    toast.success("Credential rotated successfully!");
  };

  const handleExportData = (format: string) => {
    toast.success(`Exporting data as ${format}...`);
  };

  const handleLogoutSession = (id: number) => {
    toast.success("Session terminated");
  };

  const handleEnableTwoFactor = () => {
    toast.success("Two-factor authentication enabled!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-[#00eaff] text-xl">Loading Business Control Center...</div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
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
            <Button variant="ghost" onClick={() => navigate("/admin")} className="text-[#7a7f8e]">
              ← Back
            </Button>
            <h1 className="text-2xl font-bold neon-text-magenta">Business Control Center</h1>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-[#7a7f8e]">Secure Mode</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-5 gap-4 mb-12">
          <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-4" style={{boxShadow: '0 0 10px rgba(255, 0, 204, 0.5)'}}>
            <p className="text-[#7a7f8e] text-xs">Monthly Revenue</p>
            <p className="text-2xl font-bold text-[#ff00cc]">{metrics.monthlyRevenue}</p>
          </Card>

          <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-4" style={{boxShadow: '0 0 10px rgba(0, 234, 255, 0.5)'}}>
            <p className="text-[#7a7f8e] text-xs">Active Members</p>
            <p className="text-2xl font-bold text-[#00eaff]">{metrics.activeMembers}</p>
          </Card>

          <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-4" style={{boxShadow: '0 0 10px rgba(157, 78, 221, 0.5)'}}>
            <p className="text-[#7a7f8e] text-xs">VIP Subscribers</p>
            <p className="text-2xl font-bold text-[#9d4edd]">{metrics.vipSubscribers}</p>
          </Card>

          <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-4" style={{boxShadow: '0 0 10px rgba(0, 234, 255, 0.3)'}}>
            <p className="text-[#7a7f8e] text-xs">Pending Orders</p>
            <p className="text-2xl font-bold text-[#00eaff]">{metrics.pendingOrders}</p>
          </Card>

          <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-4" style={{boxShadow: '0 0 10px rgba(0, 255, 136, 0.5)'}}>
            <p className="text-[#7a7f8e] text-xs">System Health</p>
            <p className="text-2xl font-bold text-green-400">{metrics.systemHealth}</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-[#1a1f2e] border border-[#2a2f3e] mb-8">
            <TabsTrigger value="overview" className="text-[#00eaff]">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="security" className="text-[#00eaff]">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="payments" className="text-[#00eaff]">
              <CreditCard className="w-4 h-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-[#00eaff]">
              <Activity className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="exports" className="text-[#00eaff]">
              <Download className="w-4 h-4 mr-2" />
              Exports
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <h3 className="text-xl font-bold text-[#ff00cc]">Business Dashboard</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
                <h4 className="text-lg font-bold text-[#00eaff] mb-4">Quick Actions</h4>
                <div className="space-y-2">
                  <Button className="w-full btn-neon-magenta justify-start" onClick={() => navigate("/payment-merch")}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Manage Payments
                  </Button>
                  <Button className="w-full btn-neon-cyan justify-start" onClick={() => navigate("/youtube-manager")}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    YouTube Manager
                  </Button>
                  <Button className="w-full btn-neon-purple justify-start" onClick={() => navigate("/admin")}>
                    <Users className="w-4 h-4 mr-2" />
                    Admin Dashboard
                  </Button>
                </div>
              </Card>

              <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
                <h4 className="text-lg font-bold text-[#00eaff] mb-4">System Status</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#7a7f8e]">API Status</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#7a7f8e]">Database</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#7a7f8e]">Payment Gateway</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#7a7f8e]">Email Service</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <h3 className="text-xl font-bold text-[#ff00cc]">Security Settings</h3>

            {/* Two-Factor Authentication */}
            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-[#00eaff]">Two-Factor Authentication</h4>
                  <p className="text-sm text-[#7a7f8e] mt-1">Add an extra layer of security to your account</p>
                </div>
                <Lock className="w-6 h-6 text-[#ff00cc]" />
              </div>
              <Button className="btn-neon-cyan" onClick={handleEnableTwoFactor}>
                Enable 2FA
              </Button>
            </Card>

            {/* Active Sessions */}
            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
              <h4 className="text-lg font-bold text-[#00eaff] mb-4">Active Sessions</h4>
              <div className="space-y-3">
                {adminSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-[#0b0e14] rounded border border-[#2a2f3e]">
                    <div>
                      <p className="text-[#00eaff] font-bold text-sm">{session.device}</p>
                      <p className="text-xs text-[#7a7f8e]">{session.browser} • {session.location}</p>
                      <p className="text-xs text-[#7a7f8e]">Last active: {session.lastActive}</p>
                    </div>
                    {session.status === "active" && (
                      <Button size="sm" variant="outline" className="text-[#ff00cc] border-[#2a2f3e]" onClick={() => handleLogoutSession(session.id)}>
                        <LogOut className="w-3 h-3 mr-1" />
                        Logout
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#ff00cc]">Payment Credentials</h3>
              <Button className="btn-neon-magenta" onClick={handleAddPaymentMethod}>
                <Plus className="w-4 h-4 mr-2" />
                Add Method
              </Button>
            </div>

            <div className="space-y-4">
              {paymentCredentials.map((cred) => (
                <Card key={cred.id} className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-[#00eaff]">{cred.name}</h4>
                      <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                        <div>
                          <p className="text-[#7a7f8e]">Type</p>
                          <p className="text-[#00eaff]">{cred.type}</p>
                        </div>
                        <div>
                          <p className="text-[#7a7f8e]">Status</p>
                          <p className={cred.status === "active" ? "text-green-400" : "text-yellow-400"}>{cred.status}</p>
                        </div>
                        <div>
                          <p className="text-[#7a7f8e]">Last Updated</p>
                          <p className="text-[#00eaff]">{cred.lastUpdated}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <code className="text-xs bg-[#0b0e14] p-2 rounded text-[#7a7f8e]">{showSecrets ? cred.masked : "••••••••••••••••"}</code>
                        <button onClick={() => setShowSecrets(!showSecrets)} className="text-[#7a7f8e] hover:text-[#00eaff]">
                          {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-[#00eaff] border-[#2a2f3e]" onClick={() => handleRotateCredential(cred.id)}>
                        <Lock className="w-3 h-3 mr-1" />
                        Rotate
                      </Button>
                      <Button size="sm" variant="outline" className="text-[#ff00cc] border-[#2a2f3e]">
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <h3 className="text-xl font-bold text-[#ff00cc]">Activity Log</h3>
            <div className="space-y-3">
              {activityLog.map((log) => (
                <Card key={log.id} className="bg-[#1a1f2e] border border-[#2a2f3e] p-4">
                  <div className="flex items-center gap-4">
                    {log.status === "success" && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
                    {log.status === "warning" && <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />}
                    <div className="flex-1">
                      <p className="text-[#00eaff] font-bold">{log.action}</p>
                      <p className="text-xs text-[#7a7f8e]">{log.details}</p>
                      <p className="text-xs text-[#7a7f8e] mt-1">by {log.user} • {log.timestamp}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Exports Tab */}
          <TabsContent value="exports" className="space-y-6">
            <h3 className="text-xl font-bold text-[#ff00cc]">Data Exports</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
                <h4 className="text-lg font-bold text-[#00eaff] mb-4">Financial Reports</h4>
                <div className="space-y-2">
                  <Button className="w-full btn-neon-magenta justify-start" onClick={() => handleExportData("CSV")}>
                    <Download className="w-4 h-4 mr-2" />
                    Export as CSV
                  </Button>
                  <Button className="w-full btn-neon-cyan justify-start" onClick={() => handleExportData("PDF")}>
                    <Download className="w-4 h-4 mr-2" />
                    Export as PDF
                  </Button>
                  <Button className="w-full btn-neon-purple justify-start" onClick={() => handleExportData("Excel")}>
                    <Download className="w-4 h-4 mr-2" />
                    Export as Excel
                  </Button>
                </div>
              </Card>

              <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
                <h4 className="text-lg font-bold text-[#00eaff] mb-4">User Data</h4>
                <div className="space-y-2">
                  <Button className="w-full btn-neon-magenta justify-start" onClick={() => handleExportData("CSV")}>
                    <Download className="w-4 h-4 mr-2" />
                    User List (CSV)
                  </Button>
                  <Button className="w-full btn-neon-cyan justify-start" onClick={() => handleExportData("PDF")}>
                    <Download className="w-4 h-4 mr-2" />
                    Analytics Report
                  </Button>
                  <Button className="w-full btn-neon-purple justify-start" onClick={() => handleExportData("Excel")}>
                    <Download className="w-4 h-4 mr-2" />
                    VIP Members
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
