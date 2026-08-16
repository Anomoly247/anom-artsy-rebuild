/**
 * Music Integration Service
 * Manages copyright-free music library for lounges, profiles, memes, and promotions
 * Integrates with Pixabay Music, Epidemic Sound, and Creative Commons
 */

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  genre: string;
  mood: string;
  license: "pixabay" | "epidemic" | "creative-commons";
  url: string;
  attribution: string;
  preview?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description: string;
  trackIds: string[];
  createdBy: number; // userId
  isPublic: boolean;
}

// Mock music library - in production, this would come from APIs
const MUSIC_LIBRARY: MusicTrack[] = [
  {
    id: "pixabay-1",
    title: "Ambient Dreams",
    artist: "Pixabay Music",
    duration: 180,
    genre: "ambient",
    mood: "chill",
    license: "pixabay",
    url: "https://pixabay.com/music/ambient-dreams/",
    attribution: "Pixabay Music - Free for commercial use",
  },
  {
    id: "pixabay-2",
    title: "Uplifting Journey",
    artist: "Pixabay Music",
    duration: 240,
    genre: "electronic",
    mood: "uplifting",
    license: "pixabay",
    url: "https://pixabay.com/music/uplifting-journey/",
    attribution: "Pixabay Music - Free for commercial use",
  },
  {
    id: "pixabay-3",
    title: "Energy Boost",
    artist: "Pixabay Music",
    duration: 200,
    genre: "electronic",
    mood: "energetic",
    license: "pixabay",
    url: "https://pixabay.com/music/energy-boost/",
    attribution: "Pixabay Music - Free for commercial use",
  },
  {
    id: "pixabay-4",
    title: "Inspiring Moments",
    artist: "Pixabay Music",
    duration: 220,
    genre: "orchestral",
    mood: "inspiring",
    license: "pixabay",
    url: "https://pixabay.com/music/inspiring-moments/",
    attribution: "Pixabay Music - Free for commercial use",
  },
  {
    id: "epidemic-1",
    title: "Creative Vibes",
    artist: "Epidemic Sound",
    duration: 210,
    genre: "indie",
    mood: "creative",
    license: "epidemic",
    url: "https://www.epidemicsound.com/",
    attribution: "Epidemic Sound - Royalty-free music",
  },
];

/**
 * Get all available music tracks
 */
export function getAllMusicTracks(): MusicTrack[] {
  return MUSIC_LIBRARY;
}

/**
 * Search music by genre, mood, or title
 */
export function searchMusic(
  query: string,
  filters?: { genre?: string; mood?: string }
): MusicTrack[] {
  return MUSIC_LIBRARY.filter((track) => {
    const matchesQuery =
      !query ||
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.artist.toLowerCase().includes(query.toLowerCase());

    const matchesGenre = !filters?.genre || track.genre === filters.genre;
    const matchesMood = !filters?.mood || track.mood === filters.mood;

    return matchesQuery && matchesGenre && matchesMood;
  });
}

/**
 * Get music by mood (for lounges, profiles, etc.)
 */
export function getMusicByMood(mood: string): MusicTrack[] {
  return MUSIC_LIBRARY.filter((track) => track.mood === mood);
}

/**
 * Get music by genre
 */
export function getMusicByGenre(genre: string): MusicTrack[] {
  return MUSIC_LIBRARY.filter((track) => track.genre === genre);
}

/**
 * Get music for specific use case
 */
export function getMusicForUseCase(
  useCase: "lounge" | "profile" | "meme" | "promotion"
): MusicTrack[] {
  const moodMap: Record<string, string> = {
    lounge: "chill",
    profile: "uplifting",
    meme: "energetic",
    promotion: "inspiring",
  };

  return getMusicByMood(moodMap[useCase] || "chill");
}

/**
 * Get popular music (most used)
 */
export function getPopularMusic(limit: number = 10): MusicTrack[] {
  // In production, this would query usage analytics
  return MUSIC_LIBRARY.slice(0, Math.min(limit, MUSIC_LIBRARY.length));
}

/**
 * Get music licensing info
 */
export function getMusicLicenseInfo(license: string) {
  const licenses: Record<
    string,
    { name: string; attribution: string; link: string; commercial: boolean }
  > = {
    pixabay: {
      name: "Pixabay Music",
      attribution: "Free for commercial and non-commercial use",
      link: "https://pixabay.com/music/",
      commercial: true,
    },
    epidemic: {
      name: "Epidemic Sound",
      attribution: "Royalty-free music for creators",
      link: "https://www.epidemicsound.com/",
      commercial: true,
    },
    "creative-commons": {
      name: "Creative Commons",
      attribution: "Requires attribution",
      link: "https://creativecommons.org/",
      commercial: false,
    },
  };

  return licenses[license] || licenses.pixabay;
}

/**
 * Get all available genres
 */
export function getAvailableGenres(): string[] {
  const genres = new Set(MUSIC_LIBRARY.map((track) => track.genre));
  return Array.from(genres);
}

/**
 * Get all available moods
 */
export function getAvailableMoods(): string[] {
  const moods = new Set(MUSIC_LIBRARY.map((track) => track.mood));
  return Array.from(moods);
}

/**
 * Get music track by ID
 */
export function getMusicTrackById(id: string): MusicTrack | undefined {
  return MUSIC_LIBRARY.find((track) => track.id === id);
}
