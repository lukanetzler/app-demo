import { useState } from "react";

export function useFirebaseContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The useEffect that was here previously has been removed 
  // because the initializeAudioCache function it was calling 
  // is not implemented in @/lib/storageService.ts.
  // This hook can be updated in the future to support audio caching.

  return { isLoading, error };
}
