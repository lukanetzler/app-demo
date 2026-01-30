import { useState, useEffect, useCallback } from 'react';
import { listAudioFiles, listSubfolders } from '@/lib/storageService';

interface AudioFile {
  name: string;
  url: string;
}

export function useLibraryContent() {
  const [mediprayerEmotions, setMediprayerEmotions] = useState<string[]>([]);
  const [stories, setStories] = useState<AudioFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mediprayersCache, setMediprayersCache] = useState<Record<string, AudioFile[]>>({});

  useEffect(() => {
    const fetchInitialContent = async () => {
      setIsLoading(true);
      try {
        // Fetch mediprayer emotions
        const emotions = await listSubfolders('mediprayers_free');
        setMediprayerEmotions(emotions);

        // Fetch stories
        const biblestoriesPromise = listAudioFiles('biblestories');
        const bedtimestoriesPromise = listAudioFiles('bedtimestories');

        const [biblestoriesResult, bedtimestoriesResult] = await Promise.all([
          biblestoriesPromise,
          bedtimestoriesPromise,
        ]);

        setStories([...biblestoriesResult, ...bedtimestoriesResult]);
      } catch (error) {
        console.error("Failed to fetch library content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialContent();
  }, []);

  const getMediprayersByEmotion = useCallback(async (emotion: string): Promise<AudioFile[]> => {
    if (mediprayersCache[emotion]) {
      return mediprayersCache[emotion];
    }
    const path = `mediprayers_free/${emotion}`;
    const files = await listAudioFiles(path);
    setMediprayersCache(prev => ({ ...prev, [emotion]: files }));
    return files;
  }, [mediprayersCache]);

  return { mediprayerEmotions, getMediprayersByEmotion, stories, isLoading };
}
