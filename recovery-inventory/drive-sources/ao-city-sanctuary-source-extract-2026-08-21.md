# AO-City and Sanctuary Authored Source Extract — 2026-08-21

This is a read-only extraction for content mapping. It is not an approval to publish assets or modify production routing.

## AO master specification

### AO UNIVERSE SYSTEM SPECIFICATION

### THE DEFINITIVE ARCHITECT'S BLUEPRINT & COGNITIVE FLYWHEEL SYSTEM

- SYSTEM ACCESS NOTICE: This master specification defines the architectural, cryptographic, and gamified mechanics of the AO Universe. Under the parent brand Anom Originals (AO), the conglomerate enforces a strictly SFW safe harbor across twelve integrated business divisions. All code, database schemas, and trigger protocols contained herein are structured for production deployment within an enterprise multi-repository environment.
- SYSTEM ACCESS NOTICE: This master specification defines the architectural, cryptographic, and gamified mechanics of the AO Universe. Under the parent brand Anom Originals (AO), the conglomerate enforces a strictly SFW safe harbor across twelve integrated business divisions. All code, database schemas, and trigger protocols contained herein are structured for production deployment within an enterprise multi-repository environment.
### SPECIFICATION METADATA

### VALUES & RECORD

### AUTHOR & FOUNDER

### ORGANIZATION

### HEADQUARTERS

### DEPLOYMENT ENGINE

### VERSION / DATE

### STATUS

### APPROVED FOR SYSTEM BUILD & PRODUCTION CLONE

### SYSTEM ARCHITECTURE OUTLINE

- This specification outlines the technical configurations, core codebase modules, database triggers, economic conversions, and moderation rule assets that compose the AO Nexus ecosystem. High-contrast neon aesthetics (Cyan and Magenta) are structurally mapped across all components to establish the brand's identity-driven styling rules.
### MODULE CODE

### TECHNICAL SPECIFICATION MODULE DESCRIPTION

### LOGICAL RANGE

### MODULE 1

### EXECUTIVE SUMMARY, ROADMAP & CAPITAL STANCE

### PAGES 3-4

### MODULE 2

### UNIFIED DIVERSITY BRAND IDENTITY DESIGN SYSTEMS

### PAGE 5

### MODULE 3

### CORE DATABASE LAYER: NORMALIZED SQL DDL CONFIGURATIONS

### PAGES 6-7

### MODULE 4

### ACTIVE GLOW-CHAINS & NAME STYLE OVERRIDES SCHEMAS

### PAGE 8

### MODULE 5

### AUTOMATED PL/PGSQL TRIGGERS & REVERSION ENGINES

### PAGES 9-10

### MODULE 6

### BACKEND REST INTEGRATION WEBHOOKS & API ENDPOINTS

### PAGES 11-12

### MODULE 7

### THE SENTINEL SECURITY SUITE: AI & SFW FILTERING PROTOCOLS

### PAGE 13

### MODULE 8

### COMMUNITY AMBASSADOR MANUALS & IDENTITY PASSPORTS

### PAGES 14-16

### MODULE 9

### SOCIAL RELAYS & GAMIFICATION SCHEMES (GLOW VELOCITY)

### PAGES 17-18

### MODULE 10

### HIGH-CONTRAST FRONTEND GATEWAY LANDING INTERFACE (HTML5/CSS3)

### PAGES 19-20

### MODULE 11

### UBUNTU PERSISTENT PRODUCTION SYSTEMS DEPLOYMENT CHECKLIST

### PAGE 21

### MODULE 1: EXECUTIVE SUMMARY, ROADMAP & STRATEGY

- AO Universe operates as a vertically integrated creative-technology conglomerate. Unlike traditional creative agencies that function in silos, AO Universe coordinates twelve highly collaborative divisions that feed capital, assets, leads, and core technology into one another. A client entering the ecosystem through the Identity Shop brand agency for custom visual systems automatically routes merchandise production to Merch Systems, payment transactions through the Payment Infrastructure fintech layer, AI tool deployment through Anomoly AI, and digital protection via the Security Team. This generates a powerful system-wide network effect.
### Phased Growth & Scaling Milestones (2026–2029)

### PHASE

### TIMELINE

### CORE OPERATIONAL MILESTONES & REVENUE LOGS

### FINANCIAL MARK

### Phase 1

### Q2-Q3 2026

### Phase 2

### Q4 2026-Q1 2027

- Scale YouTube to 100K subscribers. Launch 3 Anomoly AI SaaS products. Drive Identity Shop to 10 packages/month. Initiate Seed Funding round.
### Phase 3

### Q2-Q3 2027

### Phase 4

### Q4 2027-2028

### Phase 5

### $5M-$10M ARR

### OPERATIONAL RESOURCE CATEGORY

### ALLOCATION PERCENTAGE

### STRATEGIC PURPOSE

### FUND LIMIT

### OPERATIONAL RESOURCE CATEGORY

### ALLOCATION PERCENTAGE

### STRATEGIC PURPOSE

### FUND LIMIT

### MODULE 2: BRAND IDENTITY SYSTEM (UNIFIED DIVERSITY)

### COLOR NAME

### HEXADECIMAL CODE

### SYSTEM ROLE

### APPLICATION EXAMPLE

### FONT FAMILY ROLE

### PREFERRED TYPEFACE

### SIZE (PT)

### LEADING (PT)

### COLOR KEY

### MODULE 3: DATABASE CONFIGURATIONS (POSTGRESQL DDL)

### -- CREATE CARDINAL WALLET TABLE

### -- CREATE HISTORICAL TRANSACTION AUDIT LEDGER

- -- CREATE USER INVENTORY SYSTEM TABLECREATE TABLE user_inventory (inventory_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), node_id UUID REFERENCES wallets(node_id) ON DELETE CASCADE, item_id VARCHAR(50) NOT NULL,is_active BOOLEAN DEFAULT TRUE,acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);-- CREATE VISUAL IDENTITY PROFILE NAME OVERRIDES SYSTEMCREATE TABLE name_style_overrides (node_id UUID PRIMARY KEY REFERENCES wallets(node_id) ON DELETE CASCADE, primary_color VARCHAR(7) DEFAULT '#00ffff',shadow_color VARCHAR(7) DEFAULT '#ff00ff',glow_intensity INT DEFAULT 10 CHECK (glow_intensity BETWEEN 1 AND 10), custom_class VARCHAR(50) DEFAULT 'Explorer');User Asset & Custom Styling Tables Schema DDL
### -- CREATE USER INVENTORY SYSTEM TABLE

### -- CREATE VISUAL IDENTITY PROFILE NAME OVERRIDES SYSTEM

### MODULE 4: DYNAMIC OVERRIDES & GLOW-CHAINS

- The Glow-Chain represents the core gamified mechanic of District B. Users start a chain by spending Glow Points or passing an earned 'Spark' to members on their Friends, Family, or Office lists within a 24-hour window. Keeping a chain alive increases the 'Glow Streak' velocity multiplier across the district.
### -- CREATE ACTIVE STREAK VELOCITY TABLE

### ACTIVE RELAY COUNTS (STREAK)

### MULTIPLIER APPLIED

### VISUAL FEEDBACK ON PROFILE NODE

### REWARD LEVEL TYPE

### MODULE 5: AUTOMATED DATABASE SYSTEM TRIGGERS

- This trigger automates the transfer of the Retro King prestige rank. When a user logs a score that takes the #1 position on the AO Apex Leaderboard, the system automatically removes the visual overrides, custom badges, and Boutique discounts from the former King and awards them to the victor.
- CREATE OR REPLACE FUNCTION trigger_retro_king_displacement() RETURNS TRIGGER AS $$DECLAREold_king_id UUID;BEGIN-- IDENTIFY THE FORMER KING OF THE BOARDSELECT node_id INTO old_king_idFROM name_style_overrides WHERE custom_class = 'Guardian' LIMIT 1;IF FOUND AND old_king_id != NEW.node_id THEN-- STRIP FORMER KING'S PREMIUM OVERRIDESUPDATE name_style_overridesSET primary_color = '#00ffff', custom_class = 'Explorer' WHERE node_id = old_king_id;END IF;-- EMPOWER NEW VICTOR IN STYLE OVERRIDESINSERT INTO name_style_overrides (node_id, primary_color, shadow_color, glow_intensity, custom_class)VALUES (NEW.node_id, '#ff00ff', '#00ffff', 10, 'Guardian') ON CONFLICT (node_id) DO UPDATESET primary_color = '#ff00ff', custom_class = 'Guardian';RETURN NEW;END;$$ LANGUAGE plpgsql;
### DECLARE

### BEGIN

### -- IDENTIFY THE FORMER KING OF THE BOARD

- FROM name_style_overrides WHERE custom_class = 'Guardian' LIMIT 1;
### -- STRIP FORMER KING'S PREMIUM OVERRIDES

### END IF;

### -- EMPOWER NEW VICTOR IN STYLE OVERRIDES

- VALUES (NEW.node_id, '#ff00ff', '#00ffff', 10, 'Guardian') ON CONFLICT (node_id) DO UPDATE
- SET primary_color = '#ff00ff', custom_class = 'Guardian';
### RETURN NEW;

### END;

### MODULE 5 (CONT.): AUTOMATED EMATHETIC LIGHT TRIGGERS

- Tied to the 'Respect and Empathy' social curriculum in District C (The Color Corner), this trigger monitors communication entries directed toward Grandparent nodes. It automatically lowers the glow intensity of the notification to a gentle 2, pulsing in a warm Soft Violet (#c4b5fd) to signal that the digital space remains respectful and quiet while Grandma is resting.
- CREATE OR REPLACE FUNCTION trigger_grandma_softglow_notification() RETURNS TRIGGER AS $$DECLAREreceiver_class VARCHAR(50); BEGIN-- VERIFY IF RECEIVER HAS GRANDPARENT ROLE (GUARDIAN OF THE LIGHT)SELECT custom_class INTO receiver_classFROM name_style_overrides WHERE node_id = NEW.receiver_id;IF receiver_class = 'Guardian' THEN-- AUTOMATICALLY DAMPEN TEXT GLOW INTENSITY IN NOTIFICATION WRAPPERUPDATE name_style_overridesSET glow_intensity = 2, primary_color = '#c4b5fd' WHERE node_id = NEW.sender_id;END IF;RETURN NEW;END;$$ LANGUAGE plpgsql;
### DECLARE

### -- VERIFY IF RECEIVER HAS GRANDPARENT ROLE (GUARDIAN OF THE LIGHT)

- IF receiver_class = 'Guardian' THEN
### -- AUTOMATICALLY DAMPEN TEXT GLOW INTENSITY IN NOTIFICATION WRAPPER

### END IF;

### RETURN NEW;

### END;

### ACTIVE TARGET LIST

### ACTION WEIGHT

### AUTOMATED VISUAL OVERRIDE AT RESIDENCE NODE

### STRATEGIC PURPOSE

### +10 GP

- Incentivize support at home and parent mentoring.
### +5 GP

### +5 GP

### MODULE 6: INTEGRATION API & BACKEND ENDPOINTS

- The core engine communicates with external payment gateways, logistics centers, and device verification hubs using clean JSON APIs. This provides the functional glue to handle cash top-ups, Printful product shipping, and secure onboarding verification.
### // GRADUATE MEMBER TIER TO VERIFIED STATUS

### MODULE 6 (CONT.): TRANSACTION AND CO-BRAND WEBHOOKS

- This endpoint processes successful cash payments, updates ledger states, awards the standard 10% loyalty Anomcoin bonus to the user's wallet, and routes fees between internal divisions.
### // CALCULATE 10% AC LOYALTY BONUS

### // ROUTE 10% IP MONITORING FEE TO SECURITY DIVISION (DIVISION 09)

- This API triggers physical print-on-demand fulfillment when custom designs from the Identity Studio (Blueprint Canvas) are purchased by Architect tier members.
### MODULE 7: THE SENTINEL SAFETY SUITE

### VIOLATION TRIGGER TYPE

### AI AUTOMATED ACTION PRE-SCREEN

### AMBASSADOR HUMAN REVIEW POLICY

### SEVERITY RECORD

### Identity / Asset Theft (Impersonating names, copying assets)

### Identity Verification Fail (Blurry photo, B&W, Obstructed face)

### -- CREATE SYSTEM FOR ACCOUNT MUTING (DIM STATE)

### MODULE 8: COMMUNITY AMBASSADOR STEWARDSHIP

- The core of community retention is the Architecture of Altruism. Community Ambassadors are volunteer stewards who guard platform safety. They are rewarded through visual identity markers, exclusive access, and influence—never through cash payouts or direct monetary benefits.
- "I, [Name / Node ID], standing at the Gateway of the AO Nexus, do solemnly pledge to be a Guardian of the Light. I swear to uphold the Sentinel Code with absolute vigilance and empathy. I will protect this harbor for families, ensuring no adult or suggestive content dims our community glow. I will defend the unique art of our members against impersonation. I will elevate this space, dimming toxicity and bullying to preserve a positive glow. I accept that my reward is status, access, and the strength of the community I protect, not monetary pay. My vision is the safety of our children and the clarity of our art. By my word, the harbor remains safe."
### Identity Passport Verification Handshake

- To protect against bot farms and verify user intent, new members must submit an Identity Passport before gaining active posting privileges. Until approved, their account remains in a read-only state.
### REGISTRY HANDSHAKE PASS CRITERIA

### AUTOMATED REJECTION ACTIONS & MACRO TEXTS

### AMBASSADOR VERIFICATION ACTIONS

### MODULE 8 (CONT.): ORIENTATION MANUALS & CODES

### Phase 1: The Cosmic Welcome

- "Welcome to the AO Nexus, Explorer. I am [Ambassador Name], your Community Ambassador. You have entered a vertically integrated digital kingdom built on Identity Art, Mood-First Design, and Neon Storytelling. Before we initialize your Node, I will guide you through our Safe Harbor protocols."
### Phase 2: The Sentinel Code & SFW Standard

- "Our mission is to maintain a 100% SFW harbor for families and creators. This means: • STRICTLY SFW: Zero tolerance for suggestive content or adult visual material. • IDENTITY GUARD: Your art must be yours. Impersonation results in instant suspension. • POSITIVE GLOW: No toxicity. Bullying and harassment are blocked by our Sentinel AI."
### Phase 3: The Architecture of Altruism

### Phase 4: The Identity Passport Handshake

- "To graduate to Verified Explorer status, let's complete your Identity Passport. Please upload a clear photo holding your handwritten credentials. Once approved, you will receive +50 GP and your permanent Passport pin. Ready to map your Node?"
- Stewardship actions are incentivized through visual status upgrades, ensuring high-quality moderation representation:
### REWARD THEME

### SPECIFIC SYSTEM PERK

### FUNCTIONAL VALUE / STATUS GAIN

- Visual Identity
- Access to a locked vault of moderation-exclusive emotes and stickers that are
### MODULE 9: SOCIAL RELAYS & GAMIFICATION CODES

### PLATFORM ACTION DEFINITION

### GLOW POINTS (GP) YIELD

### ANOMCOIN (AC) YIELD

### SYSTEM LEDGER EVENT TRIGGER

### +50 GP

### N/A

### +30 GP

### N/A

### +25 GP

### N/A

### +40 GP

### +100 GP

### +20 GP

### N/A

### N/A

### MODULE 9 (CONT.): PIXEL & DOT CURRICULUM

### EPISODE TITLE

### CORE SOCIAL SKILL TARGET

### FAMILY DYNAMICS ROLE PLAY

### GAMEPLAY INTEGRATION (ARCADE)

- Level 1 (The Sharing Bridge) and Level 5 (The Supernova Event) are structured to require real-time cooperation between characters. Level 5 requires the older child (Pixel) and baby (Dot) characters to stand on pressure plates simultaneously while maintaining a 50+ node Glow-Chain, triggering the Supernova flash which illuminates hidden spark caches and awards the family wallet +20 GP and the 'Nexus Sentinel' badge.
### MODULE 10: FRONTEND SYSTEM GATEWAY INTERFACE

- <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>AO NEXUS // Digital Identity & Mood-First Design</title><style>:root {--ao-navy: #0d1b4b;/* Dark base Background */--electric-violet: #7c3aed; /* CTA Accent */--neon-cyan: #00ffff;/* Explorer Node */--neon-magenta: #ff00ff;/* Architect Node */--accent-gold: #b45309;/* Prestige Accents */--bright-white: #ffffff;/* Base text font color */--soft-violet: #c4b5fd;/* Calm highlight */}body {background-color: var(--ao-navy); color: var(--bright-white);font-family: 'Calibri', sans-serif; margin: 0; padding: 0;}h1 {font-family: 'Candara', sans-serif; font-weight: bold;text-transform: uppercase; color: var(--bright-white);text-shadow: 0 0 10px var(--electric-violet);}code {font-family: 'Consolas', monospace; color: var(--neon-cyan);}.gateway-grid { display: grid;grid-template-columns: repeat(4, 1fr); gap: 20px; padding: 40px;}.district-card { background: #050b24;border: 1px solid var(--electric-violet); padding: 20px; text-align: center;transition: transform 0.3s ease, border-color 0.3s ease;}.district-card:hover { transform: translateY(-5px);border-color: var(--neon-magenta);box-shadow: 0 0 15px var(--neon-magenta);}</style></head><body> ...
- <title>AO NEXUS // Digital Identity & Mood-First Design</title>
### MODULE 10 (CONT.): PORTAL WRAPPERS & INTEGRATIONS

### <!-- SECURE REFERRAL PORTAL BANNER -->

### <!-- MAFIA SYNDICATE PORTAL BANNER -->

### MODULE 11: UBUNTU PERSISTENT CLONE CHECKLIST

- cd ~/AO-Universe-Ecosystem/AO-Nexus-Frontend && \ git init -b main && git add . && \git commit -m "feat: initialize Guardian Command Center UI" && \gh repo create AO-Nexus-Frontend --public --source=. --remote=origin --pushRepo 1: The Gateway Frontend (AO-Nexus-Frontend)
- git commit -m "feat: initialize Guardian Command Center UI" && \
- Repo 2: The Core Ledger (AO-Identity-Engine)
- cd ~/AO-Universe-Ecosystem/AO-Identity-Engine && \ git init -b main && git add . && \git commit -m "feat: deploy identity ledger schemas and SMS handshake" && \ gh repo create AO-Identity-Engine --public --source=. --remote=origin --push
- cd ~/AO-Universe-Ecosystem/AO-Identity-Engine && \ git init -b main && git add . && \
- git commit -m "feat: deploy identity ledger schemas and SMS handshake" && \ gh repo create AO-Identity-Engine --public --source=. --remote=origin --push

## AO reconciliation/build plan

- 1. Brand system. The plan uses deep navy / electric violet / white / muted gold, Candara/Calibri/Consolas. What's actually built — the live Sanctuary app, the graphic pipeline, months of confirmed decisions — runs on cyan / magenta / gold on near-black, Space Mono + Inter. Recommendation: the built system wins. It's already shipping in real places; rewriting the plan's palette section costs a lot less than re-theming a live app and an established content pipeline. Gold stays non-negotiable either way.
- The "digital identity and moderation" section currently is Fubar's Bouncer program — the salute verification, the NSFW/NAP violation categories, described accurately because they're real and yours to know, but they're Fubar's system, not AO's. Two reasons to rebuild this natively rather than reskin it:
- Fit. Fubar's salute system was built for a cam-community context. Sanctuary also holds Kids Corner. A verification/moderation model built for an adult-platform context isn't automatically the right shape for a platform that spans both — this is worth designing on purpose, not inheriting.
- Tiered verification, not one model for everyone. Light-touch (email/phone) for general Sanctuary members and Kids Corner guardian accounts; stronger identity checks (a real KYC vendor like Stripe Identity, not a handwritten-sign photo) only for people running paid storefronts or moderating — ties naturally into the Payment Infrastructure division too.
- Violation categories in AO's own language, scoped to what Sanctuary actually has to moderate (coin economy, social feed, lounges, Kids Corner) rather than a cam-site's specific taxonomy.
- Build on what's already there. Sanctuary's admin dashboard is already built (Phases 1–11). The real near-term "Security Team" deliverable might just be: formalize the moderation workflows and policy docs for the dashboard that exists, using your real training-program experience to write it — not invent new infrastructure.
- Prioritize: Identity Shop (AO Services), Kids Corner (Pixel & Dot books), Sanctuary/Lounges, Merch Systems, YouTube. Park for later: Color Space, Brand Kit, external Payment Infrastructure, and the two name-collision divisions until they're renamed. Design fresh (not urgent, but blocking if skipped): Security Team.
- This also loops back to the still-open question from the last conversation: Identity Shop and Lounges are the same fork as "does anomartsy.xyz/lol sell services first or pull people into Sanctuary first" — that decision doesn't go away just because the frame got bigger. If anything, it's the thing the whole roadmap hinges on.
- Which Security Team direction to develop further — Identity Guard (SMS + human Ambassadors) from the AO Nexus doc is a real improvement over the Fubar-based version.
- Primary CTA: Services vs. Sanctuary — still open.

## Sanctuary safety layer work order

### Sanctuary — Safety Layer Work Order

- Project: Anom Artsy / AO Sanctuary Scope: Phases 14–19 — feature control, user safety, moderation, and age assurance Priority: Blocking. No new social or content features until this ships.
- Extend the existing 29-table Drizzle schema. Do not create a parallel database. Reuse users, userProfiles, loungeMessages, feedPosts, auditLog, loungeReadStates as they exist. If a design doc proposes tables like wallets, ledger_entries, identity_nodes, research_library, or sentinel_alerts, those are concept documents, not the live schema — map them onto existing tables rather than adding duplicates.
- The application currently has admin-side moderation only. An owner can act on content through OwnerControlPanel.tsx and AdminDashboard.tsx, and actions are recorded to auditLog.
- The application has a kids_progress table and a Kids Corner that collect activity data from children, with no age gate and no parental consent mechanism in front of them.
### Phase 14 — Feature flag control panel

- activity_feed_ratings requires reporting and a working moderation queue
### Phase 15 — Safety schema migration

- New table: moderation_actions
- This is the moderation record. Continue writing to auditLog as well — auditLog is the general system log, moderation_actions is the specific, queryable, reversible moderation history.
- New table: guardian_links
- Unique composite index on (guardianUserId, childUserId).
- moderationStatus — enum: visible, flagged, hidden, removed, default visible
- Content is never hard-deleted. Removal sets moderationStatus = 'removed' and stamps deletedAt. All existing read queries must be updated to filter to moderationStatus = 'visible' for normal users, while moderator views can see hidden and removed content.
- Add guardianLinkId — int, nullable, FK → guardian_links.id
### Phase gate: migration runs clean, all existing tests still pass, typecheck clean, production build succeeds. Nothing user-visible changes yet.

### Phase 16 — Report and block, user-facing

- safety.submitReport — authenticated. Rate-limit to a sane number per user per hour to prevent report-flooding. Returns a confirmation, never the moderation outcome.
### UI

### Phase gate: a non-admin test account can report content and block another account, and the block visibly takes effect on both surfaces. Full suite green.

### Phase 17 — Moderation queue and moderator role

- Add a permission helper alongside the existing admin guard. Establish the tier:
- Each row shows the reported content in context, the reporter's reason, the target's prior moderation_actions history, and any other open reports on the same target
- Every action writes a moderation_actions row and an auditLog entry
- Reversal is available on every action, following the existing moderationUndo.ts pattern already in the codebase
### Phase gate: an ambassador account can work the queue and take permitted actions but is correctly refused suspend and ban. Full suite green.

### Phase 18 — Age assurance and parental consent

- under_13 — account is created in a pending state and cannot be used until a guardian_links row reaches consentStatus = 'granted'. The child cannot grant this. The flow collects a guardian email, the guardian receives a verification, the guardian confirms from their own authenticated adult account, and only then does the link go to granted.
- Kids Corner and kidsProgress writes require an active granted guardian_links row for any under_13 account.
### Guardians get a view of their linked child's progress and a revoke control. Revoking sets consentStatus = 'revoked' and immediately suspends the child account's access.

- Stamp guardianLinkId on every new kidsProgress row.
### Phase gate: an under-13 signup cannot reach Kids Corner without a verified guardian grant, and revocation cuts access immediately.

### Phase 19 — Verification and evidence

- Regression coverage for: report submission and rate limiting, block enforcement at the query layer, each role tier's permission boundary, restriction expiry, and the under-13 consent gate.
- Confirm no read path leaks moderationStatus removed or hidden content to non-moderators.

## Sanctuary Terms/Privacy draft

### Sanctuary — Terms of Service and Privacy Policy

- Prepared 12 August 2026. Written against the age tier system, moderation model, and currency design as actually implemented and tested in the Sanctuary codebase.
### PART ONE — TERMS OF SERVICE

### Sanctuary is operated by Anom Originals ("AO," "we," "us"), a sole proprietorship based in Woodbridge, Virginia.

- By creating an account or using Sanctuary, you agree to these Terms. If you are under 18, a parent or legal guardian must agree on your behalf and provide consent as described in Section 4.
- If you do not agree, do not use Sanctuary.
### Sanctuary operates under four rules. They are not aspirational — they are enforced by the platform and by human moderators.

### Identity guard. Your art and identity must be your own. No impersonation. No presenting another person's work as yours.

- 4. Age requirements and guardian consent
### Sanctuary uses six account tiers based on date of birth.

- Guardian consent is required for Sprout and Explorer accounts. These accounts remain inactive until a verified parent or legal guardian grants consent. A guardian may revoke consent at any time; revocation suspends the child's account immediately and removes the child's posted content.
- Age tiers update automatically. When a member has a birthday, their tier is recalculated the next time they sign in. Permissions change accordingly.
- Purchases. Accounts in the Sprout and Explorer tiers cannot purchase anything. Builder accounts may purchase only with guardian consent.
- You grant us a license to host, display, and distribute your content within Sanctuary and AO properties, for as long as you keep it posted. This license exists so the platform can function. It is non-exclusive and ends when you delete the content, except for copies retained in backups or moderation records.
- We may remove content that violates these Terms. Removed content is marked as removed rather than permanently erased, so that moderation decisions can be reviewed and appealed.
- 7. Moderation
- Moderation is carried out by volunteer Community Ambassadors and by staff moderators. Their powers are limited and enforced by the platform itself.
- Appeals. If you believe a moderation decision was wrong, contact anom@anomartsy.xyz. Moderation actions are logged with a stated reason and can be reviewed.
### Sanctuary uses two internal systems.

- Use Sanctuary for commercial solicitation without permission
### Sanctuary may link to external sites and services. We do not control them and are not responsible for their content or practices.

### Sanctuary is provided as-is. We do not guarantee uninterrupted availability. We may modify, suspend, or discontinue features.

- To the maximum extent permitted by law, AO is not liable for indirect, incidental, or consequential damages arising from your use of Sanctuary. Our total liability is limited to the greater of the amount you paid us in the preceding twelve months, or $100 USD.
### PART TWO — PRIVACY POLICY

- This policy explains what we collect, why, and what choices you have. It applies to Sanctuary and other AO properties.
### Guardian contact email, for accounts requiring consent

- Moderation records where applicable
- To operate your account and apply the correct age-tier permissions
### Sanctuary knowingly serves children under 13 in the Sprout and Explorer tiers, and complies with the Children's Online Privacy Protection Act.

- Verifiable parental consent is required before a Sprout or Explorer account becomes active. We collect a guardian email address, verify the guardian relationship, and require explicit consent before the account can be used.
### Guardian rights. A parent or legal guardian may at any time:

- To exercise any of these, contact anom@anomartsy.xyz from the guardian email on file.
- What the parent dashboard shows. Guardians can see their child's progress, completed activities, time spent, creative area, good deeds, and the names of members their child interacts with.
- The parent dashboard does not show message contents, drafts, or search history. This is deliberate. Guardians see that interaction is happening and with whom, without reading private conversation. This balance protects the child's developing sense of privacy while giving guardians meaningful oversight.
- Moderation records: retained after content removal so decisions can be reviewed and appealed
- On account deletion we remove your personal information except where retention is required by law or necessary for fraud prevention and moderation integrity.
### NOTES FOR REVIEW

- 1. COPPA compliance. The platform serves children as young as 5. Verifiable parental consent method, guardian rights, and data minimization all need review against the FTC's current COPPA Rule. This is the highest-risk area.
- 6. Minors and purchases. This draft blocks purchases below Builder tier and requires guardian consent for Builder. Confirm whether that is sufficient under state contract law regarding minors.

