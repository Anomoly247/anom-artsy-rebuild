import { and, desc, eq, gt, gte, inArray, like, lte, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { InsertUser, users, userProfiles, decorationPackages, coinTransactions, achievements, userAchievements, lounges, loungeMembers, loungeMessages, loungeMessageReactions, loungeReadStates, loungeSoundscapes, kidsProgress, collaborationProjects, collaborationMembers, collaborationTasks, collaborationUpdates, platformSettings, InsertPlatformSettings, auditLog, vipTiers, userVipSubscriptions, vipBenefitsLog, tips, feedPosts, gameScores, socialGoodScores, socialGoodEvents, guardianReviews, userNotifications, userSouvenirBadges, seasonalChallenges, challengeParticipants } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _pool: mysql.Pool | null = null;

// Lazily create the drizzle instance using mysql2 pool
// This matches the connection method used in dbInit.ts for consistency
export async function getDb() {
  if (!_db && ENV.databaseUrl) {
    try {
      console.log("[Database] Initializing database connection...");
      // Create a pool (not a single connection) for better connection management
      _pool = mysql.createPool(ENV.databaseUrl);
      _db = drizzle(_pool) as unknown as ReturnType<typeof drizzle>;
      console.log("[Database] ✓ Database connection established");
    } catch (error) {
      console.error("[Database] Failed to connect:", error);
      _db = null;
      _pool = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user by ID: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrCreateUserProfile(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user profile: database not available");
    return undefined;
  }

  try {
    // Ensure table exists on the fly if missing in persistent DB
    try {
      await db.execute(sql`CREATE TABLE IF NOT EXISTS user_profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        bio TEXT,
        avatar_url TEXT,
        neon_theme VARCHAR(50) DEFAULT 'magenta',
        name_color VARCHAR(7) DEFAULT '#00eaff',
        decoration_package_ids JSON,
        level INT DEFAULT 1,
        xp INT DEFAULT 0,
        anom_coin_balance DECIMAL(10, 2) DEFAULT '0',
        membership_tier ENUM('basic', 'vip', 'super_vip') DEFAULT 'basic',
        tier_upgraded_at TIMESTAMP NULL,
        tier_expires_at TIMESTAMP NULL,
        coin_multiplier DECIMAL(3, 1) DEFAULT '1.0',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
      )`);
    } catch (tblErr) {
      console.warn("[Database] Could not auto-create user_profiles table:", tblErr);
    }

    const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);

    if (result.length > 0) {
      return result[0];
    }

    // Create new profile if it doesn't exist
    await db.insert(userProfiles).values({
      userId,
      level: 1,
      xp: 0,
      anomCoinBalance: "0",
      neonTheme: "magenta",
      decorationPackageIds: [],
    });

    const newProfile = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
    return newProfile.length > 0 ? newProfile[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get or create user profile:", error);
    throw error;
  }
}

export async function getDecorationPackages() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get decoration packages: database not available");
    return [];
  }

  try {
    return await db.select().from(decorationPackages);
  } catch (error) {
    console.error("[Database] Failed to get decoration packages:", error);
    throw error;
  }
}

export async function updateUserProfile(userId: number, updates: Partial<typeof userProfiles.$inferInsert>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update user profile: database not available");
    return undefined;
  }

  try {
    // Ensure profile exists before updating
    await getOrCreateUserProfile(userId);
    
    await db.update(userProfiles).set(updates).where(eq(userProfiles.userId, userId));
    const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to update user profile:", error);
    throw error;
  }
}

export async function getCoinBalance(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
    return result.length > 0 ? result[0].anomCoinBalance : undefined;
  } catch (error) {
    console.error("[Database] Failed to get coin balance:", error);
    throw error;
  }
}

export async function addCoinTransaction(userId: number, type: "earn" | "spend", amount: string, reason: string) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    // Ensure profile exists
    await getOrCreateUserProfile(userId);
    
    // Get current balance
    const profile = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
    if (!profile.length) return undefined;

    // MySQL DECIMAL values are returned as strings such as "0.00". The
    // economy currently awards whole Anom Coins, so normalize both the
    // stored balance and incoming reward before integer arithmetic.
    const currentValue = Number(profile[0].anomCoinBalance ?? "0");
    const amountValue = Number(amount);
    if (!Number.isFinite(currentValue) || !Number.isFinite(amountValue)) {
      throw new Error("Invalid Anom Coin balance or transaction amount");
    }
    const current = BigInt(Math.trunc(currentValue));
    const delta = BigInt(Math.trunc(Math.abs(amountValue)));
    const newBalance = type === "earn" ? current + delta : current - delta;
    const normalizedAmount = delta.toString();

    // Update profile balance
    await db.update(userProfiles).set({ anomCoinBalance: newBalance.toString() }).where(eq(userProfiles.userId, userId));

    // Record transaction using the normalized whole-coin amount
    await db.insert(coinTransactions).values({
      userId,
      type,
      amount: normalizedAmount,
      reason,
    });

    return { newBalance: newBalance.toString() };
  } catch (error) {
    console.error("[Database] Failed to add coin transaction:", error);
    throw error;
  }
}

export async function getCoinTransactionHistory(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(coinTransactions).where(eq(coinTransactions.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to get coin transaction history:", error);
    throw error;
  }
}

export async function getSocialGoodScore(userId: number) {
  const db = await getDb();
  if (!db) return { totalScore: 0 };

  const rows = await db.select().from(socialGoodScores).where(eq(socialGoodScores.userId, userId)).limit(1);
  if (rows.length > 0) return { totalScore: rows[0].totalScore };

  await db.insert(socialGoodScores).values({ userId, totalScore: 0 });
  return { totalScore: 0 };
}

export async function recordSocialGoodEvent(
  userId: number,
  input: { eventKey: string; eventType: string; points: number; sourceRoute: string; sourceRef?: string; status?: "pending" | "approved" | "rejected" },
) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  if (!Number.isInteger(input.points) || input.points <= 0) throw new Error("Social Good points must be a positive integer");

  const existing = await db.select().from(socialGoodEvents).where(eq(socialGoodEvents.eventKey, input.eventKey)).limit(1);
  if (existing.length > 0) {
    if (existing[0].userId !== userId) throw new Error("Social Good event key already belongs to another user");
    return { duplicate: true, event: existing[0], score: await getSocialGoodScore(userId) };
  }

  const status = input.status ?? "approved";
  const event = await db.insert(socialGoodEvents).values({
    userId,
    eventKey: input.eventKey,
    eventType: input.eventType,
    points: input.points,
    sourceRoute: input.sourceRoute,
    sourceRef: input.sourceRef,
    status,
  });

  if (status === "approved") {
    const score = await getSocialGoodScore(userId);
    await db.update(socialGoodScores)
      .set({ totalScore: score.totalScore + input.points })
      .where(eq(socialGoodScores.userId, userId));
  }

  return { duplicate: false, event, score: await getSocialGoodScore(userId) };
}

export async function getGuardianReviewQueue(status?: "pending" | "approved" | "rejected") {
  const db = await getDb();
  if (!db) return [];
  const filters = status ? eq(guardianReviews.status, status) : undefined;
  return db.select().from(guardianReviews).where(filters).orderBy(desc(guardianReviews.createdAt));
}

export async function upsertGuardianReview(input: {
  sourceRecordId: string;
  route?: string;
  status: "pending" | "approved" | "rejected";
  reviewerId: number;
  reviewerNote?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const existing = await db.select().from(guardianReviews).where(eq(guardianReviews.sourceRecordId, input.sourceRecordId)).limit(1);
  const reviewedAt = input.status === "pending" ? null : new Date();

  if (existing.length > 0) {
    await db.update(guardianReviews).set({
      route: input.route,
      status: input.status,
      reviewerId: input.reviewerId,
      reviewerNote: input.reviewerNote ?? null,
      reviewedAt,
    }).where(eq(guardianReviews.sourceRecordId, input.sourceRecordId));
  } else {
    await db.insert(guardianReviews).values({
      sourceRecordId: input.sourceRecordId,
      route: input.route,
      status: input.status,
      reviewerId: input.reviewerId,
      reviewerNote: input.reviewerNote ?? null,
      reviewedAt,
    });
  }

  return db.select().from(guardianReviews).where(eq(guardianReviews.sourceRecordId, input.sourceRecordId)).limit(1);
}

export async function addXP(userId: number, amount: number) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const profile = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
    if (!profile.length) return undefined;

    const newXP = (profile[0].xp || 0) + amount;
    const newLevel = Math.floor(newXP / 1000) + 1;

    await db.update(userProfiles).set({ xp: newXP, level: newLevel }).where(eq(userProfiles.userId, userId));

    return { xp: newXP, level: newLevel };
  } catch (error) {
    console.error("[Database] Failed to add XP:", error);
    throw error;
  }
}

export async function getAchievements() {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(achievements);
  } catch (error) {
    console.error("[Database] Failed to get achievements:", error);
    throw error;
  }
}

export async function getUserAchievements(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(userAchievements).where(eq(userAchievements.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to get user achievements:", error);
    throw error;
  }
}

export async function unlockAchievement(userId: number, achievementId: number) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    await db.insert(userAchievements).values({ userId, achievementId });
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to unlock achievement:", error);
    throw error;
  }
}

export async function createLounge(userId: number, name: string, description: string, loungeType: string) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    await db.insert(lounges).values({
      ownerId: userId,
      name,
      description,
      type: loungeType as "family" | "friends" | "coworkers",
      neonTheme: "magenta",
    });

    const created = await db
      .select()
      .from(lounges)
      .where(and(eq(lounges.ownerId, userId), eq(lounges.name, name)))
      .orderBy(desc(lounges.createdAt))
      .limit(1);
    return created[0];
  } catch (error) {
    console.error("[Database] Failed to create lounge:", error);
    throw error;
  }
}

export async function getUserLounges(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    try {
      await db.execute(sql`CREATE TABLE IF NOT EXISTS lounges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type ENUM('family', 'friends', 'coworkers') NOT NULL,
        owner_id INT NOT NULL,
        description TEXT,
        neon_theme VARCHAR(50) DEFAULT 'magenta',
        cost_anom DECIMAL(10, 2) DEFAULT '0',
        cost_real DECIMAL(10, 2) DEFAULT '0',
        is_public BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
      )`);
      await db.execute(sql`ALTER TABLE lounges ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true`);
    } catch (tblErr) {
      console.warn("[Database] Could not verify/auto-create lounges table:", tblErr);
    }

    try {
      await db.execute(sql`CREATE TABLE IF NOT EXISTS lounge_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        lounge_id INT NOT NULL,
        user_id INT NOT NULL,
        role ENUM('owner', 'admin', 'member') DEFAULT 'member' NOT NULL,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )`);
    } catch (memErr) {
      console.warn("[Database] Could not auto-create lounge_members table:", memErr);
    }

    return await db.select().from(lounges).where(eq(lounges.ownerId, userId));
  } catch (error) {
    console.error("[Database] Failed to get user lounges:", error);
    throw error;
  }
}

export async function getLounge(loungeId: number) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.select().from(lounges).where(eq(lounges.id, loungeId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get lounge:", error);
    throw error;
  }
}

export async function getLoungeMembersWithUsers(loungeId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select({
        id: loungeMembers.id,
        loungeId: loungeMembers.loungeId,
        userId: loungeMembers.userId,
        role: loungeMembers.role,
        joinedAt: loungeMembers.joinedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(loungeMembers)
      .leftJoin(users, eq(users.id, loungeMembers.userId))
      .where(eq(loungeMembers.loungeId, loungeId));
  } catch (error) {
    console.error("[Database] Failed to get lounge members:", error);
    throw error;
  }
}

export async function addLoungeMember(
  loungeId: number,
  userId: number,
  role: "owner" | "admin" | "member" = "member",
) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    await db.insert(loungeMembers).values({ loungeId, userId, role });
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to add lounge member:", error);
    throw error;
  }
}

export async function removeLoungeMember(loungeId: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    await db.delete(loungeMembers).where(and(eq(loungeMembers.loungeId, loungeId), eq(loungeMembers.userId, userId)));
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to remove lounge member:", error);
    throw error;
  }
}

export async function addLoungeMessage(loungeId: number, userId: number, content: string) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.insert(loungeMessages).values({ loungeId, userId, content });
    return result;
  } catch (error) {
    console.error("[Database] Failed to add lounge message:", error);
    throw error;
  }
}

export async function getLoungeMessages(loungeId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(loungeMessages).where(eq(loungeMessages.loungeId, loungeId)).limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get lounge messages:", error);
    throw error;
  }
}

export async function updateLounge(loungeId: number, updates: Partial<typeof lounges.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    await db.update(lounges).set(updates).where(eq(lounges.id, loungeId));
    const result = await db.select().from(lounges).where(eq(lounges.id, loungeId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to update lounge:", error);
    throw error;
  }
}

export async function getKidsContent() {
  const db = await getDb();
  if (!db) return [];

  try {
    // Return sample content for now
    return [];
  } catch (error) {
    console.error("[Database] Failed to get kids content:", error);
    throw error;
  }
}

export async function trackKidsProgress(userId: number, contentType: string, contentId: string) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.insert(kidsProgress).values({
      userId,
      contentType,
      contentId,
      completed: true,
      completedAt: new Date(),
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to track kids progress:", error);
    throw error;
  }
}

export async function getUserKidsProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(kidsProgress).where(eq(kidsProgress.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to get user kids progress:", error);
    throw error;
  }
}

export async function getPlatformSettings() {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.select().from(platformSettings).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get platform settings:", error);
    throw error;
  }
}

export async function updatePlatformSettings(updates: Partial<typeof platformSettings.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    // Get existing settings or create new ones
    const existing = await getPlatformSettings();
    
    if (existing) {
      await db.update(platformSettings).set(updates).where(eq(platformSettings.id, existing.id));
    } else {
      await db.insert(platformSettings).values(updates as any);
    }
    
    return await getPlatformSettings();
  } catch (error) {
    console.error("[Database] Failed to update platform settings:", error);
    throw error;
  }
}

export async function logAuditAction(userId: number, action: string, details: string) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.insert(auditLog).values({
      userId,
      action,
      entityType: "platform",
      details: { message: details },
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to log audit action:", error);
    throw error;
  }
}

export async function getAuditLog(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];

  try {
    const rows = await db.select().from(auditLog).limit(limit);
    return rows.map((row) => ({
      ...row,
      adminId: row.userId,
      targetType: row.entityType,
      targetId: row.entityId,
    }));
  } catch (error) {
    console.error("[Database] Failed to get audit log:", error);
    throw error;
  }
}

export async function getVipTiers() {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(vipTiers);
  } catch (error) {
    console.error("[Database] Failed to get VIP tiers:", error);
    throw error;
  }
}

export async function getUserVipSubscription(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.select().from(userVipSubscriptions).where(eq(userVipSubscriptions.userId, userId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get user VIP subscription:", error);
    throw error;
  }
}

export async function createVipSubscription(userId: number, tierId: number, expiresAt: Date) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.insert(userVipSubscriptions).values({ userId, tierId, renewalDate: expiresAt });
    return result;
  } catch (error) {
    console.error("[Database] Failed to create VIP subscription:", error);
    throw error;
  }
}

export async function logVipBenefit(userId: number, benefit: string, details: string) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.insert(vipBenefitsLog).values({
      userId,
      benefitType: benefit,
      description: details,
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to log VIP benefit:", error);
    throw error;
  }
}

export async function createCollaborationProject(name: string, description: string, ownerId: number) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.insert(collaborationProjects).values({
      title: name,
      description,
      creatorId: ownerId,
      cause: "community",
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to create collaboration project:", error);
    throw error;
  }
}

export async function getCollaborationProjects() {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(collaborationProjects);
  } catch (error) {
    console.warn("[Database] Collaboration projects table missing or query failed, returning fallback:", error);
    return [];
  }
}

export async function getCollaborationProject(projectId: number) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.select().from(collaborationProjects).where(eq(collaborationProjects.id, projectId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get collaboration project:", error);
    throw error;
  }
}

export async function addCollaborationMember(
  projectId: number,
  userId: number,
  role: "creator" | "member" = "member",
) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.insert(collaborationMembers).values({ projectId, userId, role });
    return result;
  } catch (error) {
    console.error("[Database] Failed to add collaboration member:", error);
    throw error;
  }
}

export async function getCollaborationMembers(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(collaborationMembers).where(eq(collaborationMembers.projectId, projectId));
  } catch (error) {
    console.error("[Database] Failed to get collaboration members:", error);
    throw error;
  }
}

export async function addCollaborationTask(projectId: number, title: string, description: string, assignedTo: number) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.insert(collaborationTasks).values({ projectId, title, description, assignedTo });
    return result;
  } catch (error) {
    console.error("[Database] Failed to add collaboration task:", error);
    throw error;
  }
}

export async function getCollaborationTasks(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(collaborationTasks).where(eq(collaborationTasks.projectId, projectId));
  } catch (error) {
    console.error("[Database] Failed to get collaboration tasks:", error);
    throw error;
  }
}

export async function updateCollaborationTask(taskId: number, updates: Partial<typeof collaborationTasks.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    await db.update(collaborationTasks).set(updates).where(eq(collaborationTasks.id, taskId));
    const result = await db.select().from(collaborationTasks).where(eq(collaborationTasks.id, taskId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to update collaboration task:", error);
    throw error;
  }
}

export async function addCollaborationUpdate(projectId: number, userId: number, content: string) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.insert(collaborationUpdates).values({
      projectId,
      userId,
      updateType: "comment",
      content,
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to add collaboration update:", error);
    throw error;
  }
}

export async function getCollaborationUpdates(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(collaborationUpdates).where(eq(collaborationUpdates.projectId, projectId));
  } catch (error) {
    console.error("[Database] Failed to get collaboration updates:", error);
    throw error;
  }
}


export async function updateMerchRequestStatus(requestId: number, status: string) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    // Assuming there's a merch_requests table
    // For now, return success
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to update merch request status:", error);
    throw error;
  }
}

export type AdminAnalytics = {
  totalUsers: number;
  activeUsers: number;
  totalCoins: string;
  totalTransactions: number;
  totalAchievements: number;
  totalLounges: number;
  totalMerchRequests: number;
  pendingMerchRequests: number;
};

const emptyAdminAnalytics: AdminAnalytics = {
  totalUsers: 0,
  activeUsers: 0,
  totalCoins: "0",
  totalTransactions: 0,
  totalAchievements: 0,
  totalLounges: 0,
  totalMerchRequests: 0,
  pendingMerchRequests: 0,
};

export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  const db = await getDb();
  if (!db) return emptyAdminAnalytics;

  try {
    return emptyAdminAnalytics;
  } catch (error) {
    console.error("[Database] Failed to get admin analytics:", error);
    throw error;
  }
}


export async function getAllMerchRequests() {
  const db = await getDb();
  if (!db) return [];

  try {
    // Return empty array for now - merch requests table may not exist
    return [];
  } catch (error) {
    console.error("[Database] Failed to get all merch requests:", error);
    throw error;
  }
}

export type AdminStats = {
  totalUsers: number;
  userGrowth: number;
  activeMembers: number;
  activeGrowth: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  coinsDistributed: string;
  coinsGrowth: number;
  totalLounges: number;
  totalOrders: number;
  achievementsUnlocked: number;
};

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      status: users.status,
      createdAt: users.createdAt,
      lastSignedIn: users.lastSignedIn,
    })
    .from(users)
    .orderBy(desc(users.createdAt));
}

export async function updateUserRole(userId: number, role: "user" | "admin") {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(users).set({ role }).where(eq(users.id, userId));
  return { success: true } as const;
}

export async function updateUserStatus(userId: number, status: "active" | "suspended") {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(users).set({ status }).where(eq(users.id, userId));
  return { success: true } as const;
}

async function safeRows<T>(query: PromiseLike<T[]>, label: string): Promise<T[]> {
  try {
    return await query;
  } catch (error) {
    console.warn(`[Database] Optional admin metric unavailable (${label})`, error);
    return [];
  }
}

export async function getSystemStats(): Promise<AdminStats> {
  const db = await getDb();
  if (!db) {
    return {
      totalUsers: 0,
      userGrowth: 0,
      activeMembers: 0,
      activeGrowth: 0,
      monthlyRevenue: 0,
      revenueGrowth: 0,
      coinsDistributed: "0",
      coinsGrowth: 0,
      totalLounges: 0,
      totalOrders: 0,
      achievementsUnlocked: 0,
    };
  }

  const [userRows, loungeRows, transactionRows, achievementRows] = await Promise.all([
    safeRows(db.select({ id: users.id }).from(users), "users"),
    safeRows(db.select({ id: lounges.id }).from(lounges), "lounges"),
    safeRows(db.select({ amount: coinTransactions.amount, type: coinTransactions.type }).from(coinTransactions), "coin_transactions"),
    safeRows(db.select({ id: userAchievements.id }).from(userAchievements), "user_achievements"),
  ]);

  const coinsDistributed = transactionRows
    .filter((transaction) => transaction.type === "earn")
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);

  return {
    totalUsers: userRows.length,
    userGrowth: 0,
    activeMembers: userRows.length,
    activeGrowth: 0,
    monthlyRevenue: 0,
    revenueGrowth: 0,
    coinsDistributed: coinsDistributed.toFixed(2),
    coinsGrowth: 0,
    totalLounges: loungeRows.length,
    totalOrders: 0,
    achievementsUnlocked: achievementRows.length,
  };
}

export type CommunityEvent = {
  id: number;
  title: string;
  description: string;
  date: Date;
  imageUrl: string | null;
};

export async function getCommunityEvents(): Promise<CommunityEvent[]> {
  const db = await getDb();
  if (!db) return [];

  let rows;
  try {
    rows = await db
      .select()
      .from(auditLog)
      .where(eq(auditLog.entityType, "event"))
      .orderBy(desc(auditLog.createdAt));
  } catch (error) {
    console.warn("[Database] Optional admin events unavailable", error);
    return [];
  }

  return rows.map((row) => {
    const details = row.details ?? {};
    return {
      id: row.id,
      title: typeof details.title === "string" ? details.title : row.action,
      description: typeof details.description === "string" ? details.description : "",
      date: details.date instanceof Date ? details.date : new Date(typeof details.date === "string" ? details.date : row.createdAt),
      imageUrl: typeof details.imageUrl === "string" ? details.imageUrl : null,
    };
  });
}

export async function createCommunityEvent(input: {
  userId: number;
  title: string;
  description: string;
  date: Date;
  imageUrl?: string;
}) {
  const db = await getDb();
  if (!db) return undefined;

  const details = {
    title: input.title,
    description: input.description,
    date: input.date.toISOString(),
    imageUrl: input.imageUrl ?? null,
  };

  const result = await db.insert(auditLog).values({
    userId: input.userId,
    action: "community_event",
    entityType: "event",
    details,
  });

  return result;
}

export async function deleteCommunityEvent(eventId: number) {
  const db = await getDb();
  if (!db) return undefined;

  await db.delete(auditLog).where(and(eq(auditLog.id, eventId), eq(auditLog.entityType, "event")));
  return { success: true } as const;
}

export async function createTip(
  userId: number,
  amount: number,
  message?: string,
  tipType: "one_time" | "recurring" = "one_time",
) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(tips).values({
    userId,
    amount: amount.toFixed(2),
    message,
    tipType,
  });
  return result;
}

export async function getUserTips(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(tips).where(eq(tips.userId, userId)).orderBy(desc(tips.createdAt));
}

export async function createAuditLog(entry: {
  userId?: number;
  action: string;
  entityType: string;
  entityId?: number;
  details?: Record<string, unknown>;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot record audit log: database unavailable");
    return;
  }
  try {
    await db.insert(auditLog).values({
      userId: entry.userId ?? null,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId ?? null,
      details: entry.details ?? null,
    });
  } catch (error) {
    console.error("[Database] Failed to record audit log:", error);
  }
}

function normalizeAuditDetails<T extends { details: unknown }>(entry: T): T {
  if (typeof entry.details !== "string") return entry;
  try {
    return { ...entry, details: JSON.parse(entry.details) };
  } catch {
    return entry;
  }
}

export async function getAuditLogs(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  try {
    const rows = await db
      .select({
        id: auditLog.id,
        userId: auditLog.userId,
        action: auditLog.action,
        entityType: auditLog.entityType,
        entityId: auditLog.entityId,
        details: auditLog.details,
        createdAt: auditLog.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(auditLog)
      .leftJoin(users, eq(auditLog.userId, users.id))
      .orderBy(desc(auditLog.createdAt))
      .limit(limit);

    return rows.map(normalizeAuditDetails);
  } catch (error) {
    console.warn("[Database] Audit log table unavailable or query failed:", error);
    return [];
  }
}

export type AuditLogFilterOptions = {
  adminId?: number;
  adminQuery?: string;
  actionType?: string;
  targetUserQuery?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
};

export async function getFilteredAuditLogs(options: AuditLogFilterOptions = {}) {
  const db = await getDb();
  if (!db) return { logs: [], total: 0 };

  const limit = options.limit ?? 25;
  const offset = options.offset ?? 0;

  try {
    const conditions = [];
    conditions.push(sql`${auditLog.entityType} != 'event'`);

    if (options.adminId !== undefined && options.adminId > 0) {
      conditions.push(eq(auditLog.userId, options.adminId));
    }
    if (options.adminQuery && options.adminQuery.trim() !== '') {
      const q = `%${options.adminQuery.trim()}%`;
      conditions.push(or(
        like(users.name, q),
        like(users.email, q),
        sql`cast(${users.id} as char) like ${q}`,
      ));
    }
    if (options.actionType && options.actionType !== 'all') {
      conditions.push(eq(auditLog.action, options.actionType));
    }
    if (options.startDate) {
      conditions.push(gte(auditLog.createdAt, options.startDate));
    }
    if (options.endDate) {
      conditions.push(lte(auditLog.createdAt, options.endDate));
    }
    if (options.targetUserQuery && options.targetUserQuery.trim() !== '') {
      const q = `%${options.targetUserQuery.trim()}%`;
      conditions.push(
        sql`(
          cast(${auditLog.entityId} as char) like ${q} or
          json_unquote(json_extract(${auditLog.details}, '$.targetEmail')) like ${q} or
          json_unquote(json_extract(${auditLog.details}, '$.targetName')) like ${q} or
          json_search(${auditLog.details}, 'one', ${q}) is not null
        )`
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [countRows] = await db
      .select({ count: sql<number>`count(*)` })
      .from(auditLog)
      .leftJoin(users, eq(auditLog.userId, users.id))
      .where(whereClause);

    const total = Number(countRows?.count ?? 0);

    const rows = await db
      .select({
        id: auditLog.id,
        userId: auditLog.userId,
        action: auditLog.action,
        entityType: auditLog.entityType,
        entityId: auditLog.entityId,
        details: auditLog.details,
        createdAt: auditLog.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(auditLog)
      .leftJoin(users, eq(auditLog.userId, users.id))
      .where(whereClause)
      .orderBy(desc(auditLog.createdAt))
      .limit(limit)
      .offset(offset);

    return { logs: rows.map(normalizeAuditDetails), total };
  } catch (error) {
    console.warn("[Database] Filtered audit log query failed:", error);
    return { logs: [], total: 0 };
  }
}

export async function getAuditSummaryStats() {
  const db = await getDb();
  if (!db) return { totalActions: 0, roleChanges: 0, suspensions: 0, bulkOperations: 0, recentTimeline: [] };

  try {
    const [totalRow] = await db.select({ count: sql<number>`count(*)` }).from(auditLog).where(sql`${auditLog.entityType} != 'event'`);
    const [roleRow] = await db.select({ count: sql<number>`count(*)` }).from(auditLog).where(sql`${auditLog.action} like '%role%'`);
    const [suspensionRow] = await db.select({ count: sql<number>`count(*)` }).from(auditLog).where(sql`${auditLog.action} like '%status%'`);
    const [bulkRow] = await db.select({ count: sql<number>`count(*)` }).from(auditLog).where(sql`${auditLog.action} like '%bulk%'`);

    const recentLogs = await db
      .select({
        action: auditLog.action,
        createdAt: auditLog.createdAt,
      })
      .from(auditLog)
      .where(sql`${auditLog.entityType} != 'event'`)
      .orderBy(desc(auditLog.createdAt))
      .limit(50);

    return {
      totalActions: Number(totalRow?.count ?? 0),
      roleChanges: Number(roleRow?.count ?? 0),
      suspensions: Number(suspensionRow?.count ?? 0),
      bulkOperations: Number(bulkRow?.count ?? 0),
      recentTimeline: recentLogs,
    };
  } catch (error) {
    console.warn("[Database] Audit summary stats query failed:", error);
    return { totalActions: 0, roleChanges: 0, suspensions: 0, bulkOperations: 0, recentTimeline: [] };
  }
}

export async function getLoungeMessageReactions(messageIds: number[]) {
  const db = await getDb();
  if (!db || messageIds.length === 0) return [];

  try {
    return await db
      .select()
      .from(loungeMessageReactions)
      .where(inArray(loungeMessageReactions.messageId, messageIds));
  } catch (error) {
    console.error("[Database] Failed to get lounge message reactions:", error);
    throw error;
  }
}

export async function toggleLoungeMessageReaction(messageId: number, userId: number, emoji: string) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const existing = await db
      .select()
      .from(loungeMessageReactions)
      .where(
        and(
          eq(loungeMessageReactions.messageId, messageId),
          eq(loungeMessageReactions.userId, userId),
          eq(loungeMessageReactions.emoji, emoji),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      await db.delete(loungeMessageReactions).where(eq(loungeMessageReactions.id, existing[0].id));
      return { active: false };
    }

    await db.insert(loungeMessageReactions).values({ messageId, userId, emoji });
    return { active: true };
  } catch (error) {
    console.error("[Database] Failed to toggle lounge message reaction:", error);
    throw error;
  }
}

export async function getLoungeUnreadCounts(userId: number, loungeIds: number[]) {
  const db = await getDb();
  if (!db || loungeIds.length === 0) return [];

  try {
    const readStates = await db
      .select()
      .from(loungeReadStates)
      .where(
        and(
          eq(loungeReadStates.userId, userId),
          inArray(loungeReadStates.loungeId, loungeIds),
        ),
      );
    const lastReadByLounge = new Map(readStates.map((state) => [state.loungeId, state.lastReadMessageId || 0]));

    const counts = await Promise.all(
      loungeIds.map(async (loungeId) => {
        const result = await db
          .select({ count: sql<number>`count(*)` })
          .from(loungeMessages)
          .where(
            and(
              eq(loungeMessages.loungeId, loungeId),
              gt(loungeMessages.id, lastReadByLounge.get(loungeId) || 0),
            ),
          );
        return { loungeId, unreadCount: Number(result[0]?.count || 0) };
      }),
    );

    return counts;
  } catch (error) {
    console.error("[Database] Failed to get lounge unread counts:", error);
    throw error;
  }
}

export async function markLoungeRead(userId: number, loungeId: number, lastReadMessageId: number) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const existing = await db
      .select()
      .from(loungeReadStates)
      .where(
        and(
          eq(loungeReadStates.userId, userId),
          eq(loungeReadStates.loungeId, loungeId),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(loungeReadStates)
        .set({ lastReadMessageId: Math.max(existing[0].lastReadMessageId || 0, lastReadMessageId) })
        .where(eq(loungeReadStates.id, existing[0].id));
    } else {
      await db.insert(loungeReadStates).values({ userId, loungeId, lastReadMessageId });
    }

    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to mark lounge as read:", error);
    throw error;
  }
}

export async function getLoungeSoundscape(loungeId: number) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db
      .select()
      .from(loungeSoundscapes)
      .where(eq(loungeSoundscapes.loungeId, loungeId))
      .limit(1);

    return result[0] || {
      loungeId,
      soundscapeType: "cyber_rain",
      volume: "0.50",
      enabled: true,
    };
  } catch (error) {
    console.error("[Database] Failed to get lounge soundscape:", error);
    throw error;
  }
}

export async function updateLoungeSoundscape(
  loungeId: number,
  updates: { soundscapeType?: string; volume?: string; enabled?: boolean },
) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const existing = await db
      .select()
      .from(loungeSoundscapes)
      .where(eq(loungeSoundscapes.loungeId, loungeId))
      .limit(1);

    if (existing.length > 0) {
      await db.update(loungeSoundscapes).set(updates).where(eq(loungeSoundscapes.id, existing[0].id));
    } else {
      await db.insert(loungeSoundscapes).values({
        loungeId,
        soundscapeType: updates.soundscapeType || "cyber_rain",
        volume: updates.volume || "0.50",
        enabled: updates.enabled ?? true,
      });
    }

    return await getLoungeSoundscape(loungeId);
  } catch (error) {
    console.error("[Database] Failed to update lounge soundscape:", error);
    throw error;
  }
}

export async function getLiveActivityFeed(limit = 10) {
  const db = await getDb();
  if (!db) return [];

  try {
    const [posts, scores, events] = await Promise.all([
      safeRows(db.select().from(feedPosts).orderBy(desc(feedPosts.createdAt)).limit(limit), "feed_posts"),
      safeRows(db.select().from(gameScores).orderBy(desc(gameScores.createdAt)).limit(limit), "game_scores"),
      safeRows(db.select().from(auditLog).where(eq(auditLog.entityType, "event")).orderBy(desc(auditLog.createdAt)).limit(limit), "audit_events"),
    ]);

    const items = [
      ...posts.map((p) => ({
        id: `post-${p.id}`,
        title: p.title || "Community Update",
        description: p.content || "",
        category: p.postType,
        createdAt: p.createdAt,
      })),
      ...scores.map((s) => ({
        id: `score-${s.id}`,
        title: `High Score in ${s.gameName}`,
        description: `Scored ${s.score} points and earned ${s.coinReward} Glow Points!`,
        category: "achievement",
        createdAt: s.createdAt,
      })),
      ...events.map((e) => {
        const details = (e.details ?? {}) as Record<string, unknown>;
        return {
          id: `event-${e.id}`,
          title: typeof details.title === "string" ? details.title : e.action,
          description: typeof details.description === "string" ? details.description : "New universe announcement.",
          category: "update",
          createdAt: e.createdAt,
        };
      }),
    ];

    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return items.slice(0, limit);
  } catch (error) {
    console.warn("[Database] Failed to fetch live activity feed:", error);
    return [];
  }
}

export async function recordGameScore(userId: number, gameName: string, score: number, coinReward: string) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.insert(gameScores).values({
      userId,
      gameName,
      score,
      coinReward,
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to record game score:", error);
    throw error;
  }
}

export async function getGameScoresHistory(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(gameScores)
      .where(eq(gameScores.userId, userId))
      .orderBy(desc(gameScores.createdAt));
  } catch (error) {
    console.warn("[Database] Failed to get user game score history:", error);
    return [];
  }
}

export async function getGlobalLeaderboard(limit = 10) {
  const db = await getDb();
  if (!db) return [];

  try {
    const rows = await db
      .select({
        userId: gameScores.userId,
        userName: users.name,
        topScore: sql<number>`max(${gameScores.score})`,
        totalGames: sql<number>`count(*)`,
      })
      .from(gameScores)
      .leftJoin(users, eq(gameScores.userId, users.id))
      .groupBy(gameScores.userId, users.name)
      .orderBy(desc(sql`max(${gameScores.score})`))
      .limit(limit);

    return rows;
  } catch (error) {
    console.warn("[Database] Failed to get global leaderboard:", error);
    return [];
  }
}

export async function mintSouvenirBadge(userId: number, badgeKey: string, badgeTitle: string, realmName = "Moonberry Farm", imageUrl?: string) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const existing = await db
      .select()
      .from(userSouvenirBadges)
      .where(and(eq(userSouvenirBadges.userId, userId), eq(userSouvenirBadges.badgeKey, badgeKey)))
      .limit(1);

    if (existing.length > 0) {
      return { success: true, badge: existing[0], alreadyOwned: true };
    }

    await db.insert(userSouvenirBadges).values({
      userId,
      badgeKey,
      badgeTitle,
      realmName,
      imageUrl: imageUrl || null,
    });

    await db.insert(userNotifications).values({
      userId,
      title: `Souvenir Badge Unlocked: ${badgeTitle}!`,
      message: `You successfully minted the ${badgeTitle} souvenir badge in ${realmName}.`,
      type: "badge",
    });

    const newlyMinted = await db
      .select()
      .from(userSouvenirBadges)
      .where(and(eq(userSouvenirBadges.userId, userId), eq(userSouvenirBadges.badgeKey, badgeKey)))
      .limit(1);

    return { success: true, badge: newlyMinted[0], alreadyOwned: false };
  } catch (error) {
    console.error("[Database] Failed to mint souvenir badge:", error);
    throw error;
  }
}

export async function getUserSouvenirBadges(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(userSouvenirBadges)
      .where(eq(userSouvenirBadges.userId, userId))
      .orderBy(desc(userSouvenirBadges.earnedAt));
  } catch (error) {
    console.warn("[Database] Failed to get user souvenir badges:", error);
    return [];
  }
}

export async function getUserNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(userNotifications)
      .where(eq(userNotifications.userId, userId))
      .orderBy(desc(userNotifications.createdAt))
      .limit(50);
  } catch (error) {
    console.warn("[Database] Failed to get user notifications:", error);
    return [];
  }
}

export async function markNotificationRead(notificationId: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    await db
      .update(userNotifications)
      .set({ isRead: true })
      .where(and(eq(userNotifications.id, notificationId), eq(userNotifications.userId, userId)));
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to mark notification as read:", error);
    throw error;
  }
}

export async function createUserNotification(userId: number, title: string, message: string, type: "achievement" | "event" | "badge" | "system" = "system") {
  const db = await getDb();
  if (!db) return undefined;

  try {
    await db.insert(userNotifications).values({
      userId,
      title,
      message,
      type,
    });
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to create notification:", error);
    throw error;
  }
}

export async function getActiveSeasonalChallenges() {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(seasonalChallenges)
      .where(eq(seasonalChallenges.isActive, true))
      .orderBy(desc(seasonalChallenges.createdAt));
  } catch (error) {
    console.warn("[Database] Failed to fetch seasonal challenges:", error);
    return [];
  }
}

export async function getChallengeLeaderboard(challengeId: number, limit = 10) {
  const db = await getDb();
  if (!db) return [];

  try {
    const rows = await db
      .select({
        userId: challengeParticipants.userId,
        userName: users.name,
        progressScore: challengeParticipants.progressScore,
        completed: challengeParticipants.completed,
      })
      .from(challengeParticipants)
      .leftJoin(users, eq(challengeParticipants.userId, users.id))
      .where(eq(challengeParticipants.challengeId, challengeId))
      .orderBy(desc(challengeParticipants.progressScore))
      .limit(limit);

    return rows;
  } catch (error) {
    console.warn("[Database] Failed to get challenge leaderboard:", error);
    return [];
  }
}
