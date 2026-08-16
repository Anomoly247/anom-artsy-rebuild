import { describe, expect, it } from "vitest";
import { and, asc, eq, inArray } from "drizzle-orm";
import {
  loungeMessageReactions,
  loungeMessages,
  loungeReadStates,
  lounges,
  loungeSoundscapes,
} from "../drizzle/schema";
import { appRouter } from "./routers";
import {
  getDb,
  getLoungeMessageReactions,
  getLoungeSoundscape,
  getLoungeUnreadCounts,
  markLoungeRead,
  toggleLoungeMessageReaction,
  updateLoungeSoundscape,
} from "./db";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "enhancement-test-user",
      email: "enhancement@example.com",
      name: "Enhancement Tester",
      loginMethod: "test",
      role: "user",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("lounge enhancement contracts", () => {
  it("returns stable empty results for empty reaction and unread inputs", async () => {
    await expect(getLoungeMessageReactions([])).resolves.toEqual([]);
    await expect(getLoungeUnreadCounts(1, [])).resolves.toEqual([]);
  });

  it("supports empty reaction queries through the protected tRPC contract", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.lounge.getMessageReactions({ messageIds: [] })).resolves.toEqual([]);
    await expect(caller.lounge.getUnreadCounts({ loungeIds: [] })).resolves.toEqual([]);
  });

  it("rejects empty emoji reactions before touching persistence", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.lounge.toggleReaction({ messageId: 1, emoji: "" })).rejects.toThrow();
  });

  it("persists and removes a message reaction through the toggle helper", async () => {
    const db = await getDb();
    if (!db) return;

    const loungeName = `enhancement_reaction_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    let loungeId: number | undefined;
    let messageId: number | undefined;

    try {
      await db.insert(lounges).values({ name: loungeName, type: "friends", ownerId: 1 });
      const lounge = (await db.select().from(lounges).where(eq(lounges.name, loungeName)).limit(1))[0];
      if (!lounge) throw new Error("Test lounge was not created");
      loungeId = lounge.id;

      await db.insert(loungeMessages).values({ loungeId, userId: 1, content: "Reaction test" });
      const message = (await db.select().from(loungeMessages).where(eq(loungeMessages.loungeId, loungeId)).orderBy(asc(loungeMessages.id)).limit(1))[0];
      if (!message) throw new Error("Test message was not created");
      messageId = message.id;

      await expect(toggleLoungeMessageReaction(messageId, 1, "✨")).resolves.toEqual({ active: true });
      await expect(getLoungeMessageReactions([messageId])).resolves.toMatchObject([
        { messageId, userId: 1, emoji: "✨" },
      ]);
      await expect(toggleLoungeMessageReaction(messageId, 1, "✨")).resolves.toEqual({ active: false });
      await expect(getLoungeMessageReactions([messageId])).resolves.toEqual([]);
    } finally {
      if (messageId) await db.delete(loungeMessageReactions).where(eq(loungeMessageReactions.messageId, messageId));
      if (messageId) await db.delete(loungeMessages).where(eq(loungeMessages.id, messageId));
      if (loungeId) await db.delete(lounges).where(eq(lounges.id, loungeId));
    }
  });

  it("reduces unread counts as a member marks messages read", async () => {
    const db = await getDb();
    if (!db) return;

    const loungeName = `enhancement_unread_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    let loungeId: number | undefined;
    const messageIds: number[] = [];

    try {
      await db.insert(lounges).values({ name: loungeName, type: "family", ownerId: 1 });
      const lounge = (await db.select().from(lounges).where(eq(lounges.name, loungeName)).limit(1))[0];
      if (!lounge) throw new Error("Test lounge was not created");
      loungeId = lounge.id;

      await db.insert(loungeMessages).values([
        { loungeId, userId: 1, content: "First unread" },
        { loungeId, userId: 1, content: "Second unread" },
      ]);
      const messages = await db.select().from(loungeMessages).where(eq(loungeMessages.loungeId, loungeId)).orderBy(asc(loungeMessages.id));
      messageIds.push(...messages.map((message) => message.id));

      await expect(getLoungeUnreadCounts(1, [loungeId])).resolves.toEqual([{ loungeId, unreadCount: 2 }]);
      await markLoungeRead(1, loungeId, messageIds[0]!);
      await expect(getLoungeUnreadCounts(1, [loungeId])).resolves.toEqual([{ loungeId, unreadCount: 1 }]);
      await markLoungeRead(1, loungeId, messageIds[1]!);
      await expect(getLoungeUnreadCounts(1, [loungeId])).resolves.toEqual([{ loungeId, unreadCount: 0 }]);
    } finally {
      if (loungeId) await db.delete(loungeReadStates).where(and(eq(loungeReadStates.loungeId, loungeId), eq(loungeReadStates.userId, 1)));
      if (messageIds.length) await db.delete(loungeMessages).where(inArray(loungeMessages.id, messageIds));
      if (loungeId) await db.delete(lounges).where(eq(lounges.id, loungeId));
    }
  });

  it("reads and updates the persisted lounge soundscape preference", async () => {
    const db = await getDb();
    if (!db) return;

    const loungeName = `enhancement_soundscape_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    let loungeId: number | undefined;

    try {
      await db.insert(lounges).values({ name: loungeName, type: "coworkers", ownerId: 1 });
      const lounge = (await db.select().from(lounges).where(eq(lounges.name, loungeName)).limit(1))[0];
      if (!lounge) throw new Error("Test lounge was not created");
      loungeId = lounge.id;

      await expect(getLoungeSoundscape(loungeId)).resolves.toMatchObject({ loungeId, soundscapeType: "cyber_rain", enabled: true });
      await expect(updateLoungeSoundscape(loungeId, { soundscapeType: "neon_lofi", volume: "0.35", enabled: false })).resolves.toMatchObject({
        loungeId,
        soundscapeType: "neon_lofi",
        volume: "0.35",
        enabled: false,
      });
    } finally {
      if (loungeId) await db.delete(loungeSoundscapes).where(eq(loungeSoundscapes.loungeId, loungeId));
      if (loungeId) await db.delete(lounges).where(eq(lounges.id, loungeId));
    }
  });
});
