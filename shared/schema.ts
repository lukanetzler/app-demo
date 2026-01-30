import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const moodEntries = pgTable("mood_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  moodValue: integer("mood_value").notNull(),
  emotion: text("emotion").notNull(),
  reflection: text("reflection"),
  bibleVerseReference: text("bible_verse_reference"),
  bibleVerseText: text("bible_verse_text"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMoodEntrySchema = createInsertSchema(moodEntries).omit({
  id: true,
  createdAt: true,
}).extend({
  date: z.date().or(z.string().transform((str) => new Date(str))).optional(),
});

export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
export type MoodEntry = typeof moodEntries.$inferSelect;

export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  displayName: text("display_name"),
  email: text("email").notNull(),
  isPremium: boolean("is_premium").notNull().default(false),
  isSupporter: boolean("is_supporter").notNull().default(false),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastCheckInDate: timestamp("last_check_in_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
});

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;

export const audioContent = pgTable("audio_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  duration: integer("duration").notNull(),
  isPremium: boolean("is_premium").notNull().default(false),
  audioUrl: text("audio_url"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAudioContentSchema = createInsertSchema(audioContent).omit({
  id: true,
  createdAt: true,
});

export type InsertAudioContent = z.infer<typeof insertAudioContentSchema>;
export type AudioContent = typeof audioContent.$inferSelect;

export const userStreaks = pgTable("user_streaks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastCheckInDate: timestamp("last_check_in_date"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserStreakSchema = createInsertSchema(userStreaks).omit({
  id: true,
  updatedAt: true,
});

export type InsertUserStreak = z.infer<typeof insertUserStreakSchema>;
export type UserStreak = typeof userStreaks.$inferSelect;
