import LibraryCard from '../LibraryCard';

export default function LibraryCardExample() {
  return (
    <div className="grid gap-4">
      <LibraryCard
        title="Peace in the Storm"
        description="Find calm and comfort in God's presence during difficult times"
        duration={300}
        type="Mediprayer"
        isPremium={false}
        onClick={() => console.log('Clicked')}
      />
      <LibraryCard
        title="Guided Scripture Meditation"
        description="Meditate on God's word with guided breathing and reflection"
        duration={600}
        type="Meditation"
        isPremium={true}
        onClick={() => console.log('Clicked')}
      />
    </div>
  );
}
