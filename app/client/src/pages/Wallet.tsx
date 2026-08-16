import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Coins, TrendingUp, TrendingDown, Zap } from "lucide-react";

export default function Wallet() {
  const { user, isAuthenticated } = useAuth();
  const { data: balanceData, isLoading: balanceLoading } = trpc.coin.getBalance.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: historyData, isLoading: historyLoading } = trpc.coin.history.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0e14] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#7a7f8e] mb-4">Sign in to view your Anom Coin wallet</p>
        </div>
      </div>
    );
  }

  const balance = balanceData?.balance || "0";
  const transactions = historyData || [];

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#ff00cc] mb-2">Anom Coin Wallet</h1>
          <p className="text-[#7a7f8e]">Manage your digital currency and track your earnings</p>
        </div>

        {/* Balance Card */}
        <div
          className="rounded-lg border-2 border-[#ff00cc] p-8 mb-8"
          style={{
            boxShadow: "0 0 20px rgba(255, 0, 204, 0.3)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#7a7f8e] text-sm mb-2">Current Balance</p>
              <p className="text-5xl font-bold text-[#ff00cc]">{balance}</p>
              <p className="text-[#00eaff] text-sm mt-2">Anom Coins</p>
            </div>
            <Coins className="w-24 h-24 text-[#ff00cc] opacity-50" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button className="bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-white font-bold py-6">
            <Zap className="w-4 h-4 mr-2" />
            Earn Coins
          </Button>
          <Button className="bg-[#00eaff] hover:bg-[#00eaff]/80 text-[#0b0e14] font-bold py-6">
            <TrendingUp className="w-4 h-4 mr-2" />
            Spend Coins
          </Button>
          <Button className="border-2 border-[#8b00ff] hover:bg-[#8b00ff]/10 text-[#8b00ff] font-bold py-6">
            <TrendingDown className="w-4 h-4 mr-2" />
            History
          </Button>
        </div>

        {/* Transaction History */}
        <div>
          <h2 className="text-2xl font-bold text-[#00eaff] mb-4">Transaction History</h2>
          {historyLoading ? (
            <div className="text-center py-8">
              <p className="text-[#7a7f8e]">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div
              className="rounded-lg border-2 border-[#7a7f8e] p-8 text-center"
              style={{
                boxShadow: "0 0 10px rgba(122, 127, 142, 0.2)",
              }}
            >
              <p className="text-[#7a7f8e]">No transactions yet. Start earning Anom Coins!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="rounded-lg border-2 border-[#7a7f8e] p-4 flex items-center justify-between hover:border-[#ff00cc] transition-colors"
                  style={{
                    boxShadow: "0 0 10px rgba(122, 127, 142, 0.1)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    {transaction.type === "earn" ? (
                      <TrendingUp className="w-6 h-6 text-[#00eaff]" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-[#ff00cc]" />
                    )}
                    <div>
                      <p className="font-bold text-white capitalize">{transaction.reason}</p>
                      <p className="text-[#7a7f8e] text-sm">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${transaction.type === "earn" ? "text-[#00eaff]" : "text-[#ff00cc]"}`}>
                    {transaction.type === "earn" ? "+" : "-"}
                    {transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Earning Guide */}
        <div className="mt-12 rounded-lg border-2 border-[#8b00ff] p-6" style={{ boxShadow: "0 0 15px rgba(139, 0, 255, 0.2)" }}>
          <h3 className="text-xl font-bold text-[#8b00ff] mb-4">How to Earn Anom Coins</h3>
          <ul className="space-y-3 text-[#7a7f8e]">
            <li className="flex items-start gap-3">
              <span className="text-[#00eaff] font-bold">•</span>
              <span>Complete Kids Corner lessons and activities</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#00eaff] font-bold">•</span>
              <span>Help others in family and friend lounges</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#00eaff] font-bold">•</span>
              <span>Win mini-games (Trivia, Memory, Mood Matcher, Snack Vault Rush)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#00eaff] font-bold">•</span>
              <span>Achieve milestones and unlock achievements</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#00eaff] font-bold">•</span>
              <span>Participate in community events and challenges</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
