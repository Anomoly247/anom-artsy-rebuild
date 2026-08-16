import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, Zap, Globe, Target, Sparkles, TrendingUp, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";

export default function MissionRally() {
  const { isAuthenticated, user } = useAuth();
  const [isPledged, setIsPledged] = useState(false);

  const handlePledge = () => {
    setIsPledged(true);
    toast.success("You've joined the mission! Welcome to the movement.");
  };

  const handleShare = () => {
    const url = `${window.location.origin}/mission`;
    navigator.clipboard.writeText(url);
    toast.success("Mission link copied! Share it with your network.");
  };

  // Mock impact metrics
  const impactMetrics = [
    { label: "Lives Touched", value: "2,847", icon: Heart, color: "#ff00cc" },
    { label: "Active Members", value: "1,240", icon: Users, color: "#00eaff" },
    { label: "Projects Completed", value: "156", icon: Target, color: "#9d4edd" },
    { label: "Global Reach", value: "42 Countries", icon: Globe, color: "#00ff88" },
  ];

  // Mock community stories
  const stories = [
    {
      id: 1,
      name: "Alex Chen",
      title: "Built a coding school for underprivileged kids",
      impact: "150 students trained",
      avatar: "👨‍💻",
    },
    {
      id: 2,
      name: "Maria Santos",
      title: "Organized community garden project",
      impact: "500 lbs of fresh produce",
      avatar: "🌱",
    },
    {
      id: 3,
      name: "James Wilson",
      title: "Created mental health support network",
      impact: "300+ people supported",
      avatar: "💜",
    },
    {
      id: 4,
      name: "Priya Patel",
      title: "Started women's tech mentorship",
      impact: "75 women in tech careers",
      avatar: "👩‍💼",
    },
  ];

  // Mock leaderboard
  const leaderboard = [
    { rank: 1, name: "Alex Chen", impact: 2500, badge: "🥇" },
    { rank: 2, name: "Maria Santos", impact: 2200, badge: "🥈" },
    { rank: 3, name: "James Wilson", impact: 1950, badge: "🥉" },
    { rank: 4, name: "Priya Patel", impact: 1800, badge: "⭐" },
    { rank: 5, name: "You", impact: 450, badge: "🚀" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#00eaff]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff00cc]/10 to-[#00eaff]/10 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 neon-text-magenta">
              The Anom Mission Rally
            </h1>
            <p className="text-xl text-[#7a7f8e] mb-4 max-w-3xl mx-auto">
              Unite your physical and digital identity. Make real-world impact. Build the future together.
            </p>
            <p className="text-lg text-[#00eaff] font-bold">
              Every action counts. Every voice matters. Every person can change the world.
            </p>
          </div>

          {/* Mission Statement */}
          <Card
            className="bg-[#1a1f2e] border-2 border-[#ff00cc] p-12 mb-12 text-center"
            style={{
              boxShadow: "0 0 30px rgba(255, 0, 204, 0.5), 0 0 60px rgba(255, 0, 204, 0.3)",
            }}
          >
            <h2 className="text-3xl font-bold text-[#ff00cc] mb-6">Our Mission</h2>
            <p className="text-lg text-[#00eaff] mb-6 leading-relaxed">
              Anom Artsy is more than a platform—it's a movement. We believe that your digital identity and physical impact are one and the same. By connecting your authentic self with meaningful action, we're building a world where social good isn't just a goal—it's a way of life.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                className="btn-neon-magenta"
                onClick={handlePledge}
                disabled={isPledged}
              >
                {isPledged ? "✓ Mission Pledged" : "Take the Pledge"}
              </Button>
              <Button
                className="btn-neon-cyan"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share the Mission
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-16 px-6 bg-[#0b0e14]/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 neon-text-cyan">
            Real Impact. Real Numbers.
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {impactMetrics.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <Card
                  key={idx}
                  className="bg-[#1a1f2e] border border-[#2a2f3e] p-6 text-center hover:scale-105 transition-transform"
                  style={{
                    boxShadow: `0 0 20px ${metric.color}40, 0 0 40px ${metric.color}20`,
                  }}
                >
                  <Icon className="w-8 h-8 mx-auto mb-4" style={{ color: metric.color }} />
                  <p className="text-3xl font-bold mb-2" style={{ color: metric.color }}>
                    {metric.value}
                  </p>
                  <p className="text-[#7a7f8e]">{metric.label}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 neon-text-magenta">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🤝",
                title: "Community First",
                desc: "We lift each other up. Your success is our success.",
              },
              {
                icon: "🌍",
                title: "Global Impact",
                desc: "Think globally, act locally. Make change wherever you are.",
              },
              {
                icon: "✨",
                title: "Authentic Identity",
                desc: "Be yourself. Your real self has real power to change the world.",
              },
              {
                icon: "🎯",
                title: "Measurable Change",
                desc: "We track impact. We celebrate progress. We celebrate you.",
              },
              {
                icon: "🚀",
                title: "Innovation for Good",
                desc: "Technology serves humanity. Always.",
              },
              {
                icon: "💜",
                title: "Radical Empathy",
                desc: "We see you. We hear you. We stand with you.",
              },
            ].map((value, idx) => (
              <Card
                key={idx}
                className="bg-[#1a1f2e] border border-[#2a2f3e] p-6 hover:border-[#00eaff] transition-colors"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-[#ff00cc] mb-2">{value.title}</h3>
                <p className="text-[#7a7f8e]">{value.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Stories */}
      <section className="py-16 px-6 bg-[#0b0e14]/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 neon-text-cyan">
            Community Stories
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {stories.map((story) => (
              <Card
                key={story.id}
                className="bg-[#1a1f2e] border border-[#2a2f3e] p-6 hover:border-[#ff00cc] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{story.avatar}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#ff00cc]">{story.name}</h3>
                    <p className="text-[#00eaff] font-bold text-sm mb-2">{story.title}</p>
                    <p className="text-[#7a7f8e] text-sm">
                      <Sparkles className="w-4 h-4 inline mr-2" />
                      Impact: {story.impact}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Good Leaderboard */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 neon-text-magenta">
            Impact Leaderboard
          </h2>
          <Card className="bg-[#1a1f2e] border border-[#2a2f3e] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2f3e] bg-[#0b0e14]">
                    <th className="px-6 py-4 text-left text-[#7a7f8e]">Rank</th>
                    <th className="px-6 py-4 text-left text-[#7a7f8e]">Member</th>
                    <th className="px-6 py-4 text-left text-[#7a7f8e]">Impact Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr
                      key={entry.rank}
                      className="border-b border-[#2a2f3e] hover:bg-[#0b0e14] transition-colors"
                    >
                      <td className="px-6 py-4 text-[#ff00cc] font-bold">
                        {entry.badge} #{entry.rank}
                      </td>
                      <td className="px-6 py-4 text-[#00eaff] font-bold">{entry.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-[#0b0e14] rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-[#ff00cc] to-[#00eaff] h-2 rounded-full"
                              style={{ width: `${(entry.impact / 2500) * 100}%` }}
                            />
                          </div>
                          <span className="text-[#7a7f8e] text-sm">{entry.impact}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#ff00cc]/10 to-[#00eaff]/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 neon-text-magenta">
            Ready to Join the Movement?
          </h2>
          <p className="text-lg text-[#7a7f8e] mb-8">
            Your digital identity + your real-world impact = infinite possibilities. Start collaborating on social good projects today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button className="btn-neon-magenta text-lg px-8 py-6">
              Start Collaborating
            </Button>
            <Button className="btn-neon-cyan text-lg px-8 py-6">
              Explore Projects
            </Button>
            <Button className="btn-neon-purple text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
