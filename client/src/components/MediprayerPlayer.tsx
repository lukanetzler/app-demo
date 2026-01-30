import { useState, useEffect } from 'react';
import AudioPlayer from '@/components/AudioPlayer';
import { fetchRandomAudioContent } from '@/lib/storageService';
import { Button } from '@/components/ui/button';

interface MediprayerPlayerProps {
    emotion: string;
    onComplete: () => void;
    onSkip: () => void;
}

export default function MediprayerPlayer({ emotion, onComplete, onSkip }: MediprayerPlayerProps) {
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [duration, setDuration] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAudio = async () => {
            setLoading(true);
            const result = await fetchRandomAudioContent(emotion.toLowerCase(), 'mediprayer');
            if (result) {
                setAudioUrl(result.audioUrl);
                setDuration(result.duration);
            } else {
                setAudioUrl(null);
                setDuration(0);
            }
            setLoading(false);
        };

        if (emotion) {
            fetchAudio();
        }
    }, [emotion]);

    if (loading) {
        return <div className="text-center">Loading Mediprayer...</div>;
    }

    if (!audioUrl) {
        return (
            <div className="text-center">
                <p className="mb-4">Could not find a mediprayer for "{emotion}".</p>
                <Button onClick={onSkip}>Continue</Button>
            </div>
        );
    }

    return (
        <AudioPlayer
            title={`${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Mediprayer`}
            subtitle="Guided prayer and meditation"
            duration={duration}
            audioUrl={audioUrl}
            onComplete={onComplete}
            onSkip={onSkip}
            skipButtonText="Done"
        />
    );
};