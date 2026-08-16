import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { saveUserSettings, loadUserSettings, updateUserSetting } from "./settingsPersistence";

export const settingsRouter = router({
  /**
   * Load all user settings
   */
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    const result = await loadUserSettings(ctx.user.id);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.data;
  }),

  /**
   * Update theme setting
   */
  updateTheme: protectedProcedure
    .input(z.object({ theme: z.enum(["magenta", "cyan", "purple"]) }))
    .mutation(async ({ ctx, input }) => {
      const result = await updateUserSetting(ctx.user.id, "neonTheme", input.theme);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    }),

  /**
   * Update name color setting
   */
  updateNameColor: protectedProcedure
    .input(z.object({ nameColor: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await updateUserSetting(ctx.user.id, "nameColor", input.nameColor);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    }),

  /**
   * Update bio setting
   */
  updateBio: protectedProcedure
    .input(z.object({ bio: z.string().max(500) }))
    .mutation(async ({ ctx, input }) => {
      const result = await updateUserSetting(ctx.user.id, "bio", input.bio);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    }),

  /**
   * Update profile image
   */
  updateProfileImage: protectedProcedure
    .input(z.object({ imageUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await updateUserSetting(ctx.user.id, "profileImageUrl", input.imageUrl);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    }),

  /**
   * Update decorations
   */
  updateDecorations: protectedProcedure
    .input(z.object({ packageIds: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      const result = await updateUserSetting(ctx.user.id, "decorationPackageIds", input.packageIds);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    }),

  /**
   * Batch update multiple settings
   */
  updateSettings: protectedProcedure
    .input(z.object({
      bio: z.string().optional(),
      neonTheme: z.enum(["magenta", "cyan", "purple"]).optional(),
      nameColor: z.string().optional(),
      decorationPackageIds: z.array(z.number()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await saveUserSettings(ctx.user.id, {
        bio: input.bio,
        neonTheme: input.neonTheme,
        nameColor: input.nameColor,
        decorationPackageIds: input.decorationPackageIds,
      });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    }),
});
