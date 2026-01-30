// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/storage.ts
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

// daily-breaditation-firebase-adminsdk-fbsvc-245b95c1a1.json
var daily_breaditation_firebase_adminsdk_fbsvc_245b95c1a1_default = {
  type: "service_account",
  project_id: "daily-breaditation",
  private_key_id: "245b95c1a14604257752fe3c325aacaa8b4357f4",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCixPF6Yq4g4tRR\nUbYnKw8S8davUs5TJn7rU/PWnUSf4wwla1SjFAJnVw5pvgmmsz7lfAOLlJiZznob\naGChPSrkLGU1ly/kCjrRSDSyk+0cuPWyy65iWYLdaK7BfdL29zOFjFLeWXh38a+B\nPWMWe4YVIRrd7nPt7jBljpK7Zsp0cyJGpuvqE/X2mcwe/QaQH+y6oQKjq00W/YuB\nQWsvXDIJPTM+PsI0eWrI4lh8XJqQ/rPUTAMXD4iuryYwdr3C9Zd09CWptYqIwC7a\nnXk/hzz9OyhJt9GpBz8ZrTa8ONBgVXKdp+00mrFa9E6k6xuM7qptxbqfMx8U6CQ7\nvF7U5f2LAgMBAAECggEABTkaopm+CrIcrAtaNAGOt0XpZLDcjBCFLBoCjhV32UWY\n4y6BhcYjmZtSjBQcDSxdTVHgbz8ycmUMyApeZ24mDTJbgQ+76q5lWsfdYQmcJzrM\nL5OXofJLX713NiBKf8BI9/Ubx6TJV9f6kMQehN8r20u3p/153N2y0d90V+0hfAEU\npnBKc/0rOV3ZRB69NWgQXrQw84utmHdwbK70RDwe3kMnseGmD2uW/M154g6ujPZe\n6KcN9DCCyFTLTbmn5GEPpGgVZgFKvaHJE3MSDqNtcEq/5+6gC7A+IfkKbTzaewO2\nBM117HK6getAGd95d349UzRDJkkTAXMlrxq5w+zfmQKBgQDfHEqVDP/Ok7D1A5HO\n1YH3p9ri47PFO64KG4fGOMbXmxan79Fq0PfHa83ME6t7I7ijlTIiPTUsCnD6s32G\nWE5fMC0qY3+MfofAnbrsH12QKGLFvxeu4I0M86vrtAIPEVMuqdSUDeXsY6Ci5AvF\nllJeiC2RGt7c1Mj0nwkA2aiJ3QKBgQC6w4Fb0gwX+6xDVGNjDCS9l6K+CDLL4vmy\nzh/IXSfIbakqpcm9/9n3ERBTfuZd6wf/FGDGCl300wn95cno5V0VRmSlkKBLWSji\ndlL4Cm+KDPC0/fYzyYmtb4JmoY+H/U3bM43fjZxtul6ApUqKEW1Um4Kxye6T/WUL\nD+4Op8bShwKBgD+Kxi8HIb/KzmYpmxhGNJq9ApkF8sgkhB+60YOB3he/wscXhRQf\n6cGxEU6i9369oLNuJXYc6ozdeGnePszJT6DKjsJ4zfXMf4s7IOZo1HPfHKpnDy6u\nI13h9D/P55o0+/TZR4LXJnmZskFSI4wlkNX9gMTH21sXexg4Rw8n7lk9AoGBAIXS\nNmuDizTYGWu5GOnMtrq+31aI61TaUw7C0VUxIqNjqBYt6utgW17D9E3PnONo2Db2\n9AyTOxWE7iDmORHO3y6yXMWhZqn2veve2r5uQ9PIR+V4H6Sl4SfLwcUmOIE5iELr\notmvT4n0Q2ish0d9CzjXoQMhbPjPVUpi5LHNmBIbAoGBAM94gG1Y1cS9hYYrZY4b\nT+skgIly0UrPE1en/694cnBi5ExRzWsoCZ2YFWQa2/D0YYc+xlMNz4cxInddXri4\n6pFgwN7K8wxXn8P9KENILgh93Fsbw8mWd3FsxJHugFzNbKFk4NMQu6Mhl4T0QClp\nGMI/oY0A+2evhqUrncRLxZfF\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@daily-breaditation.iam.gserviceaccount.com",
  client_id: "118131120137466518108",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40daily-breaditation.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// server/storage.ts
initializeApp({
  credential: cert(daily_breaditation_firebase_adminsdk_fbsvc_245b95c1a1_default)
});
var db = getFirestore();
function normalizeTimestamps(data) {
  const result = { ...data };
  for (const key of Object.keys(result)) {
    const value = result[key];
    if (value instanceof Timestamp) {
      result[key] = value.toDate().toISOString();
    } else if (value && typeof value === "object" && "_seconds" in value && "_nanoseconds" in value) {
      result[key] = new Date(value._seconds * 1e3).toISOString();
    }
  }
  return result;
}
var FirestoreStorage = class {
  async createMoodEntry(insertEntry) {
    const entryRef = db.collection("moodEntries").doc();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const entry = {
      id: entryRef.id,
      userId: insertEntry.userId,
      date: insertEntry.date ? new Date(insertEntry.date).toISOString() : now,
      moodValue: insertEntry.moodValue,
      emotion: insertEntry.emotion,
      reflection: insertEntry.reflection || null,
      bibleVerseReference: insertEntry.bibleVerseReference || null,
      bibleVerseText: insertEntry.bibleVerseText || null,
      createdAt: now
    };
    await entryRef.set(entry);
    return entry;
  }
  async getMoodEntriesByUser(userId) {
    const snapshot = await db.collection("moodEntries").where("userId", "==", userId).get();
    const entries = snapshot.docs.map((doc) => normalizeTimestamps(doc.data()));
    return entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async getMoodEntryById(id) {
    const doc = await db.collection("moodEntries").doc(id).get();
    return doc.exists ? normalizeTimestamps(doc.data()) : void 0;
  }
  async updateMoodEntry(id, updates) {
    const entryRef = db.collection("moodEntries").doc(id);
    await entryRef.update(updates);
    const doc = await entryRef.get();
    return doc.exists ? normalizeTimestamps(doc.data()) : void 0;
  }
  async deleteMoodEntry(id) {
    await db.collection("moodEntries").doc(id).delete();
  }
  async getMoodEntriesByDateRange(userId, startDate, endDate) {
    const snapshot = await db.collection("moodEntries").where("userId", "==", userId).where("date", ">=", startDate).where("date", "<=", endDate).get();
    const entries = snapshot.docs.map((doc) => normalizeTimestamps(doc.data()));
    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  async createUserProfile(insertProfile) {
    const profileRef = db.collection("userProfiles").doc(insertProfile.userId);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const profile = {
      id: insertProfile.userId,
      userId: insertProfile.userId,
      displayName: insertProfile.displayName || null,
      email: insertProfile.email,
      isPremium: insertProfile.isPremium || false,
      isSupporter: insertProfile.isSupporter || false,
      currentStreak: insertProfile.currentStreak || 0,
      longestStreak: insertProfile.longestStreak || 0,
      lastCheckInDate: insertProfile.lastCheckInDate || null,
      createdAt: now
    };
    await profileRef.set(profile);
    return profile;
  }
  async getUserProfile(userId) {
    const doc = await db.collection("userProfiles").doc(userId).get();
    return doc.exists ? normalizeTimestamps(doc.data()) : void 0;
  }
  async updateUserProfile(userId, updates) {
    const profileRef = db.collection("userProfiles").doc(userId);
    await profileRef.set(updates, { merge: true });
    const doc = await profileRef.get();
    return doc.exists ? normalizeTimestamps(doc.data()) : void 0;
  }
  async createUserStreak(insertStreak) {
    const streakRef = db.collection("userStreaks").doc(insertStreak.userId);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const streak = {
      id: insertStreak.userId,
      userId: insertStreak.userId,
      currentStreak: insertStreak.currentStreak || 0,
      longestStreak: insertStreak.longestStreak || 0,
      lastCheckInDate: insertStreak.lastCheckInDate || null,
      updatedAt: now
    };
    await streakRef.set(streak);
    return streak;
  }
  async getUserStreak(userId) {
    const doc = await db.collection("userStreaks").doc(userId).get();
    return doc.exists ? normalizeTimestamps(doc.data()) : void 0;
  }
  async updateUserStreak(userId, updates) {
    const streakRef = db.collection("userStreaks").doc(userId);
    const updateData = {
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await streakRef.set(updateData, { merge: true });
    const doc = await streakRef.get();
    return doc.exists ? normalizeTimestamps(doc.data()) : void 0;
  }
  async getAllAudioContent() {
    const snapshot = await db.collection("audioContent").get();
    return snapshot.docs.map((doc) => normalizeTimestamps(doc.data()));
  }
  async getAudioContentByType(type) {
    const snapshot = await db.collection("audioContent").where("type", "==", type).get();
    return snapshot.docs.map((doc) => normalizeTimestamps(doc.data()));
  }
  async getAudioContentById(id) {
    const doc = await db.collection("audioContent").doc(id).get();
    return doc.exists ? normalizeTimestamps(doc.data()) : void 0;
  }
  async getRandomAudioContent(emotion, type) {
    const snapshot = await db.collection("audioContent").where("emotion", "==", emotion).where("type", "==", type).get();
    if (snapshot.empty) {
      return void 0;
    }
    const randomIndex = Math.floor(Math.random() * snapshot.docs.length);
    return normalizeTimestamps(snapshot.docs[randomIndex].data());
  }
};
var storage = new FirestoreStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var moodEntries = pgTable("mood_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  moodValue: integer("mood_value").notNull(),
  emotion: text("emotion").notNull(),
  reflection: text("reflection"),
  bibleVerseReference: text("bible_verse_reference"),
  bibleVerseText: text("bible_verse_text"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var insertMoodEntrySchema = createInsertSchema(moodEntries).omit({
  id: true,
  createdAt: true
}).extend({
  date: z.date().or(z.string().transform((str) => new Date(str))).optional()
});
var userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  displayName: text("display_name"),
  email: text("email").notNull(),
  isPremium: boolean("is_premium").notNull().default(false),
  isSupporter: boolean("is_supporter").notNull().default(false),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastCheckInDate: timestamp("last_check_in_date"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true
});
var audioContent = pgTable("audio_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  duration: integer("duration").notNull(),
  isPremium: boolean("is_premium").notNull().default(false),
  audioUrl: text("audio_url"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var insertAudioContentSchema = createInsertSchema(audioContent).omit({
  id: true,
  createdAt: true
});
var userStreaks = pgTable("user_streaks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastCheckInDate: timestamp("last_check_in_date"),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var insertUserStreakSchema = createInsertSchema(userStreaks).omit({
  id: true,
  updatedAt: true
});

// server/routes.ts
import fs from "fs";
import path from "path";
function registerRoutes(app2) {
  app2.get("/api/verses/:emotion", async (req, res) => {
    try {
      const emotion = req.params.emotion.toLowerCase();
      const csvPath = path.join(process.cwd(), "verses", `${emotion}.csv`);
      if (!fs.existsSync(csvPath)) {
        return res.status(404).json({ error: "Verse file not found" });
      }
      const csvContent = await fs.promises.readFile(csvPath, "utf-8");
      res.set("Content-Type", "text/csv");
      res.send(csvContent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/mood-entries", async (req, res) => {
    try {
      const data = insertMoodEntrySchema.parse(req.body);
      const entry = await storage.createMoodEntry(data);
      let streak = await storage.getUserStreak(data.userId);
      if (!streak) {
        streak = await storage.createUserStreak({
          userId: data.userId,
          currentStreak: 0,
          longestStreak: 0,
          lastCheckInDate: null
        });
      }
      const now = /* @__PURE__ */ new Date();
      const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let newStreak = streak.currentStreak;
      if (streak.lastCheckInDate) {
        const lastCheckIn = new Date(streak.lastCheckInDate);
        const lastCheckInMidnight = new Date(lastCheckIn.getFullYear(), lastCheckIn.getMonth(), lastCheckIn.getDate());
        const diffMs = todayMidnight.getTime() - lastCheckInMidnight.getTime();
        const diffDays = Math.floor(diffMs / (1e3 * 60 * 60 * 24));
        if (diffDays === 0) {
          newStreak = streak.currentStreak;
        } else if (diffDays === 1) {
          newStreak = streak.currentStreak + 1;
        } else {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }
      await storage.updateUserStreak(data.userId, {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, streak.longestStreak),
        lastCheckInDate: (/* @__PURE__ */ new Date()).toISOString()
      });
      res.json(entry);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.patch("/api/mood-entries/:id", async (req, res) => {
    try {
      const entry = await storage.updateMoodEntry(req.params.id, req.body);
      if (!entry) {
        return res.status(404).json({ error: "Entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/mood-entries/:id", async (req, res) => {
    try {
      await storage.deleteMoodEntry(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/mood-entries/:userId", async (req, res) => {
    try {
      const entries = await storage.getMoodEntriesByUser(req.params.userId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/mood-entries/:userId/range", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const entries = await storage.getMoodEntriesByDateRange(
        req.params.userId,
        new Date(startDate),
        new Date(endDate)
      );
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/user-profiles", async (req, res) => {
    try {
      const data = insertUserProfileSchema.parse(req.body);
      const profile = await storage.createUserProfile(data);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/user-profiles/:userId", async (req, res) => {
    try {
      const profile = await storage.getUserProfile(req.params.userId);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/user-streaks/:userId", async (req, res) => {
    try {
      let streak = await storage.getUserStreak(req.params.userId);
      if (!streak || !streak.lastCheckInDate && streak.currentStreak === 0) {
        const entries = await storage.getMoodEntriesByUser(req.params.userId);
        if (entries.length > 0) {
          const now = /* @__PURE__ */ new Date();
          const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const uniqueDates = /* @__PURE__ */ new Set();
          entries.forEach((entry) => {
            const entryDate = new Date(entry.date);
            const dateKey = `${entryDate.getFullYear()}-${entryDate.getMonth()}-${entryDate.getDate()}`;
            uniqueDates.add(dateKey);
          });
          const sortedDates = Array.from(uniqueDates).map((dateKey) => {
            const [year, month, date] = dateKey.split("-").map(Number);
            return new Date(year, month, date);
          }).sort((a, b) => b.getTime() - a.getTime());
          let currentStreak = 0;
          let checkDate = new Date(todayMidnight);
          for (const entryDate of sortedDates) {
            const diffMs = checkDate.getTime() - entryDate.getTime();
            const diffDays = Math.floor(diffMs / (1e3 * 60 * 60 * 24));
            if (diffDays === 0) {
              currentStreak++;
              checkDate = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate() - 1);
            } else if (diffDays === 1 && currentStreak > 0) {
              currentStreak++;
              checkDate = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate() - 1);
            } else {
              break;
            }
          }
          const latestEntry = entries[0];
          const latestDate = new Date(latestEntry.date);
          streak = await storage.createUserStreak({
            userId: req.params.userId,
            currentStreak,
            longestStreak: currentStreak,
            lastCheckInDate: latestDate.toISOString()
          });
        } else {
          streak = await storage.createUserStreak({
            userId: req.params.userId,
            currentStreak: 0,
            longestStreak: 0,
            lastCheckInDate: null
          });
        }
      }
      if (streak.lastCheckInDate && streak.currentStreak > 0) {
        const now = /* @__PURE__ */ new Date();
        const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const lastCheckIn = new Date(streak.lastCheckInDate);
        const lastCheckInMidnight = new Date(lastCheckIn.getFullYear(), lastCheckIn.getMonth(), lastCheckIn.getDate());
        const diffMs = todayMidnight.getTime() - lastCheckInMidnight.getTime();
        const diffDays = Math.floor(diffMs / (1e3 * 60 * 60 * 24));
        if (diffDays > 1) {
          await storage.updateUserStreak(req.params.userId, {
            currentStreak: 0
          });
          streak.currentStreak = 0;
        }
      }
      res.json(streak);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.patch("/api/user-profiles/:userId", async (req, res) => {
    try {
      const profile = await storage.updateUserProfile(req.params.userId, req.body);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/audio-content", async (req, res) => {
    try {
      const { type } = req.query;
      const content = type ? await storage.getAudioContentByType(type) : await storage.getAllAudioContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/audio-content/:id", async (req, res) => {
    try {
      const content = await storage.getAudioContentById(req.params.id);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/audio-content/random", async (req, res) => {
    try {
      const { emotion, type } = req.query;
      if (!emotion || !type) {
        return res.status(400).json({ error: "Emotion and type are required query parameters." });
      }
      const content = await storage.getRandomAudioContent(emotion, type);
      if (!content) {
        return res.status(404).json({ error: "No audio content found for the given emotion and type." });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use("/api/stripe-webhook", express2.raw({ type: "application/json" }));
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  const port = parseInt(process.env.PORT || "5000", 10);
  const server = app.listen(port, "0.0.0.0");
  if (app.get("env") === "development") {
    await setupVite(app, server);
    log(`serving on port ${port}`);
  } else {
    serveStatic(app);
    log(`serving on port ${port}`);
  }
})();
