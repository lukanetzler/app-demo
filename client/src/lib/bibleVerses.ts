import { getRandomVerseForEmotion } from "./storageService";

export interface BibleVerse {
  reference: string;
  text: string;
}

export async function getVerseForEmotion(emotion: string): Promise<BibleVerse> {
  return await getRandomVerseForEmotion(emotion);
}
