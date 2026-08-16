import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, Zap, Sparkles, Target, Gift } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";

export default function MissionHub() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState("25");

  const impactMetrics = [
    { label: "Lives Touched", value: "1,247", icon: Heart, color: "#ff00cc" },
    { label: "Projects Completed", value: "89", icon: Target, color: "#00eaff" },
    { label: "Community Members", value: "3,456", icon: Users, color: "#b000ff" },
    { label: "Total Donations", value: "$12,450", icon: Gift, color: "#ffd700" },
  ];

  const missionPillars = [
    {
      title: "Social Good First",
      description: "Every feature, every coin, every interaction drives positive change in the world.",
      icon: Heart,
    },
    {
      title: "Creator Empowerment",
      description: "Artists and visionaries get the tools and platform to amplify their impact.",
      icon: Sparkles,
    },
    {
      title: "Community Ownership",
      description: "Build together. Earn together. Grow together. No gatekeepers.",
      icon: Users,
    },
    {
      title: "Transparent Impact",
      description: "See exactly how your participation creates change. Real metrics. Real impact.",
      icon: Zap,
    },
  ];

  const handleDonate = () => {
    toast.success(`Thank you for donating $${donationAmount}! Your support fuels our mission.`);
    setShowDonationModal(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#00eaff]">
      {/* Navigation */}
      <nav className="border-b border-[#2a2f3e] px-6 py-4 sticky top-0 bg-[#0b0e14]/95 backdrop-blur z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold neon-text-magenta">Anom Mission Hub</h1>
          <div className="flex gap-4">
            {isAuthenticated && (
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="text-[#00eaff] border-[#00eaff]"
              >
                Back to Platform
              </Button>
            )}
            <Button
              onClick={() => setShowDonationModal(true)}
              className="bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black font-bold"
            >
              <Heart className="w-4 h-4 mr-2" />
              Support Our Mission
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Mission Statement */}
      <section className="px-6 py-20 bg-gradient-to-b from-[#1a1f2e] to-[#0b0e14]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            <span className="neon-text-magenta">Social Good</span>
            <span className="text-[#00eaff]"> Meets </span>
            <span className="neon-text-magenta">Creative Power</span>
          </h2>
          <p className="text-xl text-[#7a7f8e] mb-8 leading-relaxed">
            Anom Artsy is more than a platform. It's a movement where artists, creators, and visionaries
            unite to amplify positive change. Every coin earned, every collaboration started, every voice
            amplified—it all drives real-world impact.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => setShowDonationModal(true)}
              className="bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black font-bold text-lg py-6 px-8"
            >
              Donate to Build the Mission
            </Button>
            <Button
              onClick={() => navigate("/collaboration")}
              className="btn-neon-cyan text-lg py-6 px-8"
            >
              Join as Creator
            </Button>
            <Button
              onClick={() => navigate("/music-library")}
              className="bg-[#b000ff] hover:bg-[#b000ff]/80 text-white font-bold text-lg py-6 px-8"
            >
              Browse Music Library
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="px-6 py-16 border-t border-[#2a2f3e]">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 neon-text-magenta">
            Our Impact in Numbers
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {impactMetrics.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <Card
                  key={idx}
                  className="bg-[#1a1f2e] border border-[#2a2f3e] p-6 text-center hover:border-[#ff00cc] transition-colors"
                >
                  <Icon
                    className="w-8 h-8 mx-auto mb-4"
                    style={{ color: metric.color }}
                  />
                  <p className="text-4xl font-bold mb-2" style={{ color: metric.color }}>
                    {metric.value}
                  </p>
                  <p className="text-[#7a7f8e]">{metric.label}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Pillars */}
      <section className="px-6 py-16 bg-[#1a1f2e] border-t border-[#2a2f3e]">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 neon-text-magenta">
            Our Four Pillars
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {missionPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <Card
                  key={idx}
                  className="bg-[#0b0e14] border border-[#2a2f3e] p-8 hover:border-[#00eaff] transition-colors"
                >
                  <Icon className="w-8 h-8 text-[#00eaff] mb-4" />
                  <h4 className="text-xl font-bold text-[#ff00cc] mb-3">{pillar.title}</h4>
                  <p className="text-[#7a7f8e]">{pillar.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Collaboration Station Spotlight */}
      <section className="px-6 py-16 border-t border-[#2a2f3e]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold mb-6">
                <span className="neon-text-magenta">Collaboration Station</span>
                <span className="text-[#00eaff]"> for Visionaries</span>
              </h3>
              <p className="text-lg text-[#7a7f8e] mb-6">
                Connect with fellow artists, creators, and social entrepreneurs. Launch collaborative
                projects. Pool resources. Amplify impact. The Collaboration Station is where individual
                vision becomes collective power.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-3">
                  <span className="text-[#ff00cc]">✓</span>
                  <span className="text-[#7a7f8e]">Find and connect with creators aligned to your mission</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#00eaff]">✓</span>
                  <span className="text-[#7a7f8e]">Launch collaborative projects with built-in task management</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#b000ff]">✓</span>
                  <span className="text-[#7a7f8e]">Share resources, knowledge, and Anom Coins</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#ffd700]">✓</span>
                  <span className="text-[#7a7f8e]">Track collective impact and celebrate milestones together</span>
                </li>
              </ul>
              <Button
                onClick={() => navigate("/collaboration")}
                className="btn-neon-magenta text-lg py-6 px-8"
              >
                Explore Collaboration Station
              </Button>
            </div>
            <Card className="bg-[#1a1f2e] border border-[#ff00cc] p-8">
              <div className="space-y-6">
                <div className="bg-[#0b0e14] rounded-lg p-4 border border-[#2a2f3e]">
                  <p className="text-[#00eaff] font-bold mb-2">Featured Project</p>
                  <h4 className="text-xl font-bold text-[#ff00cc] mb-2">
                    Ocean Cleanup Initiative
                  </h4>
                  <p className="text-[#7a7f8e] text-sm mb-4">
                    Join 47 creators working to clean our oceans. 3 months in, 2,400 lbs of plastic removed.
                  </p>
                  <Button className="w-full btn-neon-cyan" size="sm">
                    Join Project
                  </Button>
                </div>
                <div className="bg-[#0b0e14] rounded-lg p-4 border border-[#2a2f3e]">
                  <p className="text-[#ff00cc] font-bold mb-2">Active Creators</p>
                  <p className="text-3xl font-bold text-[#00eaff]">1,247</p>
                  <p className="text-[#7a7f8e] text-sm">Collaborating on social good</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How Donations Work */}
      <section className="px-6 py-16 bg-[#1a1f2e] border-t border-[#2a2f3e]">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 neon-text-magenta">
            How Your Donation Powers the Mission
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-[#0b0e14] border border-[#2a2f3e] p-6">
              <div className="text-3xl font-bold text-[#ff00cc] mb-3">40%</div>
              <p className="font-bold text-[#00eaff] mb-2">Platform Development</p>
              <p className="text-[#7a7f8e] text-sm">
                Building new features, improving infrastructure, and scaling the platform.
              </p>
            </Card>
            <Card className="bg-[#0b0e14] border border-[#2a2f3e] p-6">
              <div className="text-3xl font-bold text-[#00eaff] mb-3">40%</div>
              <p className="font-bold text-[#ff00cc] mb-2">Creator Support</p>
              <p className="text-[#7a7f8e] text-sm">
                Grants, tools, and resources for artists and visionaries launching projects.
              </p>
            </Card>
            <Card className="bg-[#0b0e14] border border-[#2a2f3e] p-6">
              <div className="text-3xl font-bold text-[#b000ff] mb-3">20%</div>
              <p className="font-bold text-[#ffd700] mb-2">Social Good Initiatives</p>
              <p className="text-[#7a7f8e] text-sm">
                Direct funding for community projects and impact-driven collaborations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Donation Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="bg-[#1a1f2e] border border-[#ff00cc] w-full max-w-md">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-[#ff00cc] mb-6">Support Our Mission</h3>
              <p className="text-[#7a7f8e] mb-6">
                Your donation fuels platform development, creator support, and real-world social good impact.
              </p>

              <div className="space-y-4 mb-6">
                {["10", "25", "50", "100"].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setDonationAmount(amount)}
                    className={`w-full p-3 rounded-lg border-2 transition-all font-bold ${
                      donationAmount === amount
                        ? "border-[#ff00cc] bg-[#ff00cc]/20 text-[#ff00cc]"
                        : "border-[#2a2f3e] bg-[#0b0e14] text-[#7a7f8e] hover:border-[#00eaff]"
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <div className="bg-[#0b0e14] rounded-lg p-4 mb-6 border border-[#2a2f3e]">
                <p className="text-[#7a7f8e] text-sm mb-2">Donation Amount</p>
                <p className="text-3xl font-bold text-[#00eaff]">${donationAmount}</p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleDonate}
                  className="flex-1 bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black font-bold"
                >
                  Donate Now
                </Button>
                <Button
                  onClick={() => setShowDonationModal(false)}
                  variant="outline"
                  className="flex-1 text-[#7a7f8e] border-[#2a2f3e]"
                >
                  Cancel
                </Button>
              </div>

              <p className="text-[#7a7f8e] text-xs text-center mt-4">
                Donations are secure and tax-deductible. You'll receive a receipt.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
