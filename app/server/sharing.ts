/**
 * Social Sharing Service
 * Generates share URLs and cards for music tracks and mission metrics
 */

export interface ShareOptions {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  hashtags?: string[];
  via?: string; // For Twitter
}

export interface MusicShareCard {
  title: string;
  artist: string;
  mood: string;
  genre: string;
  license: string;
  shareUrl: string;
  imageUrl?: string;
}

export interface ImpactShareCard {
  metric: string;
  value: string;
  description: string;
  shareUrl: string;
  imageUrl?: string;
}

/**
 * Generate Twitter share URL
 */
export function generateTwitterShareUrl(options: ShareOptions): string {
  const params = new URLSearchParams();
  params.append("text", options.title);
  if (options.description) {
    params.append("text", `${options.title}\n\n${options.description}`);
  }
  params.append("url", options.url);
  if (options.hashtags && options.hashtags.length > 0) {
    params.append("hashtags", options.hashtags.join(","));
  }
  if (options.via) {
    params.append("via", options.via);
  }
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/**
 * Generate Facebook share URL
 */
export function generateFacebookShareUrl(options: ShareOptions): string {
  const params = new URLSearchParams();
  params.append("u", options.url);
  params.append("quote", options.title);
  if (options.description) {
    params.append("description", options.description);
  }
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}

/**
 * Generate LinkedIn share URL
 */
export function generateLinkedInShareUrl(options: ShareOptions): string {
  const params = new URLSearchParams();
  params.append("url", options.url);
  params.append("title", options.title);
  if (options.description) {
    params.append("summary", options.description);
  }
  return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
}

/**
 * Generate WhatsApp share URL
 */
export function generateWhatsAppShareUrl(options: ShareOptions): string {
  const text = `${options.title}\n\n${options.description || ""}\n\n${options.url}`;
  const params = new URLSearchParams();
  params.append("text", text);
  return `https://wa.me/?${params.toString()}`;
}

/**
 * Generate email share URL
 */
export function generateEmailShareUrl(options: ShareOptions): string {
  const subject = encodeURIComponent(options.title);
  const body = encodeURIComponent(
    `${options.description || ""}\n\n${options.url}\n\nShared from Anom Artsy`
  );
  return `mailto:?subject=${subject}&body=${body}`;
}

/**
 * Generate music track share card
 */
export function generateMusicShareCard(
  trackId: string,
  title: string,
  artist: string,
  mood: string,
  genre: string,
  license: string,
  baseUrl: string = "https://anomsanctuary-bxvj5ftt.manus.space"
): MusicShareCard {
  const shareUrl = `${baseUrl}/music-library?track=${trackId}`;

  return {
    title,
    artist,
    mood,
    genre,
    license,
    shareUrl,
    imageUrl: `${baseUrl}/api/og/music/${trackId}`, // For OG image generation
  };
}

/**
 * Generate impact metric share card
 */
export function generateImpactShareCard(
  metric: string,
  value: string,
  description: string,
  baseUrl: string = "https://anomsanctuary-bxvj5ftt.manus.space"
): ImpactShareCard {
  const shareUrl = `${baseUrl}/mission-hub`;

  return {
    metric,
    value,
    description,
    shareUrl,
    imageUrl: `${baseUrl}/api/og/impact/${metric}`, // For OG image generation
  };
}

/**
 * Generate all share URLs for a music track
 */
export function generateMusicShareUrls(
  card: MusicShareCard,
  baseUrl: string = "https://anomsanctuary-bxvj5ftt.manus.space"
) {
  const description = `Check out "${card.title}" by ${card.artist} - ${card.mood} ${card.genre} music. Copyright-free for creators! 🎵`;
  const hashtags = ["AnonArtsy", "CopyrightFree", "Music", "Creators", card.mood, card.genre];

  return {
    twitter: generateTwitterShareUrl({
      title: `🎵 ${card.title} by ${card.artist}`,
      description,
      url: card.shareUrl,
      hashtags,
      via: "AnonArtsy",
    }),
    facebook: generateFacebookShareUrl({
      title: `Check out: ${card.title}`,
      description,
      url: card.shareUrl,
    }),
    linkedin: generateLinkedInShareUrl({
      title: `Sharing: ${card.title}`,
      description: `Found this amazing copyright-free music on Anom Artsy: "${card.title}" by ${card.artist}`,
      url: card.shareUrl,
    }),
    whatsapp: generateWhatsAppShareUrl({
      title: `🎵 ${card.title}`,
      description,
      url: card.shareUrl,
    }),
    email: generateEmailShareUrl({
      title: `Check out this music: ${card.title}`,
      description,
      url: card.shareUrl,
    }),
  };
}

/**
 * Generate all share URLs for impact metrics
 */
export function generateImpactShareUrls(
  card: ImpactShareCard,
  baseUrl: string = "https://anomsanctuary-bxvj5ftt.manus.space"
) {
  const description = `${card.metric}: ${card.value}\n\n${card.description}\n\nJoin us at Anom Artsy to make a real impact! 🌍`;
  const hashtags = ["AnonArtsy", "SocialGood", "Impact", "Community"];

  return {
    twitter: generateTwitterShareUrl({
      title: `🌍 ${card.metric}: ${card.value}`,
      description,
      url: card.shareUrl,
      hashtags,
      via: "AnonArtsy",
    }),
    facebook: generateFacebookShareUrl({
      title: `Anom Artsy Impact: ${card.metric}`,
      description,
      url: card.shareUrl,
    }),
    linkedin: generateLinkedInShareUrl({
      title: `Anom Artsy's Social Impact`,
      description: `We've achieved: ${card.metric} - ${card.value}. ${card.description}`,
      url: card.shareUrl,
    }),
    whatsapp: generateWhatsAppShareUrl({
      title: `🌍 Anom Artsy Impact`,
      description,
      url: card.shareUrl,
    }),
    email: generateEmailShareUrl({
      title: `Anom Artsy Impact Update`,
      description,
      url: card.shareUrl,
    }),
  };
}

/**
 * Get share button labels and icons
 */
export function getSharePlatforms() {
  return [
    {
      id: "twitter",
      name: "Twitter",
      icon: "Twitter",
      color: "#1DA1F2",
      label: "Share on Twitter",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: "Facebook",
      color: "#1877F2",
      label: "Share on Facebook",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: "Linkedin",
      color: "#0A66C2",
      label: "Share on LinkedIn",
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: "MessageCircle",
      color: "#25D366",
      label: "Share on WhatsApp",
    },
    {
      id: "email",
      name: "Email",
      icon: "Mail",
      color: "#EA4335",
      label: "Share via Email",
    },
  ];
}

/**
 * Generate shareable quote for social media
 */
export function generateShareQuote(
  type: "music" | "impact",
  data: Record<string, any>
): string {
  if (type === "music") {
    return `🎵 Just discovered "${data.title}" by ${data.artist} on Anom Artsy - copyright-free music for creators! #AnonArtsy #CopyrightFree`;
  } else if (type === "impact") {
    return `🌍 Anom Artsy has ${data.metric}: ${data.value}! Join us in making a real impact. #AnonArtsy #SocialGood`;
  }
  return "Check out Anom Artsy! #AnonArtsy";
}
