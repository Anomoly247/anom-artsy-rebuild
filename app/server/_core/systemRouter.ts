import { z } from "zod";
import { notifyOwner } from "./notification";
import { adminProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),

  getStats: adminProcedure.query(async () => {
    const { getSystemStats } = await import("../db");
    return getSystemStats();
  }),

  getAllUsers: adminProcedure.query(async () => {
    const { getAllUsers } = await import("../db");
    return getAllUsers();
  }),

  updateUserRole: adminProcedure
    .input(z.object({ userId: z.number().int().positive(), role: z.enum(["user", "admin"]) }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.user.id && input.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "You cannot remove your own admin access." });
      }
      const { getUserById, updateUserRole, createAuditLog } = await import("../db");
      const targetUser = await getUserById(input.userId);
      if (!targetUser) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
      }
      const res = await updateUserRole(input.userId, input.role);
      await createAuditLog({
        userId: ctx.user.id,
        action: `update_user_role_${input.role}`,
        entityType: "user",
        entityId: input.userId,
        details: { targetEmail: targetUser.email, targetName: targetUser.name, previousRole: targetUser.role, newRole: input.role },
      });
      return res;
    }),

  updateUserStatus: adminProcedure
    .input(z.object({ userId: z.number().int().positive(), status: z.enum(["active", "suspended"]) }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.user.id && input.status === "suspended") {
        throw new TRPCError({ code: "FORBIDDEN", message: "You cannot suspend your own account." });
      }
      const { getUserById, updateUserStatus, createAuditLog } = await import("../db");
      const targetUser = await getUserById(input.userId);
      if (!targetUser) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
      }
      const res = await updateUserStatus(input.userId, input.status);
      await createAuditLog({
        userId: ctx.user.id,
        action: `update_user_status_${input.status}`,
        entityType: "user",
        entityId: input.userId,
        details: { targetEmail: targetUser.email, targetName: targetUser.name, previousStatus: targetUser.status, newStatus: input.status },
      });
      return res;
    }),

  bulkUpdateUserRole: adminProcedure
    .input(z.object({ userIds: z.array(z.number().int().positive()).min(1), role: z.enum(["user", "admin"]) }))
    .mutation(async ({ ctx, input }) => {
      if (input.userIds.includes(ctx.user.id) && input.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "You cannot remove your own admin access in a bulk action." });
      }
      const { getUserById, updateUserRole, createAuditLog } = await import("../db");
      const targetUsers = [];
      for (const id of input.userIds) {
        const targetUser = await getUserById(id);
        if (!targetUser) {
          throw new TRPCError({ code: "NOT_FOUND", message: `User ID ${id} not found.` });
        }
        targetUsers.push({ id: targetUser.id, name: targetUser.name, email: targetUser.email });
      }
      for (const id of input.userIds) {
        await updateUserRole(id, input.role);
      }
      await createAuditLog({
        userId: ctx.user.id,
        action: `bulk_update_user_role_${input.role}`,
        entityType: "user",
        details: { count: input.userIds.length, userIds: input.userIds, targets: targetUsers, newRole: input.role },
      });
      return { success: true, count: input.userIds.length } as const;
    }),

  bulkUpdateUserStatus: adminProcedure
    .input(z.object({ userIds: z.array(z.number().int().positive()).min(1), status: z.enum(["active", "suspended"]) }))
    .mutation(async ({ ctx, input }) => {
      if (input.userIds.includes(ctx.user.id) && input.status === "suspended") {
        throw new TRPCError({ code: "FORBIDDEN", message: "You cannot suspend your own account in a bulk action." });
      }
      const { getUserById, updateUserStatus, createAuditLog } = await import("../db");
      const targetUsers = [];
      for (const id of input.userIds) {
        const targetUser = await getUserById(id);
        if (!targetUser) {
          throw new TRPCError({ code: "NOT_FOUND", message: `User ID ${id} not found.` });
        }
        targetUsers.push({ id: targetUser.id, name: targetUser.name, email: targetUser.email });
      }
      for (const id of input.userIds) {
        await updateUserStatus(id, input.status);
      }
      await createAuditLog({
        userId: ctx.user.id,
        action: `bulk_update_user_status_${input.status}`,
        entityType: "user",
        details: { count: input.userIds.length, userIds: input.userIds, targets: targetUsers, newStatus: input.status },
      });
      return { success: true, count: input.userIds.length } as const;
    }),

  getAuditSummaryStats: adminProcedure.query(async () => {
    const { getAuditSummaryStats } = await import("../db");
    return getAuditSummaryStats();
  }),

  getAuditLogs: adminProcedure
    .input(
      z.object({
        adminId: z.number().int().optional(),
        adminQuery: z.string().optional(),
        actionType: z.string().optional(),
        targetUserQuery: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        limit: z.number().int().min(1).max(200).default(25),
        offset: z.number().int().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const { getFilteredAuditLogs } = await import("../db");
      const opts = input ?? { adminId: undefined, adminQuery: undefined, actionType: undefined, targetUserQuery: undefined, startDate: undefined, endDate: undefined, limit: 25, offset: 0 };
      const startDate = opts.startDate ? new Date(opts.startDate) : undefined;
      const endDate = opts.endDate ? new Date(opts.endDate) : undefined;
      return getFilteredAuditLogs({
        adminId: opts.adminId,
        adminQuery: opts.adminQuery,
        actionType: opts.actionType,
        targetUserQuery: opts.targetUserQuery,
        startDate: isNaN(startDate?.getTime() ?? 0) ? undefined : startDate,
        endDate: isNaN(endDate?.getTime() ?? 0) ? undefined : endDate,
        limit: opts.limit ?? 25,
        offset: opts.offset ?? 0,
      });
    }),

  exportAuditLogsCsv: adminProcedure
    .input(
      z.object({
        adminId: z.number().int().optional(),
        adminQuery: z.string().optional(),
        actionType: z.string().optional(),
        targetUserQuery: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }).optional()
    )
    .mutation(async ({ input }) => {
      const { getFilteredAuditLogs } = await import("../db");
      const opts = input ?? { adminId: undefined, adminQuery: undefined, actionType: undefined, targetUserQuery: undefined, startDate: undefined, endDate: undefined, limit: 25, offset: 0 };
      const startDate = opts.startDate ? new Date(opts.startDate) : undefined;
      const endDate = opts.endDate ? new Date(opts.endDate) : undefined;
      const { logs } = await getFilteredAuditLogs({
        adminId: opts.adminId,
        adminQuery: opts.adminQuery,
        actionType: opts.actionType,
        targetUserQuery: opts.targetUserQuery,
        startDate: isNaN(startDate?.getTime() ?? 0) ? undefined : startDate,
        endDate: isNaN(endDate?.getTime() ?? 0) ? undefined : endDate,
        limit: 1000,
        offset: 0,
      });

      const headers = ["Log ID", "Timestamp", "Admin ID", "Admin Name", "Admin Email", "Action", "Entity Type", "Entity ID", "Details"];
      const escapeCsv = (val: unknown) => {
        if (val === null || val === undefined) return '""';
        const str = typeof val === "object" ? JSON.stringify(val) : String(val);
        return `"${str.replace(/"/g, '""')}"`;
      };

      const csvRows = [headers.join(",")];
      for (const log of logs) {
        const row = [
          log.id,
          new Date(log.createdAt).toISOString(),
          log.userId ?? "",
          log.userName ?? "",
          log.userEmail ?? "",
          log.action,
          log.entityType,
          log.entityId ?? "",
          log.details ?? {},
        ];
        csvRows.push(row.map(escapeCsv).join(","));
      }

      return { csv: csvRows.join("\n"), count: logs.length };
    }),

  getEvents: adminProcedure.query(async () => {
    const { getCommunityEvents } = await import("../db");
    return getCommunityEvents();
  }),

  updateSettings: adminProcedure
    .input(
      z.object({
        siteName: z.string().optional(),
        siteDescription: z.string().optional(),
        maxCoinsPerDay: z.number().optional(),
        levelUpXP: z.number().optional(),
        achievementMultiplier: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { updatePlatformSettings } = await import("../db");
      const { maxCoinsPerDay: _maxCoinsPerDay, achievementMultiplier: _achievementMultiplier, levelUpXP, ...settings } = input;
      return updatePlatformSettings({ ...settings, ...(levelUpXP === undefined ? {} : { xpPerLevel: levelUpXP }) });
    }),

  createEvent: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        date: z.string().datetime(),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { createCommunityEvent } = await import("../db");
      return createCommunityEvent({ ...input, userId: ctx.user.id, date: new Date(input.date) });
    }),

  deleteEvent: adminProcedure
    .input(z.object({ eventId: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const { deleteCommunityEvent } = await import("../db");
      const result = await deleteCommunityEvent(input.eventId);
      if (!result) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      }
      return result;
    }),
});
