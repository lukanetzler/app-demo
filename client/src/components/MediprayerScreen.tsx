import { useState, useEffect } from 'react';
import { useRandomMediprayer } from '../hooks/useRandomMediprayer';
import { getStreamingUrl } from '../lib/storageService';
import AudioPlayer from './AudioPlayer';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface MediprayerScreenProps {
  emotion: string;
  onNewEntry: () => void;
}

export const MediprayerScreen = ({ emotion, onNewEntry }: MediprayerScreenProps) => {
  const { mediprayer, loading, error } = useRandomMediprayer(emotion);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [urlLoading, setUrlLoading] = useState(false);

  // Convert gs:// URL to HTTPS download URL
  useEffect(() => {
    if (mediprayer?.url) {
      setUrlLoading(true);
      getStreamingUrl(mediprayer.url)
        .then(url => {
          setAudioUrl(url);
        })
        .catch(err => {
          console.error('Error converting mediprayer URL:', err);
        })
        .finally(() => {
          setUrlLoading(false);
        });
    }
  }, [mediprayer]);

  if (loading || urlLoading) {
    return <div>Loading Mediprayer...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (mediprayer && audioUrl) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{mediprayer.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {mediprayer.description && (
            <p className="mb-4 text-muted-foreground">{mediprayer.description}</p>
          )}
          <AudioPlayer
            title={mediprayer.title}
            subtitle="Listen and reflect"
            audioUrl={audioUrl}
            onComplete={onNewEntry}
            onSkip={onNewEntry}
            skipButtonText="Done"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>No Mediprayer Found</CardTitle>
      </CardHeader>
      <CardContent>
        <p>We couldn't find a mediprayer for "{emotion}" at the moment.</p>
        <div className="mt-4">
          <Button onClick={onNewEntry}>Start New Entry</Button>
        </div>
      </CardContent>
    </Card>
  );
};
