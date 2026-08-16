import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  X,
  Send,
  Users,
  Heart,
  Smile,
  Search,
  Settings,
  Plus,
  Hash,
  Lock,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: number;
  sender: string;
  avatar: string;
  content: string;
  timestamp: string;
  reactions: string[];
  isOwn: boolean;
}

interface Channel {
  id: number;
  name: string;
  type: "global" | "announcements" | "support" | "events" | "off_topic";
  unread: number;
  members: number;
}

export default function ChatWidget() {
  const { isAuthenticated, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"channels" | "dms">("channels");
  const [selectedChannel, setSelectedChannel] = useState<number | null>(1);
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample channels
  const channels: Channel[] = [
    { id: 1, name: "global", type: "global", unread: 3, members: 2847 },
    { id: 2, name: "announcements", type: "announcements", unread: 0, members: 2847 },
    { id: 3, name: "support", type: "support", unread: 1, members: 1240 },
    { id: 4, name: "events", type: "events", unread: 0, members: 892 },
    { id: 5, name: "off-topic", type: "off_topic", unread: 5, members: 1560 },
  ];

  // Sample messages
  const messages: Message[] = [
    {
      id: 1,
      sender: "Alex",
      avatar: "https://via.placeholder.com/32?text=A",
      content: "Hey everyone! Just launched the new VIP system 🎉",
      timestamp: "2:30 PM",
      reactions: ["🎉", "👍"],
      isOwn: false,
    },
    {
      id: 2,
      sender: "Jordan",
      avatar: "https://via.placeholder.com/32?text=J",
      content: "That's awesome! Love the new features",
      timestamp: "2:31 PM",
      reactions: ["❤️"],
      isOwn: false,
    },
    {
      id: 3,
      sender: user?.name || "You",
      avatar: "https://via.placeholder.com/32?text=U",
      content: "Thanks for the feedback! More updates coming soon",
      timestamp: "2:32 PM",
      reactions: [],
      isOwn: true,
    },
    {
      id: 4,
      sender: "Sam",
      avatar: "https://via.placeholder.com/32?text=S",
      content: "Can't wait to see what's next! 🚀",
      timestamp: "2:33 PM",
      reactions: ["🚀"],
      isOwn: false,
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    toast.success("Message sent!");
    setMessageInput("");
  };

  const handleAddReaction = (emoji: string) => {
    toast.success(`Added ${emoji} reaction`);
    setShowEmojiPicker(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Chat Widget Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#ff00cc] to-[#00eaff] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 z-40 neon-glow"
          style={{
            boxShadow: "0 0 20px rgba(255, 0, 204, 0.8), 0 0 40px rgba(0, 234, 255, 0.6)",
          }}
        >
          <MessageCircle className="w-6 h-6 text-white" />
          {channels.reduce((sum, c) => sum + c.unread, 0) > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {channels.reduce((sum, c) => sum + c.unread, 0)}
            </span>
          )}
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden" style={{boxShadow: '0 0 30px rgba(255, 0, 204, 0.5)'}}>
          {/* Header */}
          <div className="bg-gradient-to-r from-[#ff00cc] to-[#00eaff] p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-white" />
              <h3 className="text-white font-bold">Anom Universe Chat</h3>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#2a2f3e]">
            <button
              onClick={() => setActiveTab("channels")}
              className={`flex-1 py-2 px-4 text-sm font-bold flex items-center justify-center gap-2 ${
                activeTab === "channels"
                  ? "text-[#ff00cc] border-b-2 border-[#ff00cc]"
                  : "text-[#7a7f8e] hover:text-[#00eaff]"
              }`}
            >
              <Hash className="w-4 h-4" />
              Channels
            </button>
            <button
              onClick={() => setActiveTab("dms")}
              className={`flex-1 py-2 px-4 text-sm font-bold flex items-center justify-center gap-2 ${
                activeTab === "dms"
                  ? "text-[#ff00cc] border-b-2 border-[#ff00cc]"
                  : "text-[#7a7f8e] hover:text-[#00eaff]"
              }`}
            >
              <Users className="w-4 h-4" />
              DMs
            </button>
          </div>

          {/* Channel/DM List */}
          {activeTab === "channels" && (
            <div className="flex-1 overflow-y-auto border-b border-[#2a2f3e]">
              <div className="p-3 space-y-2">
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedChannel === channel.id
                        ? "bg-[#2a2f3e] border border-[#00eaff]"
                        : "hover:bg-[#0b0e14]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {channel.type === "announcements" ? (
                          <Lock className="w-4 h-4 text-[#ff00cc]" />
                        ) : (
                          <Hash className="w-4 h-4 text-[#00eaff]" />
                        )}
                        <div>
                          <p className="text-[#00eaff] font-bold text-sm">#{channel.name}</p>
                          <p className="text-[#7a7f8e] text-xs">{channel.members} members</p>
                        </div>
                      </div>
                      {channel.unread > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                          {channel.unread}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0b0e14]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                {!msg.isOwn && (
                  <img src={msg.avatar} alt={msg.sender} className="w-8 h-8 rounded-full" />
                )}
                <div className={`max-w-xs ${msg.isOwn ? "text-right" : "text-left"}`}>
                  {!msg.isOwn && (
                    <p className="text-[#7a7f8e] text-xs font-bold">{msg.sender}</p>
                  )}
                  <div
                    className={`px-3 py-2 rounded-lg text-sm ${
                      msg.isOwn
                        ? "bg-gradient-to-r from-[#ff00cc] to-[#9d4edd] text-white"
                        : "bg-[#1a1f2e] text-[#00eaff] border border-[#2a2f3e]"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div className="flex gap-1 mt-1">
                    {msg.reactions.map((emoji, idx) => (
                      <span key={idx} className="text-xs">
                        {emoji}
                      </span>
                    ))}
                  </div>
                  <p className="text-[#7a7f8e] text-xs mt-1">{msg.timestamp}</p>
                </div>
                {msg.isOwn && (
                  <img src={msg.avatar} alt={msg.sender} className="w-8 h-8 rounded-full" />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[#2a2f3e] space-y-2">
            <div className="flex gap-2">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="bg-[#0b0e14] border border-[#2a2f3e] text-[#00eaff] flex-1"
              />
              <div className="relative">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-[#00eaff] border-[#2a2f3e]"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="w-4 h-4" />
                </Button>
                {showEmojiPicker && (
                  <div className="absolute bottom-12 right-0 bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-2 grid grid-cols-4 gap-1 w-40">
                    {["👍", "❤️", "🎉", "🚀", "😂", "🔥", "✨", "🌟"].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleAddReaction(emoji)}
                        className="text-xl hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button
                size="sm"
                className="btn-neon-magenta"
                onClick={handleSendMessage}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-[#7a7f8e] text-xs">
              Chatting in <span className="text-[#00eaff] font-bold">#global</span>
            </p>
          </div>
        </Card>
      )}
    </>
  );
}
