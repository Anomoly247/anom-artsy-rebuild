import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
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
      <div className="min-h-screen bg-[#0b0e14] text-white flex items-center justify-center p-6">
        <div className="text-center max-w-md w-full bg-[#121824] border border-[#2a2f3e] p-8 rounded-xl shadow-xl">
          <p className="text-[#7a7f8e] mb-6">Sign in to view your Glow Points and Anom Coin wallet</p>
          <Button onClick={startLogin} className="w-full bg-[#00ffff] hover:bg-[#00ffff]/80 text-black font-bold py-3">
            Sign In with Manus
          </Button>
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
        <div className="bg-[#121824] border-2 border-[#00ffff] rounded-xl p-6 mb-8 shadow-[0_0_20px_rgba(0,255,255,0.15)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[#7a7f8e] font-medium">Available Balance</span>
            <Coins className="w-8 h-8 text-[#00ffff]" />
          </div>
          <div className="text-5xl font-extrabold text-[#00ffff] mb-2">
            {balanceLoading ? "..." : balance} <span className="text-xl text-white">AC</span>
          </div>
          <p className="text-sm text-[#7a7f8e]">Earn Anom Coin through community contribution and social good missions.</p>
        </div>

        {/* Transaction History */}
        <div className="bg-[#121824] border border-[#2a2f3e] rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Transaction History</h2>
          {historyLoading ? (
            <p className="text-[#7a7f8e]">Loading history...</p>
          ) : transactions.length === 0 ? (
            <p className="text-[#7a7f8e]">No transactions yet. Complete a mission or participate in lounges to earn coins!</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-[#0b0e14] rounded-lg border border-[#2a2f3e]">
                  <div className="flex items-center gap-3">
                    {Number(tx.amount) >= 0 ? (
                      <TrendingUp className="w-5 h-5 text-[#00ff88]" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-[#ff00cc]" />
                    )}
                    <div>
                      <p className="font-semibold text-white">{tx.description || "Transaction"}</p>
                      <p className="text-xs text-[#7a7f8e]">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`font-bold ${Number(tx.amount) >= 0 ? "text-[#00ff88]" : "text-[#ff00cc]"}`}>
                    {Number(tx.amount) >= 0 ? `+${tx.amount}` : tx.amount} AC
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
