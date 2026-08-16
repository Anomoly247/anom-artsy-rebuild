import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, MessageCircle, Share2, Zap, Play, Volume2, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";

interface FeedPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  liked: boolean;
}

interface Reel {
  id: string;
  title: string;
  creator: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
}

export default function SocialFeed() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [posts, setPosts] = useState<FeedPost[]>([
    {
      id: "1",
      author: "Pixel the Explorer",
      avatar: "🤖",
      content: "Just discovered a new corner of the Anom Universe! The neon glow is absolutely stunning. #AnonArtsy #Exploration",
      timestamp: "2 hours ago",
      likes: 245,
      comments: 18,
      liked: false,
    },
    {
      id: "2",
      author: "Dot's Adventures",
      avatar: "✨",
      content: "My family lounge just hit 100 members! Thanks everyone for making this such a fun space to connect. #FamilyFirst #LoungeLove",
      image: "🎉",
      timestamp: "4 hours ago",
      likes: 512,
      comments: 42,
      liked: false,
    },
    {
      id: "3",
      author: "Cosmic Meme Master",
      avatar: "🌌",
      content: "When you finally unlock that rare achievement... 😎 #AnonArtsy #LevelUp",
      image: "🏆",
      timestamp: "6 hours ago",
      likes: 1203,
      comments: 89,
      liked: false,
    },
    {
      id: "4",
      author: "Neon Enthusiast",
      avatar: "💜",
      content: "The new purple theme is fire! 🔥 Switched all my lounges to this vibe. Who else is team purple? #NeonLife",
      timestamp: "8 hours ago",
      likes: 678,
      comments: 56,
      liked: false,
    },
    {
      id: "5",
      author: "Kids Corner Creator",
      avatar: "🎨",
      content: "My kids just finished all the Pixel & Dot episodes! They're so excited about the coloring pages. Educational + fun! #KidsCorner #ParentWin",
      timestamp: "10 hours ago",
      likes: 423,
      comments: 31,
      liked: false,
    },
  ]);

  const reels: Reel[] = [
    {
      id: "reel-1",
      title: "Tater & Clifford: The Quest Begins",
      creator: "Anom Studios",
      description: "Join Tater and Clifford on their first adventure in the Anom Universe!",
      thumbnail: "🎬",
      duration: "3:45",
      views: 12543,
    },
    {
      id: "reel-2",
      title: "Clifford's Comedy Hour",
      creator: "Anom Studios",
      description: "Laugh along with Clifford's hilarious takes on digital life!",
      thumbnail: "😂",
      duration: "2:30",
      views: 8234,
    },
    {
      id: "reel-3",
      title: "Tater's Cooking Show",
      creator: "Anom Studios",
      description: "Learn to cook digital dishes with Tater!",
      thumbnail: "🍳",
      duration: "4:15",
      views: 5678,
    },
    {
      id: "reel-4",
      title: "Tater & Clifford: Best Friends Forever",
      creator: "Anom Studios",
      description: "A heartwarming episode about friendship and loyalty.",
      thumbnail: "💜",
      duration: "5:20",
      views: 15234,
    },
  ];

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleComment = (postId: string) => {
    toast.info("Comments feature coming soon!");
  };

  const handleShare = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const shareUrl = `${window.location.origin}/feed/post/${postId}`;
    const shareText = `${post.content} - Check out this post on Anom Artsy!`;

    // Social media share options
    const shareOptions = [
      {
        name: 'Twitter',
        url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=AnonArtsy,SocialGood`,
      },
      {
        name: 'Facebook',
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      },
      {
        name: 'LinkedIn',
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      },
    ];

    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied! Share on social media or paste anywhere.');
  };

  const handlePlayReel = (reelId: string) => {
    toast.success("Playing reel! 🎥");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-[#00eaff] text-xl">Loading Feed...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#00eaff] text-xl mb-4">Please sign in to view the social feed</p>
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
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="text-[#7a7f8e] flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold neon-text-cyan">Live from the Universe</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Reels Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#ff00cc] mb-6 flex items-center gap-2">
            <Play className="w-6 h-6" />
            Featured Reels: Tater & Clifford Series
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {reels.map((reel) => (
              <Card
                key={reel.id}
                className="bg-[#1a1f2e] border border-[#2a2f3e] overflow-hidden hover:border-[#ff00cc] transition-all cursor-pointer group"
                style={{
                  boxShadow: "0 0 10px rgba(255, 0, 204, 0.3), 0 0 20px rgba(255, 0, 204, 0.1)",
                }}
                onClick={() => handlePlayReel(reel.id)}
              >
                {/* Reel Thumbnail */}
                <div className="relative bg-gradient-to-br from-[#1a1f2e] to-[#0b0e14] aspect-video flex items-center justify-center overflow-hidden">
                  <div className="text-8xl group-hover:scale-110 transition-transform">{reel.thumbnail}</div>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                    <Play className="w-16 h-16 text-[#ff00cc] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-[#00eaff] font-bold">
                    {reel.duration}
                  </div>
                </div>

                {/* Reel Info */}
                <div className="p-4">
                  <h3 className="font-bold text-[#ff00cc] mb-1 line-clamp-2">{reel.title}</h3>
                  <p className="text-sm text-[#7a7f8e] mb-2">{reel.creator}</p>
                  <p className="text-sm text-[#00eaff] line-clamp-2 mb-3">{reel.description}</p>
                  <div className="flex items-center justify-between text-xs text-[#7a7f8e]">
                    <span>👁️ {reel.views.toLocaleString()} views</span>
                    <Button
                      size="sm"
                      className="bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black font-bold"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayReel(reel.id);
                      }}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Play
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#2a2f3e] my-12"></div>

        {/* Create Post Section */}
        <Card
          className="bg-[#1a1f2e] border border-[#2a2f3e] p-6 mb-8"
          style={{
            boxShadow: "0 0 10px rgba(0, 234, 255, 0.5), 0 0 20px rgba(0, 234, 255, 0.3)",
          }}
        >
          <div className="flex gap-4">
            <div className="text-2xl">🌟</div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="What's happening in your Anom Universe?"
                className="w-full bg-[#0b0e14] border border-[#2a2f3e] rounded px-4 py-3 text-[#00eaff] placeholder-[#7a7f8e] focus:outline-none focus:border-[#ff00cc]"
                onClick={() => toast.info("Post creation coming soon!")}
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" className="text-[#7a7f8e] border-[#2a2f3e]">
                  Add Image
                </Button>
                <Button className="btn-neon-cyan">Post</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Feed Posts */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#00eaff] mb-6">Community Posts</h2>
          {posts.map((post) => (
            <Card
              key={post.id}
              className="bg-[#1a1f2e] border border-[#2a2f3e] p-6 hover:border-[#ff00cc] transition-colors"
              style={{
                boxShadow: "0 0 10px rgba(255, 0, 204, 0.3), 0 0 20px rgba(255, 0, 204, 0.1)",
              }}
            >
              {/* Post Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{post.avatar}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#00eaff]">{post.author}</h3>
                  <p className="text-xs text-[#7a7f8e]">{post.timestamp}</p>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-[#00eaff] mb-4 leading-relaxed">{post.content}</p>

              {/* Post Image */}
              {post.image && (
                <div className="mb-4 p-4 bg-[#0b0e14] rounded border border-[#2a2f3e] text-center text-3xl">
                  {post.image}
                </div>
              )}

              {/* Post Stats */}
              <div className="flex gap-6 text-sm text-[#7a7f8e] mb-4 pb-4 border-b border-[#2a2f3e]">
                <span>{post.likes} likes</span>
                <span>{post.comments} comments</span>
              </div>

              {/* Post Actions */}
              <div className="flex justify-around gap-2">
                <Button
                  variant="ghost"
                  className="flex-1 text-[#7a7f8e] hover:text-[#ff00cc] gap-2"
                  onClick={() => handleLike(post.id)}
                >
                  <Heart
                    className={`w-4 h-4 ${post.liked ? "fill-[#ff00cc] text-[#ff00cc]" : ""}`}
                  />
                  <span className="text-sm">{post.liked ? "Liked" : "Like"}</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 text-[#7a7f8e] hover:text-[#00eaff] gap-2"
                  onClick={() => handleComment(post.id)}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">Comment</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 text-[#7a7f8e] hover:text-[#9d4edd] gap-2"
                  onClick={() => handleShare(post.id)}
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="text-[#00eaff] border-[#2a2f3e] gap-2"
            onClick={() => toast.info("More posts loading...")}
          >
            <Zap className="w-4 h-4" />
            Load More Posts
          </Button>
        </div>
      </main>
    </div>
  );
}
