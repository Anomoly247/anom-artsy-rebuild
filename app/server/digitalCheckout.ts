import Stripe from "stripe";
import { and, eq } from "drizzle-orm";
import {
  digitalCheckoutSessions,
  membershipPlans,
  storeCatalogItems,
  storeCoinPacks,
  userEntitlements,
  userMemberships,
  userProfiles,
  users,
  coinTransactions,
} from "../drizzle/schema";
import { getDb } from "./db";

type PurchaseType = "coin_pack" | "catalog_item" | "membership";

type CheckoutInput = {
  purchaseType: PurchaseType;
  referenceId: number;
  requestKey: string;
};

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Digital checkout is not configured");
  }
  return new Stripe(secretKey);
}

function getPublicAppUrl() {
  return (process.env.PUBLIC_APP_URL || "https://universe.anomartsy.xyz").replace(/\/$/, "");
}

function centsFromRealPrice(value: string | number | null | undefined) {
  const dollars = Number(value ?? 0);
  const cents = Math.round(dollars * 100);
  if (!Number.isFinite(cents) || cents <= 0) {
    throw new Error("This digital item is not configured for real-money checkout");
  }
  return cents;
}

async function getCheckoutProduct(input: CheckoutInput) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  if (input.purchaseType === "coin_pack") {
    const rows = await db.select().from(storeCoinPacks).where(eq(storeCoinPacks.id, input.referenceId)).limit(1);
    const pack = rows[0];
    if (!pack || pack.status !== "published" || pack.guardianStatus !== "approved") {
      throw new Error("Coin pack is not available");
    }
    if (pack.priceCents <= 0 || pack.coinAmount <= 0) throw new Error("Coin pack pricing is invalid");
    return {
      purchaseType: input.purchaseType,
      referenceId: pack.id,
      slug: pack.slug,
      name: pack.name,
      description: pack.description ?? "Digital Anom Coin pack",
      amountCents: pack.priceCents,
      currency: pack.currency.toLowerCase(),
      metadata: { product_type: "coin_pack", product_slug: pack.slug, coin_amount: String(pack.coinAmount) },
    } as const;
  }

  if (input.purchaseType === "catalog_item") {
    const rows = await db.select().from(storeCatalogItems).where(eq(storeCatalogItems.id, input.referenceId)).limit(1);
    const item = rows[0];
    if (!item || item.status !== "published" || item.guardianStatus !== "approved") {
      throw new Error("Digital item is not available");
    }
    return {
      purchaseType: input.purchaseType,
      referenceId: item.id,
      slug: item.slug,
      name: item.name,
      description: item.description ?? "Guardian-approved AO digital item",
      amountCents: centsFromRealPrice(item.priceReal),
      currency: "usd",
      metadata: { product_type: "catalog_item", product_slug: item.slug, catalog_item_id: String(item.id) },
    } as const;
  }

  const rows = await db.select().from(membershipPlans).where(eq(membershipPlans.id, input.referenceId)).limit(1);
  const plan = rows[0];
  if (!plan || plan.status !== "published") throw new Error("Membership plan is not available");
  return {
    purchaseType: input.purchaseType,
    referenceId: plan.id,
    slug: plan.slug,
    name: plan.name,
    description: plan.description ?? "AO membership access layer",
    amountCents: centsFromRealPrice(plan.priceReal),
    currency: "usd",
    metadata: { product_type: "membership", product_slug: plan.slug, membership_plan_id: String(plan.id) },
  } as const;
}

export async function listPublishedCoinPacks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(storeCoinPacks).where(and(eq(storeCoinPacks.status, "published"), eq(storeCoinPacks.guardianStatus, "approved")));
}

export async function createDigitalCheckoutSession(userId: number, input: CheckoutInput) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const requestKey = input.requestKey.trim();
  if (!/^[A-Za-z0-9:_-]{8,160}$/.test(requestKey)) throw new Error("Invalid checkout request key");

  const existing = await db.select().from(digitalCheckoutSessions).where(and(eq(digitalCheckoutSessions.userId, userId), eq(digitalCheckoutSessions.requestKey, requestKey))).limit(1);
  if (existing[0]?.checkoutUrl) return { sessionId: existing[0].stripeSessionId, url: existing[0].checkoutUrl, reused: true };

  const product = await getCheckoutProduct(input);
  const stripe = getStripeClient();
  const userRows = await db.select({ email: users.email }).from(users).where(eq(users.id, userId)).limit(1);
  const email = userRows[0]?.email ?? undefined;
  const appUrl = getPublicAppUrl();
  const metadata = Object.fromEntries(
    Object.entries({ user_id: String(userId), request_key: requestKey, reference_id: String(product.referenceId), ...product.metadata })
      .filter(([, value]) => typeof value === "string")
  ) as Record<string, string>;

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      line_items: [{
        quantity: 1,
        price_data: {
          currency: product.currency,
          unit_amount: product.amountCents,
          product_data: { name: product.name, description: product.description.slice(0, 500) },
        },
      }],
      customer_email: email,
      client_reference_id: `${userId}:${requestKey}`.slice(0, 200),
      metadata,
      payment_intent_data: { metadata },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/store?checkout=cancelled`,
    },
    { idempotencyKey: `ao-checkout-${userId}-${requestKey}` },
  );

  try {
    await db.insert(digitalCheckoutSessions).values({
      userId,
      stripeSessionId: session.id,
      requestKey,
      checkoutUrl: session.url,
      purchaseType: product.purchaseType,
      referenceId: product.referenceId,
      amountCents: product.amountCents,
      currency: product.currency,
      status: "pending",
      metadata,
    });
  } catch (error) {
    const concurrent = await db.select().from(digitalCheckoutSessions).where(eq(digitalCheckoutSessions.requestKey, requestKey)).limit(1);
    if (concurrent[0]?.checkoutUrl) return { sessionId: concurrent[0].stripeSessionId, url: concurrent[0].checkoutUrl, reused: true };
    throw error;
  }

  return { sessionId: session.id, url: session.url, reused: false };
}

export async function fulfillDigitalCheckoutSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return { fulfilled: false, reason: "payment_not_paid" } as const;
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  return db.transaction(async (tx) => {
    const rows = await tx.select().from(digitalCheckoutSessions).where(eq(digitalCheckoutSessions.stripeSessionId, session.id)).limit(1);
    const checkout = rows[0];
    if (!checkout) throw new Error("Checkout session is not registered");
    if (checkout.status === "paid" && checkout.fulfilledAt) return { fulfilled: true, alreadyProcessed: true } as const;

    const claimed = await tx.update(digitalCheckoutSessions).set({
      status: "paid",
      paymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
    }).where(and(eq(digitalCheckoutSessions.id, checkout.id), eq(digitalCheckoutSessions.status, "pending")));
    if (Number((claimed as { affectedRows?: number }).affectedRows ?? 0) !== 1) {
      return { fulfilled: true, alreadyProcessed: true } as const;
    }

    const sourceRef = `stripe:${session.id}`;
    if (checkout.purchaseType === "coin_pack") {
      const packRows = await tx.select().from(storeCoinPacks).where(eq(storeCoinPacks.id, checkout.referenceId)).limit(1);
      const pack = packRows[0];
      if (!pack || pack.status !== "published" || pack.guardianStatus !== "approved") throw new Error("Coin pack is no longer approved");
      const profileRows = await tx.select().from(userProfiles).where(eq(userProfiles.userId, checkout.userId)).limit(1);
      const profile = profileRows[0];
      const current = BigInt(Math.trunc(Number(profile?.anomCoinBalance ?? "0")));
      const next = current + BigInt(pack.coinAmount);
      if (!profile) {
        await tx.insert(userProfiles).values({ userId: checkout.userId, anomCoinBalance: next.toString() });
      } else {
        await tx.update(userProfiles).set({ anomCoinBalance: next.toString() }).where(eq(userProfiles.userId, checkout.userId));
      }
      await tx.insert(coinTransactions).values({ userId: checkout.userId, amount: String(pack.coinAmount), type: "earn", reason: `stripe_coin_pack:${pack.slug}` });
    } else if (checkout.purchaseType === "catalog_item") {
      const itemRows = await tx.select().from(storeCatalogItems).where(eq(storeCatalogItems.id, checkout.referenceId)).limit(1);
      const item = itemRows[0];
      if (!item || item.status !== "published" || item.guardianStatus !== "approved") throw new Error("Digital item is no longer approved");
      const existing = await tx.select().from(userEntitlements).where(and(eq(userEntitlements.userId, checkout.userId), eq(userEntitlements.catalogItemId, item.id), eq(userEntitlements.status, "active"))).limit(1);
      if (!existing.length) {
        await tx.insert(userEntitlements).values({ userId: checkout.userId, catalogItemId: item.id, grantSource: "purchase", status: "active", sourceRef });
      }
    } else {
      const planRows = await tx.select().from(membershipPlans).where(eq(membershipPlans.id, checkout.referenceId)).limit(1);
      const plan = planRows[0];
      if (!plan || plan.status !== "published") throw new Error("Membership plan is no longer published");
      await tx.insert(userMemberships).values({ userId: checkout.userId, planId: plan.id, status: "active", sourceRef });
    }

    await tx.update(digitalCheckoutSessions).set({ fulfilledAt: new Date() }).where(eq(digitalCheckoutSessions.id, checkout.id));
    return { fulfilled: true, alreadyProcessed: false } as const;
  });
}

export async function getDigitalCheckoutStatus(userId: number, stripeSessionId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const rows = await db.select({ status: digitalCheckoutSessions.status, fulfilledAt: digitalCheckoutSessions.fulfilledAt }).from(digitalCheckoutSessions).where(and(eq(digitalCheckoutSessions.userId, userId), eq(digitalCheckoutSessions.stripeSessionId, stripeSessionId))).limit(1);
  return rows[0] ?? null;
}

import express, { type Express } from "express";

export function registerStripeWebhookRoute(app: Express) {
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const signature = req.header("stripe-signature");
    if (!webhookSecret || !signature) {
      res.status(503).json({ error: "Stripe webhook is not configured" });
      return;
    }

    let event: Stripe.Event;
    try {
      const stripe = getStripeClient();
      event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (error) {
      console.error("[Stripe] Webhook signature verification failed", error);
      res.status(400).json({ error: "Invalid webhook signature" });
      return;
    }

    try {
      if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
        await fulfillDigitalCheckoutSession(event.data.object as Stripe.Checkout.Session);
      }
      res.status(200).json({ received: true });
    } catch (error) {
      console.error("[Stripe] Checkout fulfillment failed", error);
      res.status(500).json({ error: "Checkout fulfillment failed" });
    }
  });
}
