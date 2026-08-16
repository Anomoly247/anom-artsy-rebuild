import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getTierDefinition,
  getAllTiers,
  getTierUpgradePrice,
  getTierComparison,
  isValidTier,
} from "./membershipTiers";
import { TRPCError } from "@trpc/server";

/**
 * Membership Router - tRPC procedures for membership tiers and tipping
 */
export const membershipRouter = router({
  /**
   * Get all tier definitions
   */
  getTiers: publicProcedure.query(() => {
    return getAllTiers();
  }),

  /**
   * Get specific tier details
   */
  getTierDetails: publicProcedure
    .input(z.object({ tier: z.string() }))
    .query(({ input }) => {
      if (!isValidTier(input.tier)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid tier" });
      }
      return getTierDefinition(input.tier);
    }),

  /**
   * Get tier comparison for UI
   */
  getTierComparison: publicProcedure.query(() => {
    return getTierComparison();
  }),

  /**
   * Get user's current membership status
   */
  getMyMembership: protectedProcedure.query(async ({ ctx }) => {
    const { getOrCreateUserProfile } = await import("./db");
    const profile = await getOrCreateUserProfile(ctx.user.id);

    if (!profile) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Profile not found" });
    }

    const tier = profile.membershipTier || "basic";
    const tierDef = getTierDefinition(tier as any);
    const isActive = !profile.tierExpiresAt || new Date() < profile.tierExpiresAt;

    return {
      tier,
      tierName: tierDef.displayName,
      upgradeDate: profile.tierUpgradedAt,
      expiresAt: profile.tierExpiresAt,
      isActive,
      coinMultiplier: profile.coinMultiplier,
      daysRemaining:
        profile.tierExpiresAt && isActive
          ? Math.ceil(
              (profile.tierExpiresAt.getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : null,
    };
  }),

  /**
   * Get upgrade price from one tier to another
   */
  getUpgradePrice: publicProcedure
    .input(
      z.object({
        fromTier: z.string(),
        toTier: z.string(),
      })
    )
    .query(({ input }) => {
      if (!isValidTier(input.fromTier) || !isValidTier(input.toTier)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid tier" });
      }
      const price = getTierUpgradePrice(input.fromTier, input.toTier);
      return { price };
    }),

  /**
   * Create tip
   */
  createTip: protectedProcedure
    .input(
      z.object({
        amount: z.number().min(1, "Amount must be at least $1"),
        message: z.string().optional(),
        tipType: z.enum(["one_time", "recurring"]).default("one_time"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { createTip } = await import("./db");
      return await createTip(ctx.user.id, input.amount, input.message, input.tipType);
    }),

  /**
   * Get user's tip history
   */
  getTipHistory: protectedProcedure.query(async ({ ctx }) => {
    const { getUserTips } = await import("./db");
    return await getUserTips(ctx.user.id);
  }),

  /**
   * Get platform tip leaderboard
   */
  getTipLeaderboard: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      // Placeholder - return empty array
      return [];
    }),

  /**
   * Get total tips received
   */
  getTotalTips: publicProcedure.query(async () => {
    // Placeholder - return 0
    return 0;
  }),

  /**
   * Create tier upgrade purchase
   */
  createTierUpgrade: protectedProcedure
    .input(
      z.object({
        toTier: z.string(),
        duration: z.number().default(30),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!isValidTier(input.toTier)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid tier" });
      }

      // Placeholder - return success
      return { success: true, purchaseId: Math.random() };
    }),

  /**
   * Get tier purchase history
   */
  getTierPurchaseHistory: protectedProcedure.query(async ({ ctx }) => {
    // Placeholder - return empty array
    return [];
  }),
});
