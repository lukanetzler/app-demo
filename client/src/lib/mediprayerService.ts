/**
 * Mediprayer Service
 * Handles loading and managing mediprayer audio files from JSON data
 */

// Import all mediprayer JSON files
import anger from "@/data/mediprayers/anger_mp.json";
import anxiety from "@/data/mediprayers/anxiety_mp.json";
import arrogance from "@/data/mediprayers/arrogance_mp.json";
import bitterness from "@/data/mediprayers/bitterness_mp.json";
import blessed from "@/data/mediprayers/blessed_mp.json";
import depression from "@/data/mediprayers/depression_mp.json";
import doubt from "@/data/mediprayers/doubt_mp.json";
import embarrassment from "@/data/mediprayers/embarrassment_mp.json";
import envy from "@/data/mediprayers/envy_mp.json";
import greed from "@/data/mediprayers/greed_mp.json";
import grief from "@/data/mediprayers/grief_mp.json";
import guilt from "@/data/mediprayers/guilt_mp.json";
import happy from "@/data/mediprayers/happy_mp.json";
import hopeless from "@/data/mediprayers/hopeless_mp.json";
import intolerant from "@/data/mediprayers/intolerant_mp.json";
import judgement from "@/data/mediprayers/judgement_mp.json";
import lonely from "@/data/mediprayers/lonely_mp.json";
import lost from "@/data/mediprayers/lost_mp.json";
import motivated from "@/data/mediprayers/motivated_mp.json";
import pride from "@/data/mediprayers/pride_mp.json";
import purposeless from "@/data/mediprayers/purposeless_mp.json";
import regret from "@/data/mediprayers/regret_mp.json";
import resentment from "@/data/mediprayers/resentment_mp.json";
import shame from "@/data/mediprayers/shame_mp.json";
import spiritual_doubt from "@/data/mediprayers/spiritual_doubt_mp.json";
import temptation from "@/data/mediprayers/temptation_mp.json";
import tired from "@/data/mediprayers/tired_mp.json";
import unconfident from "@/data/mediprayers/unconfident_mp.json";
import vanity from "@/data/mediprayers/vanity_mp.json";
import worry from "@/data/mediprayers/worry_mp.json";

export interface Mediprayer {
  url: string;
  title: string;
  description: string;
}

// Helper function to validate if data is a valid Mediprayer array
function isMediprayerArray(data: any): data is Mediprayer[] {
  return Array.isArray(data) && (
    data.length === 0 ||
    (data[0] && 'url' in data[0] && 'title' in data[0])
  );
}

// Map emotion names to their JSON data
// Note: Some JSON files may contain incorrect data structure (e.g., Bible verses)
const mediprayerMap: Record<string, Mediprayer[]> = {
  anger: isMediprayerArray(anger) ? anger : [],
  anxiety: isMediprayerArray(anxiety) ? anxiety : [],
  arrogance: isMediprayerArray(arrogance) ? arrogance : [],
  bitterness: isMediprayerArray(bitterness) ? bitterness : [],
  blessed: isMediprayerArray(blessed) ? blessed : [],
  depression: isMediprayerArray(depression) ? depression : [],
  doubt: isMediprayerArray(doubt) ? doubt : [],
  embarrassment: isMediprayerArray(embarrassment) ? embarrassment : [],
  envy: isMediprayerArray(envy) ? envy : [],
  greed: isMediprayerArray(greed) ? greed : [],
  grief: isMediprayerArray(grief) ? grief : [],
  guilt: isMediprayerArray(guilt) ? guilt : [],
  happy: isMediprayerArray(happy) ? happy : [],
  hopeless: isMediprayerArray(hopeless) ? hopeless : [],
  intolerant: isMediprayerArray(intolerant) ? intolerant : [],
  judgement: isMediprayerArray(judgement) ? judgement : [],
  lonely: isMediprayerArray(lonely) ? lonely : [],
  lost: isMediprayerArray(lost) ? lost : [],
  motivated: isMediprayerArray(motivated) ? motivated : [],
  pride: isMediprayerArray(pride) ? pride : [],
  purposeless: isMediprayerArray(purposeless) ? purposeless : [],
  regret: isMediprayerArray(regret) ? regret : [],
  resentment: isMediprayerArray(resentment) ? resentment : [],
  shame: isMediprayerArray(shame) ? shame : [],
  spiritual_doubt: isMediprayerArray(spiritual_doubt) ? spiritual_doubt : [],
  temptation: isMediprayerArray(temptation) ? temptation : [],
  tired: isMediprayerArray(tired) ? tired : [],
  unconfident: isMediprayerArray(unconfident) ? unconfident : [],
  vanity: isMediprayerArray(vanity) ? vanity : [],
  worry: isMediprayerArray(worry) ? worry : [],
};

/**
 * Get all mediprayers for a specific emotion
 */
export function getMediprayersForEmotion(emotion: string | null): Mediprayer[] {
  if (!emotion) return [];

  // Normalize emotion name (lowercase, replace spaces with underscores)
  const normalizedEmotion = emotion.toLowerCase().replace(/\s+/g, "_");

  const mediprayers = mediprayerMap[normalizedEmotion];

  // Filter out any invalid entries (empty URLs)
  return mediprayers?.filter(m => m.url && m.title) || [];
}

/**
 * Get a random mediprayer for a specific emotion
 */
export function getRandomMediprayer(emotion: string | null): Mediprayer | null {
  const mediprayers = getMediprayersForEmotion(emotion);

  if (mediprayers.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * mediprayers.length);
  return mediprayers[randomIndex];
}

/**
 * Get all mediprayers across all emotions (for library page)
 */
export function getAllMediprayers(): Mediprayer[] {
  const allMediprayers: Mediprayer[] = [];

  Object.values(mediprayerMap).forEach(emotionMediprayers => {
    // Filter out invalid entries
    const validMediprayers = emotionMediprayers.filter(m => m.url && m.title);
    allMediprayers.push(...validMediprayers);
  });

  return allMediprayers;
}

/**
 * Get count of mediprayers for an emotion (useful for UI)
 */
export function getMediprayerCount(emotion: string | null): number {
  return getMediprayersForEmotion(emotion).length;
}

/**
 * Get list of all available emotions that have mediprayers
 */
export function getAvailableEmotions(): string[] {
  return Object.keys(mediprayerMap)
    .filter(emotion => mediprayerMap[emotion].length > 0)
    .map(emotion => emotion.replace(/_/g, ' ')) // Convert underscores to spaces for display
    .sort();
}
