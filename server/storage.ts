import {
  type MoodEntry,
  type InsertMoodEntry,
  type UserProfile,
  type InsertUserProfile,
  type AudioContent,
  type InsertAudioContent,
  type UserStreak,
  type InsertUserStreak
} from "@shared/schema";
import { randomUUID } from "crypto";
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import serviceAccount from '../daily-breaditation-firebase-adminsdk-fbsvc-245b95c1a1.json';

initializeApp({
  credential: cert(serviceAccount as any),
});

const db = getFirestore();

// Convert Firestore Timestamp fields to ISO strings so they serialize properly via JSON
function normalizeTimestamps<T>(data: Record<string, any>): T {
  const result = { ...data };
  for (const key of Object.keys(result)) {
    const value = result[key];
    if (value instanceof Timestamp) {
      result[key] = value.toDate().toISOString();
    } else if (value && typeof value === 'object' && '_seconds' in value && '_nanoseconds' in value) {
      // Handle plain objects that look like serialized Timestamps
      result[key] = new Date(value._seconds * 1000).toISOString();
    }
  }
  return result as T;
}

export interface IStorage {
  createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry>;
  getMoodEntriesByUser(userId: string): Promise<MoodEntry[]>;
  getMoodEntryById(id: string): Promise<MoodEntry | undefined>;
  updateMoodEntry(id: string, updates: Partial<MoodEntry>): Promise<MoodEntry | undefined>;
  deleteMoodEntry(id: string): Promise<void>;
  getMoodEntriesByDateRange(userId: string, startDate: Date, endDate: Date): Promise<MoodEntry[]>;

  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined>;

  createUserStreak(streak: InsertUserStreak): Promise<UserStreak>;
  getUserStreak(userId: string): Promise<UserStreak | undefined>;
  updateUserStreak(userId: string, updates: Partial<UserStreak>): Promise<UserStreak | undefined>;

  getAllAudioContent(): Promise<AudioContent[]>;
  getAudioContentByType(type: string): Promise<AudioContent[]>;
  getAudioContentById(id: string): Promise<AudioContent | undefined>;
}

export class FirestoreStorage implements IStorage {
  async createMoodEntry(insertEntry: InsertMoodEntry): Promise<MoodEntry> {
    const entryRef = db.collection('moodEntries').doc();
    const now = new Date().toISOString();
    const entry: MoodEntry = {
      id: entryRef.id,
      userId: insertEntry.userId,
      date: insertEntry.date ? new Date(insertEntry.date).toISOString() as any : now as any,
      moodValue: insertEntry.moodValue,
      emotion: insertEntry.emotion,
      reflection: insertEntry.reflection || null,
      bibleVerseReference: insertEntry.bibleVerseReference || null,
      bibleVerseText: insertEntry.bibleVerseText || null,
      createdAt: now as any,
    };
    await entryRef.set(entry);
    return entry;
  }

  async getMoodEntriesByUser(userId: string): Promise<MoodEntry[]> {
    const snapshot = await db.collection('moodEntries')
      .where('userId', '==', userId)
      .get();
    const entries = snapshot.docs.map(doc => normalizeTimestamps<MoodEntry>(doc.data()));
    return entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getMoodEntryById(id: string): Promise<MoodEntry | undefined> {
    const doc = await db.collection('moodEntries').doc(id).get();
    return doc.exists ? normalizeTimestamps<MoodEntry>(doc.data()!) : undefined;
  }

  async updateMoodEntry(
    id: string,
    updates: Partial<MoodEntry>
  ): Promise<MoodEntry | undefined> {
    const entryRef = db.collection('moodEntries').doc(id);
    await entryRef.update(updates);
    const doc = await entryRef.get();
    return doc.exists ? normalizeTimestamps<MoodEntry>(doc.data()!) : undefined;
  }

  async deleteMoodEntry(id: string): Promise<void> {
    await db.collection('moodEntries').doc(id).delete();
  }

  async getMoodEntriesByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<MoodEntry[]> {
    const snapshot = await db.collection('moodEntries')
      .where('userId', '==', userId)
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .get();
    const entries = snapshot.docs.map(doc => normalizeTimestamps<MoodEntry>(doc.data()));
    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const profileRef = db.collection('userProfiles').doc(insertProfile.userId);
    const now = new Date().toISOString();
    const profile: UserProfile = {
      id: insertProfile.userId,
      userId: insertProfile.userId,
      displayName: insertProfile.displayName || null,
      email: insertProfile.email,
      isPremium: insertProfile.isPremium || false,
      isSupporter: insertProfile.isSupporter || false,
      currentStreak: insertProfile.currentStreak || 0,
      longestStreak: insertProfile.longestStreak || 0,
      lastCheckInDate: insertProfile.lastCheckInDate || null,
      createdAt: now as any,
    };
    await profileRef.set(profile);
    return profile;
  }

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const doc = await db.collection('userProfiles').doc(userId).get();
    return doc.exists ? normalizeTimestamps<UserProfile>(doc.data()!) : undefined;
  }

  async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile | undefined> {
    const profileRef = db.collection('userProfiles').doc(userId);
    await profileRef.set(updates, { merge: true });
    const doc = await profileRef.get();
    return doc.exists ? normalizeTimestamps<UserProfile>(doc.data()!) : undefined;
  }

  async createUserStreak(insertStreak: InsertUserStreak): Promise<UserStreak> {
    const streakRef = db.collection('userStreaks').doc(insertStreak.userId);
    const now = new Date().toISOString();
    const streak: UserStreak = {
      id: insertStreak.userId,
      userId: insertStreak.userId,
      currentStreak: insertStreak.currentStreak || 0,
      longestStreak: insertStreak.longestStreak || 0,
      lastCheckInDate: insertStreak.lastCheckInDate || null,
      updatedAt: now as any,
    };
    await streakRef.set(streak);
    return streak;
  }

  async getUserStreak(userId: string): Promise<UserStreak | undefined> {
    const doc = await db.collection('userStreaks').doc(userId).get();
    return doc.exists ? normalizeTimestamps<UserStreak>(doc.data()!) : undefined;
  }

  async updateUserStreak(
    userId: string,
    updates: Partial<UserStreak>
  ): Promise<UserStreak | undefined> {
    const streakRef = db.collection('userStreaks').doc(userId);
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await streakRef.set(updateData, { merge: true });
    const doc = await streakRef.get();
    return doc.exists ? normalizeTimestamps<UserStreak>(doc.data()!) : undefined;
  }

  async getAllAudioContent(): Promise<AudioContent[]> {
    const snapshot = await db.collection('audioContent').get();
    return snapshot.docs.map(doc => normalizeTimestamps<AudioContent>(doc.data()));
  }
  async getAudioContentByType(type: string): Promise<AudioContent[]> {
    const snapshot = await db.collection('audioContent').where('type', '==', type).get();
    return snapshot.docs.map(doc => normalizeTimestamps<AudioContent>(doc.data()));
  }
  async getAudioContentById(id: string): Promise<AudioContent | undefined> {
    const doc = await db.collection('audioContent').doc(id).get();
    return doc.exists ? normalizeTimestamps<AudioContent>(doc.data()!) : undefined;
  }
  async getRandomAudioContent(emotion: string, type: string): Promise<AudioContent | undefined> {
    const snapshot = await db.collection('audioContent')
      .where('emotion', '==', emotion)
      .where('type', '==', type)
      .get();
    if (snapshot.empty) {
      return undefined;
    }
    const randomIndex = Math.floor(Math.random() * snapshot.docs.length);
    return normalizeTimestamps<AudioContent>(snapshot.docs[randomIndex].data());
  }
}

export const storage = new FirestoreStorage();
