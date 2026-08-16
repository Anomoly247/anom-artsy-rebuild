import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Heart, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface TippingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TippingModal({ isOpen, onClose }: TippingModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [tipType, setTipType] = useState<"one_time" | "recurring">("one_time");

  const createTip = trpc.membership.createTip.useMutation({
    onSuccess: () => {
      toast.success("Thank you for your support! 💜");
      setSelectedAmount(null);
      setCustomAmount("");
      setMessage("");
      onClose();
    },
    onError: () => {
      toast.error("Failed to process tip");
    },
  });

  if (!isOpen) return null;

  const tipAmounts = [1, 5, 10, 25, 50];
  const finalAmount = selectedAmount || (customAmount ? parseFloat(customAmount) : 0);

  const handleSubmit = () => {
    if (finalAmount <= 0) {
      toast.error("Please select or enter an amount");
      return;
    }

    createTip.mutate({
      amount: finalAmount,
      message,
      tipType,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="bg-[#1a1f2e] border border-[#ff00cc] w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-[#ff00cc]" />
              <h2 className="text-2xl font-bold text-[#ff00cc]">Support Anom Artsy</h2>
            </div>
            <button
              onClick={onClose}
              className="text-[#7a7f8e] hover:text-[#00eaff] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Description */}
          <p className="text-[#7a7f8e] mb-6">
            Your support helps us continue building amazing features and supporting our community.
          </p>

          {/* Tip Type */}
          <div className="mb-6">
            <p className="text-sm font-bold text-[#00eaff] mb-3">Tip Type</p>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer flex-1">
                <input
                  type="radio"
                  checked={tipType === "one_time"}
                  onChange={() => setTipType("one_time")}
                  className="w-4 h-4"
                />
                <span className="text-[#7a7f8e]">One-Time</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer flex-1">
                <input
                  type="radio"
                  checked={tipType === "recurring"}
                  onChange={() => setTipType("recurring")}
                  className="w-4 h-4"
                />
                <span className="text-[#7a7f8e]">Monthly</span>
              </label>
            </div>
          </div>

          {/* Amount Selection */}
          <div className="mb-6">
            <p className="text-sm font-bold text-[#00eaff] mb-3">Select Amount</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {tipAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  className={`p-3 rounded-lg border-2 font-bold transition-colors ${
                    selectedAmount === amount
                      ? "border-[#ff00cc] bg-[#ff00cc]/20 text-[#ff00cc]"
                      : "border-[#2a2f3e] bg-[#0b0e14] text-[#7a7f8e] hover:border-[#00eaff]"
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="flex gap-2">
              <DollarSign className="w-5 h-5 text-[#7a7f8e] mt-2" />
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                placeholder="Custom amount"
                min="1"
                step="0.01"
                className="flex-1 px-3 py-2 bg-[#0b0e14] border border-[#2a2f3e] rounded-lg text-[#00eaff] placeholder-[#7a7f8e] focus:border-[#ff00cc] focus:outline-none"
              />
            </div>
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-[#00eaff] mb-2">
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave a message of support..."
              maxLength={500}
              className="w-full h-20 px-3 py-2 bg-[#0b0e14] border border-[#2a2f3e] rounded-lg text-[#00eaff] placeholder-[#7a7f8e] focus:border-[#ff00cc] focus:outline-none resize-none"
            />
            <p className="text-xs text-[#7a7f8e] mt-1">
              {message.length}/500 characters
            </p>
          </div>

          {/* Summary */}
          {finalAmount > 0 && (
            <div className="bg-[#0b0e14] rounded-lg p-4 mb-6 border border-[#2a2f3e]">
              <div className="flex justify-between items-center">
                <span className="text-[#7a7f8e]">Total Amount:</span>
                <span className="text-2xl font-bold text-[#00eaff]">
                  ${finalAmount.toFixed(2)}
                </span>
              </div>
              {tipType === "recurring" && (
                <p className="text-xs text-[#7a7f8e] mt-2">
                  Billed monthly until canceled
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 text-[#7a7f8e] border-[#2a2f3e]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createTip.isPending || finalAmount <= 0}
              className="flex-1 bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black font-bold disabled:opacity-50"
            >
              <Heart className="w-4 h-4 mr-2" />
              Tip ${finalAmount.toFixed(2)}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
