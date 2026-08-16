import { useMemo, useState } from "react";

const REACTION_OPTIONS = ["💜", "✨", "🔥", "😂", "👏", "🌈"] as const;

interface Reaction {
  id: number;
  messageId: number;
  userId: number;
  emoji: string;
  createdAt: Date;
}

interface LoungeMessageReactionsProps {
  messageId: number;
  reactions: Reaction[];
  themeColor: string;
  onToggle: (emoji: string) => void;
}

export default function LoungeMessageReactions({ messageId, reactions, themeColor, onToggle }: LoungeMessageReactionsProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const grouped = useMemo(() => {
    const counts = new Map<string, number>();
    reactions.forEach((reaction) => counts.set(reaction.emoji, (counts.get(reaction.emoji) || 0) + 1));
    return Array.from(counts.entries());
  }, [reactions]);

  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5" aria-label={`Reactions for message ${messageId}`}>
      {grouped.map(([emoji, count]) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onToggle(emoji)}
          className="rounded-full border px-2 py-1 text-xs transition-transform hover:scale-105"
          style={{ borderColor: `${themeColor}88`, backgroundColor: `${themeColor}12` }}
          aria-label={`Toggle ${emoji} reaction, ${count} reactions`}
        >
          {emoji} {count}
        </button>
      ))}
      <button
        type="button"
        onClick={() => setIsPickerOpen((open) => !open)}
        className="rounded-full border border-[#2a2f3e] px-2 py-1 text-xs text-[#7a7f8e] transition-colors hover:border-[#00eaff] hover:text-[#00eaff]"
        aria-expanded={isPickerOpen}
        aria-label="Add an emoji reaction"
      >
        + React
      </button>
      {isPickerOpen && (
        <div className="flex items-center gap-1 rounded-full border border-[#2a2f3e] bg-[#1a1f2e] px-2 py-1">
          {REACTION_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                onToggle(emoji);
                setIsPickerOpen(false);
              }}
              className="rounded-full p-1 text-sm transition-transform hover:scale-125"
              aria-label={`React with ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
