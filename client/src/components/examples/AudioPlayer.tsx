import AudioPlayer from '../AudioPlayer';

export default function AudioPlayerExample() {
  return (
    <AudioPlayer
      title="Morning Mediprayer"
      subtitle="Start your day with peace"
      duration={180}
      onComplete={() => console.log('Audio completed')}
      onSkip={() => console.log('Audio skipped')}
    />
  );
}
