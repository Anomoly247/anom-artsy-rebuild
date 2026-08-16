import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { musicRouter } from "./music.procedures";
import { sharingRouter } from "./sharing.procedures";
import { membershipRouter } from "./membership.procedures";
import { settingsRouter } from "./settings.procedures";
import { gamesRouter } from "./games.procedures";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { getOrCreateUserProfile, getDecorationPackages, updateUserProfile, getCoinBalance, addCoinTransaction, getCoinTransactionHistory, addXP, getAchievements, getUserAchievements, unlockAchievement, createLounge, getUserLounges, getLounge, getLoungeMembersWithUsers, addLoungeMember, removeLoungeMember, addLoungeMessage, getLoungeMessages, getLoungeMessageReactions, toggleLoungeMessageReaction, getLoungeUnreadCounts, markLoungeRead, getLoungeSoundscape, updateLoungeSoundscape, updateLounge, getKidsContent, trackKidsProgress, getUserKidsProgress, getLiveActivityFeed, mintSouvenirBadge, getUserSouvenirBadges, getUserNotifications, markNotificationRead, getActiveSeasonalChallenges, getChallengeLeaderboard } from "./db";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "../shared/const";

export const appRouter = router({
  system: systemRouter,
  settings: settingsRouter,
  games: gamesRouter,
  feed: router({
    getLive: publicProcedure.query(async () => {
      return await getLiveActivityFeed();
    }),
  }),
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  profile: router({
    getMe: protectedProcedure.query(async ({ ctx }) => {
      return await getOrCreateUserProfile(ctx.user.id);
    }),
    getPublic: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input, ctx }) => {
        const profile = await getOrCreateUserProfile(input.userId);
        if (!profile) return null;
        // Get user name from context
        const userName = ctx.user?.name || "Anonymous";
        // Return only public fields
        return {
          id: profile.id,
          userId: profile.userId,
          bio: profile.bio,
          neonTheme: profile.neonTheme,
          avatarUrl: profile.avatarUrl,
          coins: profile.anomCoinBalance || "0",
          level: profile.level || 1,
          achievements: 0,
          name: userName,
        };
      }),
    updateTheme: protectedProcedure
      .input(z.object({ theme: z.enum(["magenta", "cyan", "purple"]) }))
      .mutation(async ({ ctx, input }) => {
        return await updateUserProfile(ctx.user.id, { neonTheme: input.theme });
      }),
    applyDecorations: protectedProcedure
      .input(z.object({ packageIds: z.array(z.number()) }))
      .mutation(async ({ ctx, input }) => {
        return await updateUserProfile(ctx.user.id, {
          decorationPackageIds: input.packageIds,
        });
      }),
    updateProfile: protectedProcedure
      .input(z.object({ name: z.string().optional(), bio: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        return await updateUserProfile(ctx.user.id, { bio: input.bio });
      }),
    updateNameColor: protectedProcedure
      .input(z.object({ nameColor: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return await updateUserProfile(ctx.user.id, { nameColor: input.nameColor });
      }),
  }),

  decorations: router({
    list: publicProcedure.query(async () => {
      return await getDecorationPackages();
    }),
  }),

  coin: router({
    getBalance: protectedProcedure.query(async ({ ctx }) => {
      const balance = await getCoinBalance(ctx.user.id);
      return { balance: balance || "0" };
    }),
    earn: protectedProcedure
      .input(z.object({ amount: z.string(), reason: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return await addCoinTransaction(ctx.user.id, "earn", input.amount, input.reason);
      }),
    spend: protectedProcedure
      .input(z.object({ amount: z.string(), reason: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return await addCoinTransaction(ctx.user.id, "spend", input.amount, input.reason);
      }),
    history: protectedProcedure.query(async ({ ctx }) => {
      return await getCoinTransactionHistory(ctx.user.id);
    }),
  }),

  achievement: router({
    getAll: publicProcedure.query(async () => getAchievements()),
    getUserAchievements: protectedProcedure.query(async ({ ctx }) => getUserAchievements(ctx.user.id)),
    addXP: protectedProcedure
      .input(z.object({ amount: z.number().positive() }))
      .mutation(async ({ ctx, input }) => addXP(ctx.user.id, input.amount)),
    unlock: protectedProcedure
      .input(z.object({ achievementId: z.number() }))
      .mutation(async ({ ctx, input }) => unlockAchievement(ctx.user.id, input.achievementId)),
  }),

  kidsCorner: router({
    getContent: publicProcedure.query(async () => {
      return await getKidsContent();
    }),

    trackProgress: protectedProcedure
      .input(
        z.object({
          contentType: z.string(),
          contentId: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await trackKidsProgress(ctx.user.id, input.contentType, input.contentId);
      }),

    getMyProgress: protectedProcedure.query(async ({ ctx }) => {
      return await getUserKidsProgress(ctx.user.id);
    }),

    mintBadge: protectedProcedure
      .input(
        z.object({
          badgeKey: z.string(),
          badgeTitle: z.string(),
          realmName: z.string().optional(),
          imageUrl: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Award souvenir badge and bonus reward coins/XP
        await addCoinTransaction(ctx.user.id, "earn", "25", `Moonberry Souvenir Badge: ${input.badgeTitle}`);
        await addXP(ctx.user.id, 15);
        return await mintSouvenirBadge(ctx.user.id, input.badgeKey, input.badgeTitle, input.realmName || "Moonberry Farm", input.imageUrl);
      }),

    getMyBadges: protectedProcedure.query(async ({ ctx }) => {
      return await getUserSouvenirBadges(ctx.user.id);
    }),
  }),

  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserNotifications(ctx.user.id);
    }),
    markRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await markNotificationRead(input.notificationId, ctx.user.id);
      }),
  }),

  challenges: router({
    listActive: publicProcedure.query(async () => {
      return await getActiveSeasonalChallenges();
    }),
    getLeaderboard: publicProcedure
      .input(z.object({ challengeId: z.number() }))
      .query(async ({ input }) => {
        return await getChallengeLeaderboard(input.challengeId, 10);
      }),
  }),

  lounge: router({
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1, "Lounge name is required"),
          type: z.enum(["family", "friends", "coworkers"]),
          description: z.string().optional(),
          costAnom: z.string().optional(),
          costReal: z.string().optional(),
          neonTheme: z.enum(["magenta", "cyan", "purple"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await createLounge(
          ctx.user.id,
          input.name,
          input.description || "",
          input.type
        );
      }),

    getMyLounges: protectedProcedure.query(async ({ ctx }) => {
      return await getUserLounges(ctx.user.id);
    }),

    getById: protectedProcedure
      .input(z.object({ loungeId: z.number() }))
      .query(async ({ input }) => {
        return await getLounge(input.loungeId);
      }),

    getMembers: protectedProcedure
      .input(z.object({ loungeId: z.number() }))
      .query(async ({ input }) => {
        return await getLoungeMembersWithUsers(input.loungeId);
      }),

    addMember: protectedProcedure
      .input(
        z.object({
          loungeId: z.number(),
          userId: z.number(),
          role: z.enum(["owner", "admin", "member"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await addLoungeMember(input.loungeId, input.userId, input.role);
      }),

    removeMember: protectedProcedure
      .input(z.object({ loungeId: z.number(), userId: z.number() }))
      .mutation(async ({ input }) => {
        return await removeLoungeMember(input.loungeId, input.userId);
      }),

    sendMessage: protectedProcedure
      .input(
        z.object({
          loungeId: z.number(),
          content: z.string().min(1, "Message cannot be empty"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await addLoungeMessage(input.loungeId, ctx.user.id, input.content);
      }),

    getMessages: protectedProcedure
      .input(z.object({ loungeId: z.number(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await getLoungeMessages(input.loungeId, input.limit);
      }),

    getMessageReactions: protectedProcedure
      .input(z.object({ messageIds: z.array(z.number()).max(100) }))
      .query(async ({ input }) => {
        return await getLoungeMessageReactions(input.messageIds);
      }),

    toggleReaction: protectedProcedure
      .input(z.object({ messageId: z.number(), emoji: z.string().min(1).max(8) }))
      .mutation(async ({ ctx, input }) => {
        return await toggleLoungeMessageReaction(input.messageId, ctx.user.id, input.emoji);
      }),

    getUnreadCounts: protectedProcedure
      .input(z.object({ loungeIds: z.array(z.number()).max(50) }))
      .query(async ({ ctx, input }) => {
        return await getLoungeUnreadCounts(ctx.user.id, input.loungeIds);
      }),

    markRead: protectedProcedure
      .input(z.object({ loungeId: z.number(), lastReadMessageId: z.number().int().nonnegative() }))
      .mutation(async ({ ctx, input }) => {
        return await markLoungeRead(ctx.user.id, input.loungeId, input.lastReadMessageId);
      }),

    getSoundscape: protectedProcedure
      .input(z.object({ loungeId: z.number() }))
      .query(async ({ input }) => {
        return await getLoungeSoundscape(input.loungeId);
      }),

    updateSoundscape: protectedProcedure
      .input(z.object({
        loungeId: z.number(),
        soundscapeType: z.enum(["cyber_rain", "neon_lofi", "cosmic_drone", "sanctuary_waves", "off"]),
        volume: z.number().min(0).max(1),
        enabled: z.boolean(),
      }))
      .mutation(async ({ input }) => {
        return await updateLoungeSoundscape(input.loungeId, {
          soundscapeType: input.soundscapeType,
          volume: input.volume.toFixed(2),
          enabled: input.enabled,
        });
      }),

    updateSettings: protectedProcedure
      .input(
        z.object({
          loungeId: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          neonTheme: z.enum(["magenta", "cyan", "purple"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const updates: Record<string, any> = {};
        if (input.name) updates.name = input.name;
        if (input.description) updates.description = input.description;
        if (input.neonTheme) updates.neonTheme = input.neonTheme;
        return await updateLounge(input.loungeId, updates);
      }),
  }),

  merch: router({
    createRequest: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1, "Title is required"),
          description: z.string().min(1, "Description is required"),
          referenceImages: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Merch request creation - placeholder for now
        return { success: true, requestId: Math.random() };
      }),

    getMyRequests: protectedProcedure.query(async ({ ctx }) => {
      // Return empty array for now - merch requests table may not exist
      return [];
    }),

    getMyOrders: protectedProcedure.query(async ({ ctx }) => {
      // Return empty array for now - merch orders table may not exist
      return [];
    }),
  }),

  collaboration: router({
    createProject: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1, "Title is required"),
          description: z.string().optional(),
          cause: z.string().min(1, "Cause is required"),
          imageUrl: z.string().optional(),
          coinRewardPerTask: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { createCollaborationProject } = await import("./db");
        return await createCollaborationProject(input.title, input.description || "", ctx.user.id);
      }),

    getProjects: publicProcedure
      .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        const { getCollaborationProjects } = await import("./db");
        return await getCollaborationProjects();
      }),

    getProject: publicProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        const { getCollaborationProject } = await import("./db");
        return await getCollaborationProject(input.projectId);
      }),

    getMyProjects: protectedProcedure.query(async ({ ctx }) => {
      const { getCollaborationProjects } = await import("./db");
      return await getCollaborationProjects();
    }),

    joinProject: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { addCollaborationMember } = await import("./db");
        return await addCollaborationMember(input.projectId, ctx.user.id, "member");
      }),

    createTask: protectedProcedure
      .input(
        z.object({
          projectId: z.number(),
          title: z.string().min(1),
          description: z.string().optional(),
          assignedTo: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { addCollaborationTask } = await import("./db");
        return await addCollaborationTask(input.projectId, input.title, input.description || "", input.assignedTo || 0);
      }),

    getTasks: publicProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        const { getCollaborationTasks } = await import("./db");
        return await getCollaborationTasks(input.projectId);
      }),

    completeTask: protectedProcedure
      .input(z.object({ taskId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { updateCollaborationTask } = await import("./db");
        return await updateCollaborationTask(input.taskId, { status: "completed" });
      }),

    getUpdates: publicProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        const { getCollaborationUpdates } = await import("./db");
        return await getCollaborationUpdates(input.projectId);
      }),

    addUpdate: protectedProcedure
      .input(
        z.object({
          projectId: z.number(),
          content: z.string().min(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { addCollaborationUpdate } = await import("./db");
        return await addCollaborationUpdate(input.projectId, ctx.user.id, input.content);
      }),
  }),

  admin: router({
    getMerchRequests: protectedProcedure
      .input(z.object({ status: z.enum(["pending", "approved", "in_progress", "completed", "rejected"]).optional() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const { getAllMerchRequests } = await import("./db");
        return await getAllMerchRequests();
      }),

    approveMerchRequest: protectedProcedure
      .input(z.object({ requestId: z.number(), estimatedPrice: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const { updateMerchRequestStatus } = await import("./db");
        return await updateMerchRequestStatus(input.requestId, "approved");
      }),

    rejectMerchRequest: protectedProcedure
      .input(z.object({ requestId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const { updateMerchRequestStatus } = await import("./db");
        return await updateMerchRequestStatus(input.requestId, "rejected");
      }),

    getAnalytics: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const { getAdminAnalytics } = await import("./db");
      return await getAdminAnalytics();
    }),
  }),

  music: musicRouter,
  sharing: sharingRouter,
  membership: membershipRouter,
  ownerSettings: router({
    getSettings: publicProcedure.query(async () => {
      const { getPlatformSettings } = await import("./db");
      return await getPlatformSettings();
    }),

    updateSettings: protectedProcedure
      .input(
        z.object({
          siteName: z.string().optional(),
          siteDescription: z.string().optional(),
          primaryColor: z.string().optional(),
          secondaryColor: z.string().optional(),
          accentColor: z.string().optional(),
          coinRewardPerAction: z.number().optional(),
          coinRewardPerGame: z.number().optional(),
          coinRewardPerTask: z.number().optional(),
          xpPerLevel: z.number().optional(),
          enableMerch: z.boolean().optional(),
          enableLounges: z.boolean().optional(),
          enableGames: z.boolean().optional(),
          enableCollaboration: z.boolean().optional(),
          enableKidsCorner: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const { updatePlatformSettings, logAuditAction } = await import("./db");
        const result = await updatePlatformSettings(input);
        await logAuditAction(ctx.user.id, "update_settings", JSON.stringify(input));
        return result;
      }),

    getAuditLog: protectedProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const { getAuditLog } = await import("./db");
        return await getAuditLog(input.limit);
      }),
  }),
});

export type AppRouter = typeof appRouter;
