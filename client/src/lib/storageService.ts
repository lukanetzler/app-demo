import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "./firebase";
import type { AudioContent } from "@shared/schema";

export interface BibleVerse {
  reference: string;
  text: string;
}

const versesCache: Record<string, BibleVerse[]> = {};

export async function fetchVerseCSV(emotion: string): Promise<BibleVerse[]> {
  const normalizedEmotion = emotion.toLowerCase();
  
  if (versesCache[normalizedEmotion]) {
    console.log(`Using cached verses for ${emotion}`);
    return versesCache[normalizedEmotion];
  }

  try {
    console.log(`Loading local verses for emotion: ${emotion}`);
    
    // Dynamically import the verse file
    const verseModule = await import(`@/data/verses/${normalizedEmotion}_verses.json`);
    const verses = verseModule.default as BibleVerse[];
    
    console.log(`Loaded ${verses.length} verses for ${emotion}`);
    
    if (verses.length === 0) {
      console.warn(`No verses found for ${emotion}`);
      return [];
    }
    
    versesCache[normalizedEmotion] = verses;
    return verses;
  } catch (error: any) {
    console.error(`Failed to load verses for ${emotion}:`, error?.message || error);
    console.warn(`Verse file not found for ${emotion}, will use default fallback verse`);
    return [];
  }
}

export async function getRandomVerseForEmotion(emotion: string): Promise<BibleVerse> {
  const verses = await fetchVerseCSV(emotion.toLowerCase());
  
  if (verses.length === 0) {
    return {
      reference: "Philippians 4:6-7",
      text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
    };
  }
  
  const randomIndex = Math.floor(Math.random() * verses.length);
  return verses[randomIndex];
}

export async function getRandomMediprayer(emotion: string, type: string): Promise<AudioContent | null> {
  try {
    const response = await fetch(`/api/random-audio-content?emotion=${emotion}&type=${type}`);
    if (!response.ok) {
      throw new Error('Failed to fetch random mediprayer');
    }
    const data = await response.json();
    return data as AudioContent;
  } catch (error) {
    console.error(`Failed to get random mediprayer for emotion '${emotion}':`, error);
    return null;
  }
}

export async function getRandomAudioURL(emotion: string, type: string): Promise<string> {
  const mediprayer = await getRandomMediprayer(emotion, type);
  return mediprayer?.audioPath ?? '';
}

export async function listAudioFiles(directory: string): Promise<{ name: string; url: string }[]> {
  try {
    const storageRef = ref(storage, directory);
    const result = await listAll(storageRef);
    console.log(`listAudioFiles result for ${directory}:`, result);
    
    if (result.items.length === 0) {
      console.log(`No audio files found in '${directory}'`);
      return [];
    }
    
    const files = await Promise.all(result.items.map(async (item) => {
      const url = await getDownloadURL(item);
      return { name: item.name, url };
    }));
    
    console.log(`Found ${files.length} files in ${directory}`);
    return files;
  } catch (error) {
    console.error(`Failed to list audio files from '${directory}':`, error);
    throw error;
  }
}

export async function listSubfolders(directory: string): Promise<string[]> {
  console.log(`Listing subfolders in: ${directory}`);
  
  try {
    const storageRef = ref(storage, directory);
    const result = await listAll(storageRef);
    console.log(`listSubfolders result for ${directory}:`, result);
    
        let subfolders: string[] = [];
    
        if (result.prefixes.length > 0) {
          subfolders = result.prefixes.map(prefixRef => prefixRef.name);
        } else if (result.items.length > 0) {
          // If no explicit prefixes, try to infer from item paths
          const uniqueSubfolders = new Set<string>();
          result.items.forEach(itemRef => {
            const pathSegments = itemRef.fullPath.split('/');
            // The subfolder name would be the segment after the base directory
            // e.g., for 'mediprayers_free/worry/file.mp3', 'worry' is the subfolder
            const baseDirSegments = directory.split('/');
            if (pathSegments.length > baseDirSegments.length) {
              uniqueSubfolders.add(pathSegments[baseDirSegments.length]);
            }
          });
          subfolders = Array.from(uniqueSubfolders);
        }    
    console.log(`Found ${subfolders.length} subfolders in ${directory}`);
    return subfolders;
  } catch (error) {
    console.error(`Failed to list subfolders in '${directory}':`, error);
    throw error;
  }
}

export async function fetchRandomAudioContent(emotion: string, type: string): Promise<{ audioUrl: string; duration: number } | null> {
  try {
    const audioUrl = await getRandomAudioURL(emotion, type);
    if (!audioUrl) {
      return null;
    }

    const duration = await new Promise<number>((resolve, reject) => {
      const audio = new Audio(audioUrl);
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration);
      });
      audio.addEventListener('error', (e) => {
        reject(e);
      });
    });

        return { audioUrl, duration };

      } catch (error) {

        console.error(`Failed to fetch random audio content for emotion '${emotion}':`, error);

        return null;

      }

    }

    

    export const getStreamingUrl = async (gsUrl: string): Promise<string | null> => {

      try {

        // 1. Convert the gs:// URL to a reference

        const storageRef = ref(storage, gsUrl);

        

        // 2. Get the direct download URL

        const url = await getDownloadURL(storageRef);

        return url;

      } catch (error) {

        console.error("Error getting download URL:", error);

        return null;

      }

    };

    