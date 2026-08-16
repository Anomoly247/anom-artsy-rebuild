import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import {
  getAllMusicTracks,
  searchMusic,
  getMusicByMood,
  getMusicByGenre,
  getMusicForUseCase,
  getPopularMusic,
  getMusicLicenseInfo,
  getAvailableGenres,
  getAvailableMoods,
  getMusicTrackById,
} from "./music";

/**
 * Music Router - tRPC procedures for music functionality
 */
export const musicRouter = router({
  /**
   * Get all available music tracks
   */
  getAllTracks: publicProcedure.query(() => {
    return getAllMusicTracks();
  }),

  /**
   * Search music by query and filters
   */
  search: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        genre: z.string().optional(),
        mood: z.string().optional(),
      })
    )
    .query(({ input }) => {
      return searchMusic(input.query || "", {
        genre: input.genre,
        mood: input.mood,
      });
    }),

  /**
   * Get music by mood
   */
  getByMood: publicProcedure
    .input(z.object({ mood: z.string() }))
    .query(({ input }) => {
      return getMusicByMood(input.mood);
    }),

  /**
   * Get music by genre
   */
  getByGenre: publicProcedure
    .input(z.object({ genre: z.string() }))
    .query(({ input }) => {
      return getMusicByGenre(input.genre);
    }),

  /**
   * Get music for specific use case
   */
  getForUseCase: publicProcedure
    .input(z.object({ useCase: z.enum(["lounge", "profile", "meme", "promotion"]) }))
    .query(({ input }) => {
      return getMusicForUseCase(input.useCase);
    }),

  /**
   * Get popular music
   */
  getPopular: publicProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(({ input }) => {
      return getPopularMusic(input.limit || 10);
    }),

  /**
   * Get music licensing info
   */
  getLicenseInfo: publicProcedure
    .input(z.object({ license: z.string() }))
    .query(({ input }) => {
      return getMusicLicenseInfo(input.license);
    }),

  /**
   * Get available genres
   */
  getGenres: publicProcedure.query(() => {
    return getAvailableGenres();
  }),

  /**
   * Get available moods
   */
  getMoods: publicProcedure.query(() => {
    return getAvailableMoods();
  }),

  /**
   * Get music track by ID
   */
  getTrackById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return getMusicTrackById(input.id);
    }),
});
