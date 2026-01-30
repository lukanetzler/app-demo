import type { Express } from "express";
import { storage } from "./storage";
import { insertMoodEntrySchema, insertUserProfileSchema } from "@shared/schema";
import fs from "fs";
import path from "path";

export function registerRoutes(app: Express) {
  // Serve CSV files from verses folder
  app.get("/api/verses/:emotion", async (req, res) => {
    try {
      const emotion = req.params.emotion.toLowerCase();
      const csvPath = path.join(process.cwd(), "verses", `${emotion}.csv`);
      
      if (!fs.existsSync(csvPath)) {
        return res.status(404).json({ error: "Verse file not found" });
      }
      
      const csvContent = await fs.promises.readFile(csvPath, "utf-8");
      res.set("Content-Type", "text/csv");
      res.send(csvContent);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/mood-entries", async (req, res) => {
    try {
      const data = insertMoodEntrySchema.parse(req.body);
      const entry = await storage.createMoodEntry(data);

      let streak = await storage.getUserStreak(data.userId);

      if (!streak) {
        streak = await storage.createUserStreak({
          userId: data.userId,
          currentStreak: 0,
          longestStreak: 0,
          lastCheckInDate: null,
        });
      }

      const now = new Date();
      const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      let newStreak = streak.currentStreak;

      if (streak.lastCheckInDate) {
        const lastCheckIn = new Date(streak.lastCheckInDate);
        const lastCheckInMidnight = new Date(lastCheckIn.getFullYear(), lastCheckIn.getMonth(), lastCheckIn.getDate());
        const diffMs = todayMidnight.getTime() - lastCheckInMidnight.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

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
        lastCheckInDate: new Date().toISOString() as any,
      });

      res.json(entry);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/mood-entries/:id", async (req, res) => {
    try {
      const entry = await storage.updateMoodEntry(req.params.id, req.body);
      if (!entry) {
        return res.status(404).json({ error: "Entry not found" });
      }
      res.json(entry);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/mood-entries/:id", async (req, res) => {
    try {
      await storage.deleteMoodEntry(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/mood-entries/:userId", async (req, res) => {
    try {
      const entries = await storage.getMoodEntriesByUser(req.params.userId);
      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/mood-entries/:userId/range", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const entries = await storage.getMoodEntriesByDateRange(
        req.params.userId,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/user-profiles", async (req, res) => {
    try {
      const data = insertUserProfileSchema.parse(req.body);
      const profile = await storage.createUserProfile(data);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/user-profiles/:userId", async (req, res) => {
    try {
      const profile = await storage.getUserProfile(req.params.userId);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/user-streaks/:userId", async (req, res) => {
    try {
      let streak = await storage.getUserStreak(req.params.userId);

      if (!streak || (!streak.lastCheckInDate && streak.currentStreak === 0)) {
        const entries = await storage.getMoodEntriesByUser(req.params.userId);

        if (entries.length > 0) {
          const now = new Date();
          const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

          const uniqueDates = new Set<string>();
          entries.forEach(entry => {
            const entryDate = new Date(entry.date);
            const dateKey = `${entryDate.getFullYear()}-${entryDate.getMonth()}-${entryDate.getDate()}`;
            uniqueDates.add(dateKey);
          });

          const sortedDates = Array.from(uniqueDates)
            .map(dateKey => {
              const [year, month, date] = dateKey.split('-').map(Number);
              return new Date(year, month, date);
            })
            .sort((a, b) => b.getTime() - a.getTime());

          let currentStreak = 0;
          let checkDate = new Date(todayMidnight);

          for (const entryDate of sortedDates) {
            const diffMs = checkDate.getTime() - entryDate.getTime();
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

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
            currentStreak: currentStreak,
            longestStreak: currentStreak,
            lastCheckInDate: latestDate.toISOString() as any,
          });
        } else {
          streak = await storage.createUserStreak({
            userId: req.params.userId,
            currentStreak: 0,
            longestStreak: 0,
            lastCheckInDate: null,
          });
        }
      }

      if (streak.lastCheckInDate && streak.currentStreak > 0) {
        const now = new Date();
        const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const lastCheckIn = new Date(streak.lastCheckInDate);
        const lastCheckInMidnight = new Date(lastCheckIn.getFullYear(), lastCheckIn.getMonth(), lastCheckIn.getDate());
        const diffMs = todayMidnight.getTime() - lastCheckInMidnight.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays > 1) {
          await storage.updateUserStreak(req.params.userId, {
            currentStreak: 0,
          });
          streak.currentStreak = 0;
        }
      }

      res.json(streak);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/user-profiles/:userId", async (req, res) => {
    try {
      const profile = await storage.updateUserProfile(req.params.userId, req.body);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/audio-content", async (req, res) => {
    try {
      const { type } = req.query;
      const content = type
        ? await storage.getAudioContentByType(type as string)
        : await storage.getAllAudioContent();
      res.json(content);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/audio-content/:id", async (req, res) => {
    try {
      const content = await storage.getAudioContentById(req.params.id);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/audio-content/random", async (req, res) => {
    try {
      const { emotion, type } = req.query;
      if (!emotion || !type) {
        return res.status(400).json({ error: "Emotion and type are required query parameters." });
      }
      const content = await storage.getRandomAudioContent(emotion as string, type as string);
      if (!content) {
        return res.status(404).json({ error: "No audio content found for the given emotion and type." });
      }
      res.json(content);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
