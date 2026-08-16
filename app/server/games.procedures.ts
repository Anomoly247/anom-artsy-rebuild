import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { addCoinTransaction, addXP, getOrCreateUserProfile } from "./db";

const GAME_COIN_REWARDS: Record<string, number> = {
  trivia: 50,
  memory: 75,
  "mood-matcher": 40,
  "snack-vault": 60,
};

const GAME_XP_REWARDS: Record<string, number> = {
  trivia: 10,
  memory: 15,
  "mood-matcher": 8,
  "snack-vault": 12,
};

export const gamesRouter = router({
  saveScore: protectedProcedure
    .input(
      z.object({
        gameId: z.string(),
        score: z.number().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Get base coin reward for the game
        const baseReward = GAME_COIN_REWARDS[input.gameId] || 50;
        
        // Calculate coin reward based on score (score can multiply the base reward)
        // For example: if score is 100 and base is 50, reward is 100 coins
        const coinReward = Math.max(baseReward, Math.floor(input.score / 10) * 10);
        
        // Get XP reward
        const xpReward = GAME_XP_REWARDS[input.gameId] || 10;

        // Award coins
        const coinResult = await addCoinTransaction(
          ctx.user.id,
          "earn",
          coinReward.toString(),
          `Game reward: ${input.gameId} (Score: ${input.score})`
        );

        // Award XP
        await addXP(ctx.user.id, xpReward);

        // Get updated profile
        const profile = await getOrCreateUserProfile(ctx.user.id);

        return {
          success: true,
          coinsAwarded: coinReward,
          xpAwarded: xpReward,
          newBalance: profile?.anomCoinBalance || "0",
          newLevel: profile?.level || 1,
          message: `🎉 You earned ${coinReward} Anom Coins and ${xpReward} XP!`,
        };
      } catch (error) {
        console.error("Error saving game score:", error);
        throw new Error("Failed to save game score and award coins");
      }
    }),

  getGameHistory: protectedProcedure.query(async ({ ctx }) => {
    try {
      // For now, return empty array as we don't have a game_history table yet
      // This can be expanded later to track detailed game history
      return {
        games: [],
        totalCoinsEarned: "0",
        totalGamesPlayed: 0,
      };
    } catch (error) {
      console.error("Error fetching game history:", error);
      return {
        games: [],
        totalCoinsEarned: "0",
        totalGamesPlayed: 0,
      };
    }
  }),

  getLeaderboard: protectedProcedure.query(async () => {
    try {
      // For now, return empty array as we don't have detailed game tracking yet
      // This can be expanded later with actual leaderboard data
      return {
        topPlayers: [],
        yourRank: 0,
      };
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return {
        topPlayers: [],
        yourRank: 0,
      };
    }
  }),
});
