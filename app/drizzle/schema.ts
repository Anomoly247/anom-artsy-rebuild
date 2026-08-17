import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with Anom Artsy profile and economy fields.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  status: mysqlEnum("status", ["active", "suspended"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User Profiles — stores Anom Artsy-specific profile data
 */
export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  neonTheme: varchar("neon_theme", { length: 50 }).default("magenta"),
  nameColor: varchar("name_color", { length: 7 }).default("#00eaff"), // hex color for VIP name display
  decorationPackageIds: json("decoration_package_ids").$type<number[]>(),
  level: int("level").default(1),
  xp: int("xp").default(0),
  anomCoinBalance: decimal("anom_coin_balance", { precision: 10, scale: 2 }).default("0"),
  membershipTier: mysqlEnum("membership_tier", ["basic", "vip", "super_vip"]).default("basic"),
  tierUpgradedAt: timestamp("tier_upgraded_at"),
  tierExpiresAt: timestamp("tier_expires_at"),
  coinMultiplier: decimal("coin_multiplier", { precision: 3, scale: 1 }).default("1.0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

/**
 * Decoration Packages — pre-built neon themes, character badges, mood glows
 */
export const decorationPackages = mysqlTable("decoration_packages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull(), // "character_badge", "mood_glow", "neon_theme"
  imageUrl: text("image_url"),
  costAnom: decimal("cost_anom", { precision: 10, scale: 2 }).default("0"),
  costReal: decimal("cost_real", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type DecorationPackage = typeof decorationPackages.$inferSelect;
export type InsertDecorationPackage = typeof decorationPackages.$inferInsert;

/**
 * Store Catalog — approved backgrounds, glow treatments, decorations, and digital items.
 * Catalog approval is separate from payment and entitlement state.
 */
export const storeCatalogItems = mysqlTable("store_catalog_items", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", ["background", "glow", "decoration", "digital", "membership"]).notNull(),
  imageUrl: text("image_url"),
  previewClass: varchar("preview_class", { length: 120 }),
  priceAnom: decimal("price_anom", { precision: 10, scale: 2 }).default("0").notNull(),
  priceReal: decimal("price_real", { precision: 10, scale: 2 }).default("0").notNull(),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  guardianStatus: mysqlEnum("guardian_status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  sourceRecordId: varchar("source_record_id", { length: 160 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type StoreCatalogItem = typeof storeCatalogItems.$inferSelect;
export type InsertStoreCatalogItem = typeof storeCatalogItems.$inferInsert;

/** Membership plans define access privileges; they do not replace Coin or Social Good. */
export const membershipPlans = mysqlTable("membership_plans", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  priceAnom: decimal("price_anom", { precision: 10, scale: 2 }).default("0").notNull(),
  priceReal: decimal("price_real", { precision: 10, scale: 2 }).default("0").notNull(),
  storageLimit: int("storage_limit").default(0).notNull(),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type MembershipPlan = typeof membershipPlans.$inferSelect;
export type InsertMembershipPlan = typeof membershipPlans.$inferInsert;

/** Server-confirmed user access to a catalog item. */
export const userEntitlements = mysqlTable("user_entitlements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  catalogItemId: int("catalog_item_id").notNull(),
  grantSource: mysqlEnum("grant_source", ["coin", "purchase", "membership", "admin"]).notNull(),
  status: mysqlEnum("status", ["active", "revoked", "expired"]).default("active").notNull(),
  grantedAt: timestamp("granted_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  sourceRef: varchar("source_ref", { length: 160 }),
});

export type UserEntitlement = typeof userEntitlements.$inferSelect;
export type InsertUserEntitlement = typeof userEntitlements.$inferInsert;

/** Current or historical membership access for a user. */
export const userMemberships = mysqlTable("user_memberships", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  planId: int("plan_id").notNull(),
  status: mysqlEnum("status", ["active", "cancelled", "expired"]).default("active").notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  sourceRef: varchar("source_ref", { length: 160 }),
});

export type UserMembership = typeof userMemberships.$inferSelect;
export type InsertUserMembership = typeof userMemberships.$inferInsert;

/**
 * Anom Coin Transactions — track all coin earning and spending
 */
export const coinTransactions = mysqlTable("coin_transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: mysqlEnum("type", ["earn", "spend"]).notNull(),
  reason: varchar("reason", { length: 100 }).notNull(), // "game_completion", "lesson_finish", "package_purchase", etc.
  relatedId: int("related_id"), // ID of related entity (game score, achievement, etc.)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CoinTransaction = typeof coinTransactions.$inferSelect;
export type InsertCoinTransaction = typeof coinTransactions.$inferInsert;

/**
 * Achievements — visual badges earned for positive engagement
 */
export const achievements = mysqlTable("achievements", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  iconUrl: text("icon_url"),
  category: varchar("category", { length: 50 }).notNull(), // "social_good", "game", "family", "community"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;

/**
 * User Achievements — tracks which achievements a user has earned
 */
export const userAchievements = mysqlTable("user_achievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  achievementId: int("achievement_id").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;

/**
 * Lounges — private social spaces for Family, Friends, Coworkers
 */
export const lounges = mysqlTable("lounges", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  type: mysqlEnum("type", ["family", "friends", "coworkers"]).notNull(),
  ownerId: int("owner_id").notNull(),
  description: text("description"),
  neonTheme: varchar("neon_theme", { length: 50 }).default("magenta"),
  costAnom: decimal("cost_anom", { precision: 10, scale: 2 }).default("0"),
  costReal: decimal("cost_real", { precision: 10, scale: 2 }).default("0"),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Lounge = typeof lounges.$inferSelect;
export type InsertLounge = typeof lounges.$inferInsert;

/**
 * Lounge Members — tracks membership and access
 */
export const loungeMembers = mysqlTable("lounge_members", {
  id: int("id").autoincrement().primaryKey(),
  loungeId: int("lounge_id").notNull(),
  userId: int("user_id").notNull(),
  role: mysqlEnum("role", ["owner", "admin", "member"]).default("member"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export type LoungeMember = typeof loungeMembers.$inferSelect;
export type InsertLoungeMember = typeof loungeMembers.$inferInsert;

/**
 * Lounge Messages — chat history within lounges
 */
export const loungeMessages = mysqlTable("lounge_messages", {
  id: int("id").autoincrement().primaryKey(),
  loungeId: int("lounge_id").notNull(),
  userId: int("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type LoungeMessage = typeof loungeMessages.$inferSelect;
export type InsertLoungeMessage = typeof loungeMessages.$inferInsert;

/**
 * Merch Requests — customer custom art requests
 */
export const merchRequests = mysqlTable("merch_requests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description").notNull(),
  referenceImages: json("reference_images").$type<string[]>(),
  status: mysqlEnum("status", ["pending", "approved", "in_progress", "completed", "rejected"]).default("pending"),
  estimatedPrice: decimal("estimated_price", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type MerchRequest = typeof merchRequests.$inferSelect;
export type InsertMerchRequest = typeof merchRequests.$inferInsert;

/**
 * Merch Orders — completed purchases
 */
export const merchOrders = mysqlTable("merch_orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  requestId: int("request_id"),
  productName: varchar("product_name", { length: 100 }).notNull(),
  quantity: int("quantity").default(1),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: mysqlEnum("payment_status", ["pending", "paid", "failed"]).default("pending"),
  fulfillmentStatus: mysqlEnum("fulfillment_status", ["pending", "created", "shipped", "delivered"]).default("pending"),
  printfulOrderId: varchar("printful_order_id", { length: 100 }),
  trackingUrl: text("tracking_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type MerchOrder = typeof merchOrders.$inferSelect;
export type InsertMerchOrder = typeof merchOrders.$inferInsert;

/**
 * Game Scores — tracks mini-game performance
 */
export const gameScores = mysqlTable("game_scores", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  gameName: varchar("game_name", { length: 50 }).notNull(), // "trivia", "memory", "mood_matcher", "snack_vault"
  score: int("score").notNull(),
  coinReward: decimal("coin_reward", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type GameScore = typeof gameScores.$inferSelect;
export type InsertGameScore = typeof gameScores.$inferInsert;

/**
 * Social Good Scores — one persisted impact score per user.
 */
export const socialGoodScores = mysqlTable("social_good_scores", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  totalScore: int("total_score").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type SocialGoodScore = typeof socialGoodScores.$inferSelect;
export type InsertSocialGoodScore = typeof socialGoodScores.$inferInsert;

/**
 * Social Good Events — auditable, moderation-aware score changes.
 */
export const socialGoodEvents = mysqlTable("social_good_events", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  eventKey: varchar("event_key", { length: 160 }).notNull().unique(),
  eventType: varchar("event_type", { length: 80 }).notNull(),
  points: int("points").notNull(),
  sourceRoute: varchar("source_route", { length: 120 }).notNull(),
  sourceRef: varchar("source_ref", { length: 160 }),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("approved").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SocialGoodEvent = typeof socialGoodEvents.$inferSelect;
export type InsertSocialGoodEvent = typeof socialGoodEvents.$inferInsert;

/**
 * Guardian review queue for authored content and media provenance.
 * This workflow is separate from both Anom Coin and Social Good scoring.
 */
export const guardianReviews = mysqlTable("guardian_reviews", {
  id: int("id").autoincrement().primaryKey(),
  sourceRecordId: varchar("source_record_id", { length: 160 }).notNull().unique(),
  route: varchar("route", { length: 120 }),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  reviewerId: int("reviewer_id"),
  reviewerNote: text("reviewer_note"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type GuardianReview = typeof guardianReviews.$inferSelect;
export type InsertGuardianReview = typeof guardianReviews.$inferInsert;

/**
 * Social Feed Posts — community content (memes, highlights, updates)
 */
export const feedPosts = mysqlTable("feed_posts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id"),
  postType: mysqlEnum("post_type", ["meme", "highlight", "update", "achievement"]).notNull(),
  title: varchar("title", { length: 100 }),
  content: text("content"),
  imageUrl: text("image_url"),
  likes: int("likes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type FeedPost = typeof feedPosts.$inferSelect;
export type InsertFeedPost = typeof feedPosts.$inferInsert;

/**
 * Kids Corner Progress — tracks lessons, videos watched, game completions
 */
export const kidsProgress = mysqlTable("kids_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  contentType: varchar("content_type", { length: 50 }).notNull(), // "video", "lesson", "game", "coloring"
  contentId: varchar("content_id", { length: 100 }).notNull(),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type KidsProgress = typeof kidsProgress.$inferSelect;
export type InsertKidsProgress = typeof kidsProgress.$inferInsert;

/**
 * Collaboration Projects — social good initiatives created by users
 */
export const collaborationProjects = mysqlTable("collaboration_projects", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: int("creator_id").notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description"),
  cause: varchar("cause", { length: 50 }).notNull(), // "environment", "education", "health", "community", "technology"
  imageUrl: text("image_url"),
  status: mysqlEnum("status", ["active", "completed", "paused"]).default("active").notNull(),
  targetMembers: int("target_members").default(1),
  currentMembers: int("current_members").default(1),
  coinRewardPerTask: decimal("coin_reward_per_task", { precision: 10, scale: 2 }).default("10"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type CollaborationProject = typeof collaborationProjects.$inferSelect;
export type InsertCollaborationProject = typeof collaborationProjects.$inferInsert;

/**
 * Collaboration Project Members — tracks members and their contributions
 */
export const collaborationMembers = mysqlTable("collaboration_members", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("project_id").notNull(),
  userId: int("user_id").notNull(),
  role: mysqlEnum("role", ["creator", "member"]).default("member").notNull(),
  tasksCompleted: int("tasks_completed").default(0),
  coinsEarned: decimal("coins_earned", { precision: 10, scale: 2 }).default("0"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export type CollaborationMember = typeof collaborationMembers.$inferSelect;
export type InsertCollaborationMember = typeof collaborationMembers.$inferInsert;

/**
 * Collaboration Tasks — individual tasks within projects
 */
export const collaborationTasks = mysqlTable("collaboration_tasks", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("project_id").notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description"),
  assignedTo: int("assigned_to"),
  status: mysqlEnum("status", ["pending", "in_progress", "completed"]).default("pending").notNull(),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CollaborationTask = typeof collaborationTasks.$inferSelect;
export type InsertCollaborationTask = typeof collaborationTasks.$inferInsert;

/**
 * Collaboration Updates — project activity feed
 */
export const collaborationUpdates = mysqlTable("collaboration_updates", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("project_id").notNull(),
  userId: int("user_id").notNull(),
  updateType: mysqlEnum("update_type", ["task_completed", "member_joined", "milestone_reached", "comment"]).notNull(),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CollaborationUpdate = typeof collaborationUpdates.$inferSelect;
export type InsertCollaborationUpdate = typeof collaborationUpdates.$inferInsert;


/**
 * Platform Settings — owner/admin configuration for the entire platform
 */
export const platformSettings = mysqlTable("platform_settings", {
  id: int("id").autoincrement().primaryKey(),
  siteName: varchar("site_name", { length: 255 }).default("Anom Artsy"),
  siteDescription: text("site_description"),
  logoUrl: text("logo_url"),
  faviconUrl: text("favicon_url"),

  // Owner-managed public destinations and content
  universeUrl: text("universe_url"),
  storeUrl: text("store_url"),
  socialLinks: json("social_links").$type<Record<string, string>>(),
  customBanner: json("custom_banner").$type<{
    enabled: boolean;
    eyebrow: string;
    title: string;
    message: string;
    ctaLabel: string;
    ctaUrl: string;
  }>(),
  partnerSites: json("partner_sites").$type<Array<{ label: string; url: string }>>(),

  primaryColor: varchar("primary_color", { length: 7 }).default("#ff00cc"), // magenta
  secondaryColor: varchar("secondary_color", { length: 7 }).default("#00eaff"), // cyan
  accentColor: varchar("accent_color", { length: 7 }).default("#9d4edd"), // purple
  
  // Economy settings
  coinRewardPerAction: int("coin_reward_per_action").default(10),
  coinRewardPerGame: int("coin_reward_per_game").default(50),
  coinRewardPerTask: int("coin_reward_per_task").default(10),
  xpPerLevel: int("xp_per_level").default(100),
  
  // Feature flags
  enableMerch: boolean("enable_merch").default(true),
  enableLounges: boolean("enable_lounges").default(true),
  enableGames: boolean("enable_games").default(true),
  enableCollaboration: boolean("enable_collaboration").default(true),
  enableKidsCorner: boolean("enable_kids_corner").default(true),
  
  // Payment settings
  stripePublicKey: varchar("stripe_public_key", { length: 255 }),
  stripeSecretKey: varchar("stripe_secret_key", { length: 255 }),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type PlatformSettings = typeof platformSettings.$inferSelect;
export type InsertPlatformSettings = typeof platformSettings.$inferInsert;

/**
 * Audit Log — tracks admin actions and platform events
 */
export const auditLog = mysqlTable("audit_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id"),
  action: varchar("action", { length: 100 }).notNull(), // "user_created", "coin_transaction", "achievement_awarded", etc.
  entityType: varchar("entity_type", { length: 50 }).notNull(), // "user", "coin", "achievement", etc.
  entityId: int("entity_id"),
  details: json("details").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AuditLog = typeof auditLog.$inferSelect;
export type InsertAuditLog = typeof auditLog.$inferInsert;

/**
 * VIP Tiers — defines VIP membership levels and benefits
 */
export const vipTiers = mysqlTable("vip_tiers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(), // "vip", "super_vip"
  monthlyPrice: decimal("monthly_price", { precision: 10, scale: 2 }).notNull(),
  coinMultiplier: decimal("coin_multiplier", { precision: 3, scale: 1 }).default("1.5"),
  xpMultiplier: decimal("xp_multiplier", { precision: 3, scale: 1 }).default("1.5"),
  benefits: json("benefits").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type VipTier = typeof vipTiers.$inferSelect;
export type InsertVipTier = typeof vipTiers.$inferInsert;

/**
 * User VIP Subscriptions — tracks active VIP memberships
 */
export const userVipSubscriptions = mysqlTable("user_vip_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  tierId: int("tier_id").notNull(),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 100 }),
  status: mysqlEnum("status", ["active", "paused", "cancelled"]).default("active"),
  startDate: timestamp("start_date").defaultNow().notNull(),
  renewalDate: timestamp("renewal_date"),
  cancelledAt: timestamp("cancelled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type UserVipSubscription = typeof userVipSubscriptions.$inferSelect;
export type InsertUserVipSubscription = typeof userVipSubscriptions.$inferInsert;

/**
 * VIP Benefits Log — tracks VIP-exclusive rewards and perks
 */
export const vipBenefitsLog = mysqlTable("vip_benefits_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  benefitType: varchar("benefit_type", { length: 50 }).notNull(), // "bonus_coins", "exclusive_decoration", "early_access"
  amount: decimal("amount", { precision: 10, scale: 2 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type VipBenefitsLog = typeof vipBenefitsLog.$inferSelect;
export type InsertVipBenefitsLog = typeof vipBenefitsLog.$inferInsert;

/**
 * Music Library — tracks user's music collection and playlists
 */
export const musicLibrary = mysqlTable("music_library", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  artist: varchar("artist", { length: 100 }),
  url: text("url").notNull(),
  duration: int("duration"), // in seconds
  isPlaylist: boolean("is_playlist").default(false),
  playlistItems: json("playlist_items").$type<number[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type MusicLibrary = typeof musicLibrary.$inferSelect;
export type InsertMusicLibrary = typeof musicLibrary.$inferInsert;

/**
 * User Presence — tracks online status for real-time features
 */
export const userPresence = mysqlTable("user_presence", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  status: mysqlEnum("status", ["online", "away", "offline"]).default("offline"),
  lastSeenAt: timestamp("last_seen_at").defaultNow().notNull(),
  currentChannelId: int("current_channel_id"),
});

export type UserPresence = typeof userPresence.$inferSelect;
export type InsertUserPresence = typeof userPresence.$inferInsert;

/**
 * Chat Notifications — notification preferences and history
 */
export const chatNotifications = mysqlTable("chat_notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  messageId: int("message_id").notNull(),
  channelId: int("channel_id"),
  type: mysqlEnum("type", ["mention", "direct_message", "channel_message", "system"]).default("channel_message"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  readAt: timestamp("read_at"),
});

export type ChatNotification = typeof chatNotifications.$inferSelect;
export type InsertChatNotification = typeof chatNotifications.$inferInsert;


/**
 * Tips — tracks donations and tips from members to support the platform
 */
export const tips = mysqlTable("tips", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  tipType: mysqlEnum("tip_type", ["one_time", "recurring"]).default("one_time"),
  message: text("message"),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 100 }),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending"),
  completedAt: timestamp("completed_at"),
  refundedAt: timestamp("refunded_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Tip = typeof tips.$inferSelect;
export type InsertTip = typeof tips.$inferInsert;

/**
 * Membership Tier Purchases — tracks tier upgrade purchases
 */
export const tierPurchases = mysqlTable("tier_purchases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  tier: mysqlEnum("tier", ["basic", "vip", "super_vip"]).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  duration: int("duration").default(30), // days
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 100 }),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending"),
  expiresAt: timestamp("expires_at"),
  completedAt: timestamp("completed_at"),
  refundedAt: timestamp("refunded_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type TierPurchase = typeof tierPurchases.$inferSelect;
export type InsertTierPurchase = typeof tierPurchases.$inferInsert;

/**
 * Lounge Message Reactions — tracks emoji reactions on lounge messages
 */
export const loungeMessageReactions = mysqlTable("lounge_message_reactions", {
  id: int("id").autoincrement().primaryKey(),
  messageId: int("message_id").notNull(),
  userId: int("user_id").notNull(),
  emoji: varchar("emoji", { length: 32 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type LoungeMessageReaction = typeof loungeMessageReactions.$inferSelect;
export type InsertLoungeMessageReaction = typeof loungeMessageReactions.$inferInsert;

/**
 * Lounge Read State — tracks last read timestamp or message ID for unread indicators
 */
export const loungeReadStates = mysqlTable("lounge_read_states", {
  id: int("id").autoincrement().primaryKey(),
  loungeId: int("lounge_id").notNull(),
  userId: int("user_id").notNull(),
  lastReadMessageId: int("last_read_message_id").default(0),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type LoungeReadState = typeof loungeReadStates.$inferSelect;
export type InsertLoungeReadState = typeof loungeReadStates.$inferInsert;

/**
 * Lounge Soundscape Preferences — ambient background soundscapes and audio companions per lounge/user
 */
export const loungeSoundscapes = mysqlTable("lounge_soundscapes", {
  id: int("id").autoincrement().primaryKey(),
  loungeId: int("lounge_id").notNull().unique(),
  soundscapeType: varchar("soundscape_type", { length: 50 }).default("cyber_rain"), // "cyber_rain", "neon_lofi", "cosmic_drone", "sanctuary_waves", "off"
  volume: decimal("volume", { precision: 3, scale: 2 }).default("0.50"),
  enabled: boolean("enabled").default(true),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type LoungeSoundscape = typeof loungeSoundscapes.$inferSelect;
export type InsertLoungeSoundscape = typeof loungeSoundscapes.$inferInsert;

/**
 * User Notifications — persistent in-app notifications for achievements, events, and badge mints
 */
export const userNotifications = mysqlTable("user_notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  title: varchar("title", { length: 150 }).notNull(),
  message: text("message").notNull(),
  type: mysqlEnum("notification_type", ["achievement", "event", "badge", "system"]).default("system").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type UserNotification = typeof userNotifications.$inferSelect;
export type InsertUserNotification = typeof userNotifications.$inferInsert;

/**
 * Souvenir Badges — Moonberry Farm & Realm completion badges
 */
export const userSouvenirBadges = mysqlTable("user_souvenir_badges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  badgeKey: varchar("badge_key", { length: 50 }).notNull(),
  badgeTitle: varchar("badge_title", { length: 100 }).notNull(),
  realmName: varchar("realm_name", { length: 50 }).default("Moonberry Farm").notNull(),
  imageUrl: text("image_url"),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

export type UserSouvenirBadge = typeof userSouvenirBadges.$inferSelect;
export type InsertUserSouvenirBadge = typeof userSouvenirBadges.$inferInsert;

/**
 * Seasonal Challenges & Automated Leaderboard
 */
export const seasonalChallenges = mysqlTable("seasonal_challenges", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 150 }).notNull(),
  description: text("description").notNull(),
  seasonName: varchar("season_name", { length: 50 }).default("Autumn 2026").notNull(),
  rewardCoins: int("reward_coins").default(100).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  endDate: timestamp("end_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SeasonalChallenge = typeof seasonalChallenges.$inferSelect;
export type InsertSeasonalChallenge = typeof seasonalChallenges.$inferInsert;

export const challengeParticipants = mysqlTable("challenge_participants", {
  id: int("id").autoincrement().primaryKey(),
  challengeId: int("challenge_id").notNull(),
  userId: int("user_id").notNull(),
  progressScore: int("progress_score").default(0).notNull(),
  completed: boolean("completed").default(false).notNull(),
  rewardClaimed: boolean("reward_claimed").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ChallengeParticipant = typeof challengeParticipants.$inferSelect;
export type InsertChallengeParticipant = typeof challengeParticipants.$inferInsert;

// Note: We can add pinned badges or store them via dedicated helpers or json column
