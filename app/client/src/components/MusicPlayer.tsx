import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, Volume2, Music, SkipForward, SkipBack, Share2 } from "lucide-react";
import ShareModal from "./ShareModal";
import { trpc } from "@/lib/trpc";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  mood: string;
  genre: string;
  license: string;
}

interface MusicPlayerProps {
  tracks: Track[];
  onTrackChange?: (track: Track) => void;
  compact?: boolean;
}

export default function MusicPlayer({ tracks, onTrackChange, compact = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(70);
  const [showShareModal, setShowShareModal] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];
  const { data: shareData } = trpc.sharing.generateMusicShareUrls.useQuery(
    {
      trackId: currentTrack?.id || "",
      title: currentTrack?.title || "",
      artist: currentTrack?.artist || "",
      mood: currentTrack?.mood || "",
      genre: currentTrack?.genre || "",
      license: currentTrack?.license || "",
    },
    { enabled: !!currentTrack }
  );

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    if (onTrackChange) {
      onTrackChange(tracks[nextIndex]);
    }
  };

  const handlePrevTrack = () => {
    const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    if (onTrackChange) {
      onTrackChange(tracks[prevIndex]);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  if (!currentTrack) {
    return (
      <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-4">
        <p className="text-[#7a7f8e] text-center">No music available</p>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="bg-[#0b0e14] border border-[#2a2f3e] rounded-lg p-3">
        <audio ref={audioRef} src={currentTrack.url} />
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={handlePlayPause}
            className="bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#00eaff] truncate">{currentTrack.title}</p>
            <p className="text-xs text-[#7a7f8e] truncate">{currentTrack.artist}</p>
          </div>
          <Button size="sm" variant="ghost" onClick={handleNextTrack} className="text-[#7a7f8e]">
            <SkipForward className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowShareModal(true)}
            className="text-[#7a7f8e] hover:text-[#ff00cc]"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
        {shareData && (
          <ShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            title={currentTrack.title}
            description={`by ${currentTrack.artist} - ${currentTrack.mood} ${currentTrack.genre}`}
            shareUrls={shareData.urls}
            shareUrl={shareData.card.shareUrl}
          />
        )}
      </div>
    );
  }

  return (
    <Card className="bg-[#1a1f2e] border border-[#ff00cc] p-6">
      <audio ref={audioRef} src={currentTrack.url} />

      <div className="flex items-center gap-4 mb-6">
        <Music className="w-8 h-8 text-[#ff00cc]" />
        <div className="flex-1">
          <h4 className="text-lg font-bold text-[#00eaff]">{currentTrack.title}</h4>
          <p className="text-sm text-[#7a7f8e]">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <Button
          size="sm"
          variant="outline"
          onClick={handlePrevTrack}
          className="text-[#7a7f8e] border-[#2a2f3e]"
        >
          <SkipBack className="w-4 h-4" />
        </Button>

        <Button
          onClick={handlePlayPause}
          className="bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black font-bold w-12 h-12"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={handleNextTrack}
          className="text-[#7a7f8e] border-[#2a2f3e]"
        >
          <SkipForward className="w-4 h-4" />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3 mb-6">
        <Volume2 className="w-4 h-4 text-[#7a7f8e]" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 h-2 bg-[#2a2f3e] rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #ff00cc 0%, #ff00cc ${volume}%, #2a2f3e ${volume}%, #2a2f3e 100%)`,
          }}
        />
        <span className="text-sm text-[#7a7f8e] w-8 text-right">{volume}%</span>
      </div>

      {/* Share Button */}
      <div className="flex gap-2">
        <Button
          onClick={() => setShowShareModal(true)}
          className="flex-1 bg-[#b000ff] hover:bg-[#b000ff]/80 text-white font-bold"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share This Track
        </Button>
      </div>

      {/* Track Info */}
      <div className="bg-[#0b0e14] rounded-lg p-4 border border-[#2a2f3e]">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[#7a7f8e] text-xs mb-1">Mood</p>
            <p className="text-[#00eaff] font-bold capitalize">{currentTrack.mood}</p>
          </div>
          <div>
            <p className="text-[#7a7f8e] text-xs mb-1">Duration</p>
            <p className="text-[#00eaff] font-bold">
              {Math.floor(currentTrack.duration / 60)}:{String(currentTrack.duration % 60).padStart(2, "0")}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-[#7a7f8e] text-xs mb-1">License</p>
            <p className="text-[#ff00cc] font-bold capitalize">{currentTrack.license}</p>
          </div>
        </div>
      </div>

      {/* Playlist */}
      <div className="mt-6">
        <p className="text-sm font-bold text-[#00eaff] mb-3">Playlist ({tracks.length})</p>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {tracks.map((track, idx) => (
            <button
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(idx);
                if (onTrackChange) {
                  onTrackChange(track);
                }
              }}
              className={`w-full text-left p-2 rounded-lg transition-colors ${
                idx === currentTrackIndex
                  ? "bg-[#ff00cc]/20 border border-[#ff00cc]"
                  : "bg-[#0b0e14] border border-[#2a2f3e] hover:border-[#00eaff]"
              }`}
            >
              <p className={`text-sm font-bold ${idx === currentTrackIndex ? "text-[#ff00cc]" : "text-[#00eaff]"}`}>
                {track.title}
              </p>
              <p className="text-xs text-[#7a7f8e]">{track.artist}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {shareData && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title={currentTrack.title}
          description={`by ${currentTrack.artist} - ${currentTrack.mood} ${currentTrack.genre}`}
          shareUrls={shareData.urls}
          shareUrl={shareData.card.shareUrl}
        />
      )}
    </Card>
  );
}
