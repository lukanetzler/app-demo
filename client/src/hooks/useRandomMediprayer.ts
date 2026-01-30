import { useState, useEffect } from 'react';
import { getRandomMediprayer, type Mediprayer } from '../lib/mediprayerService';

export const useRandomMediprayer = (emotion: string | null) => {
  const [mediprayer, setMediprayer] = useState<Mediprayer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!emotion) {
      setMediprayer(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get random mediprayer from JSON files (synchronous)
      const randomMediprayer = getRandomMediprayer(emotion);

      if (!randomMediprayer) {
        setError(new Error(`No mediprayers found for emotion: ${emotion}`));
      }

      setMediprayer(randomMediprayer);
    } catch (err) {
      console.error("Error getting random mediprayer:", err);
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('An unknown error occurred'));
      }
    } finally {
      setLoading(false);
    }
  }, [emotion]);

  return { mediprayer, loading, error };
};
