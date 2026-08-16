import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, Waves } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

const SOUNDSCAPE_OPTIONS = [
  { id: "cyber_rain", name: "Cyber Rain", description: "Soft static and a low neon hum" },
  { id: "neon_lofi", name: "Neon Lo-fi", description: "Warm chords for a relaxed room" },
  { id: "cosmic_drone", name: "Cosmic Drone", description: "A slow, spacious atmosphere" },
  { id: "sanctuary_waves", name: "Sanctuary Waves", description: "Gentle waves with a calm pulse" },
  { id: "off", name: "Off", description: "No ambient audio" },
] as const;

type SoundscapeType = (typeof SOUNDSCAPE_OPTIONS)[number]["id"];

interface AmbientSoundscapeProps {
  loungeId: number;
  themeColor: string;
}

type AudioNodeBundle = {
  context: AudioContext;
  nodes: AudioNode[];
};

export default function AmbientSoundscape({ loungeId, themeColor }: AmbientSoundscapeProps) {
  const audioRef = useRef<AudioNodeBundle | null>(null);
  const [selectedType, setSelectedType] = useState<SoundscapeType>("cyber_rain");
  const [volume, setVolume] = useState(0.5);
  const [isEnabled, setIsEnabled] = useState(false);
  const { data: soundscape } = trpc.lounge.getSoundscape.useQuery({ loungeId });
  const utils = trpc.useUtils();
  const updateSoundscape = trpc.lounge.updateSoundscape.useMutation({
    onSuccess: () => utils.lounge.getSoundscape.invalidate({ loungeId }),
    onError: () => toast.error("Could not save soundscape settings"),
  });

  useEffect(() => {
    if (!soundscape) return;
    const nextType = (soundscape.soundscapeType || "cyber_rain") as SoundscapeType;
    setSelectedType(nextType);
    setVolume(Number(soundscape.volume || 0.5));
    setIsEnabled(Boolean(soundscape.enabled) && nextType !== "off");
  }, [soundscape]);

  useEffect(() => () => stopSoundscape(), []);

  const startSoundscape = async (type: SoundscapeType, nextVolume: number) => {
    if (type === "off") return;
    stopSoundscape();

    const AudioContextConstructor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) {
      toast.error("Ambient audio is not supported in this browser");
      return;
    }

    const context = new AudioContextConstructor();
    await context.resume();
    const master = context.createGain();
    master.gain.value = Math.max(0, Math.min(1, nextVolume)) * 0.18;
    master.connect(context.destination);
    const nodes: AudioNode[] = [master];

    const frequencies: Record<Exclude<SoundscapeType, "off">, [number, number]> = {
      cyber_rain: [84, 126],
      neon_lofi: [174, 261],
      cosmic_drone: [48, 72],
      sanctuary_waves: [110, 165],
    };
    const [primaryFrequency, secondaryFrequency] = frequencies[type];

    const primary = context.createOscillator();
    primary.type = type === "neon_lofi" ? "triangle" : "sine";
    primary.frequency.value = primaryFrequency;
    primary.connect(master);
    primary.start();
    nodes.push(primary);

    const secondary = context.createOscillator();
    secondary.type = "sine";
    secondary.frequency.value = secondaryFrequency;
    const secondaryGain = context.createGain();
    secondaryGain.gain.value = 0.35;
    secondary.connect(secondaryGain).connect(master);
    secondary.start();
    nodes.push(secondary, secondaryGain);

    const lfo = context.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = type === "cosmic_drone" ? 0.08 : 0.16;
    const lfoGain = context.createGain();
    lfoGain.gain.value = type === "sanctuary_waves" ? 0.12 : 0.07;
    lfo.connect(lfoGain).connect(master.gain);
    lfo.start();
    nodes.push(lfo, lfoGain);

    if (type === "cyber_rain" || type === "sanctuary_waves") {
      const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
      const channel = buffer.getChannelData(0);
      for (let index = 0; index < channel.length; index += 1) {
        channel[index] = (Math.random() * 2 - 1) * 0.18;
      }
      const noise = context.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      const filter = context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = type === "cyber_rain" ? 1800 : 700;
      const noiseGain = context.createGain();
      noiseGain.gain.value = type === "cyber_rain" ? 0.28 : 0.16;
      noise.connect(filter).connect(noiseGain).connect(master);
      noise.start();
      nodes.push(noise, filter, noiseGain);
    }

    audioRef.current = { context, nodes };
  };

  function stopSoundscape() {
    const active = audioRef.current;
    if (!active) return;
    active.nodes.forEach((node) => {
      try {
        if ("stop" in node && typeof node.stop === "function") {
          (node as AudioScheduledSourceNode).stop();
        }
        node.disconnect();
      } catch {
        // Audio nodes may already be stopped or disconnected.
      }
    });
    void active.context.close();
    audioRef.current = null;
  }

  const persist = (nextType: SoundscapeType, nextVolume: number, nextEnabled: boolean) => {
    updateSoundscape.mutate({
      loungeId,
      soundscapeType: nextType,
      volume: nextVolume,
      enabled: nextEnabled,
    });
  };

  const handleToggle = async () => {
    const nextEnabled = !isEnabled && selectedType !== "off";
    setIsEnabled(nextEnabled);
    if (nextEnabled) {
      await startSoundscape(selectedType, volume);
    } else {
      stopSoundscape();
    }
    persist(selectedType, volume, nextEnabled);
  };

  const handleTypeChange = async (nextType: SoundscapeType) => {
    setSelectedType(nextType);
    const nextEnabled = nextType !== "off" && isEnabled;
    setIsEnabled(nextEnabled);
    if (nextEnabled) {
      await startSoundscape(nextType, volume);
    } else {
      stopSoundscape();
    }
    persist(nextType, volume, nextEnabled);
  };

  const handleVolumeChange = async (nextVolume: number) => {
    setVolume(nextVolume);
    if (isEnabled) await startSoundscape(selectedType, nextVolume);
    persist(selectedType, nextVolume, isEnabled);
  };

  const selectedOption = SOUNDSCAPE_OPTIONS.find((option) => option.id === selectedType) || SOUNDSCAPE_OPTIONS[0];

  return (
    <div className="rounded-lg border-2 bg-[#1a1f2e] p-4" style={{ borderColor: `${themeColor}88` }}>
      <div className="mb-3 flex items-center gap-2">
        <Waves className="h-5 w-5" style={{ color: themeColor }} />
        <div>
          <h3 className="font-bold" style={{ color: themeColor }}>Ambient Companion</h3>
          <p className="text-xs text-[#7a7f8e]">Optional audio for your lounge session</p>
        </div>
      </div>

      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#00eaff]" htmlFor="soundscape-select">
        Soundscape
      </label>
      <select
        id="soundscape-select"
        value={selectedType}
        onChange={(event) => void handleTypeChange(event.target.value as SoundscapeType)}
        className="mb-2 w-full rounded-md border border-[#2a2f3e] bg-[#0b0e14] px-3 py-2 text-sm text-[#00eaff] outline-none focus:border-[#00eaff]"
      >
        {SOUNDSCAPE_OPTIONS.map((option) => (
          <option key={option.id} value={option.id}>{option.name}</option>
        ))}
      </select>
      <p className="mb-4 text-xs text-[#7a7f8e]">{selectedOption.description}</p>

      <div className="mb-4 flex items-center gap-3">
        <Volume2 className="h-4 w-4 text-[#7a7f8e]" />
        <input
          aria-label="Ambient companion volume"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(event) => void handleVolumeChange(Number(event.target.value))}
          className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-[#2a2f3e]"
          style={{ background: `linear-gradient(to right, ${themeColor} 0%, ${themeColor} ${volume * 100}%, #2a2f3e ${volume * 100}%, #2a2f3e 100%)` }}
        />
        <span className="w-10 text-right text-xs text-[#7a7f8e]">{Math.round(volume * 100)}%</span>
      </div>

      <Button
        type="button"
        onClick={() => void handleToggle()}
        disabled={selectedType === "off" || updateSoundscape.isPending}
        className="w-full font-bold text-black disabled:opacity-50"
        style={{ backgroundColor: themeColor }}
      >
        {isEnabled ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
        {isEnabled ? "Pause Ambient Audio" : "Start Ambient Audio"}
      </Button>
    </div>
  );
}
