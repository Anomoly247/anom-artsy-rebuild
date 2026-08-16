import { z } from "zod";
import { addCoinTransaction, addXP, getOrCreateUserProfile, recordGameScore, getGameScoresHistory, getGlobalLeaderboard } from "./db";
import { router, protectedProcedure } from "./_core/trpc";

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
        const baseReward = GAME_COIN_REWARDS[input.gameId] || 50;
        const coinReward = Math.max(baseReward, Math.floor(input.score / 10) * 10);
        const xpReward = GAME_XP_REWARDS[input.gameId] || 10;

        // Record score persistently
        await recordGameScore(ctx.user.id, input.gameId, input.score, coinReward.toString());

        // Award coins
        await addCoinTransaction(
          ctx.user.id,
          "earn",
          coinReward.toString(),
          `Game reward: ${input.gameId} (Score: ${input.score})`
        );

        // Award XP
        await addXP(ctx.user.id, xpReward);

        const profile = await getOrCreateUserProfile(ctx.user.id);

        return {
          success: true,
          coinsAwarded: coinReward,
          xpAwarded: xpReward,
          newBalance: profile?.anomCoinBalance || "0",
          newLevel: profile?.level || 1,
          message: `🎉 You earned ${coinReward} Glow Points and ${xpReward} XP!`,
        };
      } catch (error) {
        console.error("Error saving game score:", error);
        throw new Error("Failed to save game score and award coins");
      }
    }),

  getGameHistory: protectedProcedure.query(async ({ ctx }) => {
    try {
      const history = await getGameScoresHistory(ctx.user.id);
      const totalCoins = history.reduce((sum, item) => sum + Number(item.coinReward || 0), 0);
      return {
        games: history,
        totalCoinsEarned: totalCoins.toString(),
        totalGamesPlayed: history.length,
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

  getLeaderboard: protectedProcedure.query(async ({ ctx }) => {
    try {
      const topPlayers = await getGlobalLeaderboard(10);
      const index = topPlayers.findIndex((p) => p.userId === ctx.user.id);
      return {
        topPlayers,
        yourRank: index >= 0 ? index + 1 : 0,
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
