import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import {
  generateMusicShareUrls,
  generateImpactShareUrls,
  generateMusicShareCard,
  generateImpactShareCard,
  generateShareQuote,
} from "./sharing";

/**
 * Sharing Router - tRPC procedures for social sharing
 */
export const sharingRouter = router({
  /**
   * Generate share URLs for a music track
   */
  generateMusicShareUrls: publicProcedure
    .input(
      z.object({
        trackId: z.string(),
        title: z.string(),
        artist: z.string(),
        mood: z.string(),
        genre: z.string(),
        license: z.string(),
      })
    )
    .query(({ input }) => {
      const card = generateMusicShareCard(
        input.trackId,
        input.title,
        input.artist,
        input.mood,
        input.genre,
        input.license
      );
      return {
        card,
        urls: generateMusicShareUrls(card),
        quote: generateShareQuote("music", input),
      };
    }),

  /**
   * Generate share URLs for impact metrics
   */
  generateImpactShareUrls: publicProcedure
    .input(
      z.object({
        metric: z.string(),
        value: z.string(),
        description: z.string(),
      })
    )
    .query(({ input }) => {
      const card = generateImpactShareCard(
        input.metric,
        input.value,
        input.description
      );
      return {
        card,
        urls: generateImpactShareUrls(card),
        quote: generateShareQuote("impact", input),
      };
    }),

  /**
   * Get share quote for music
   */
  getMusicShareQuote: publicProcedure
    .input(
      z.object({
        title: z.string(),
        artist: z.string(),
      })
    )
    .query(({ input }) => {
      return generateShareQuote("music", input);
    }),

  /**
   * Get share quote for impact
   */
  getImpactShareQuote: publicProcedure
    .input(
      z.object({
        metric: z.string(),
        value: z.string(),
      })
    )
    .query(({ input }) => {
      return generateShareQuote("impact", input);
    }),
});
