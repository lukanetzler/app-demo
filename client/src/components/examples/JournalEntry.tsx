import JournalEntry from '../JournalEntry';

export default function JournalEntryExample() {
  return (
    <JournalEntry
      date="January 15, 2025"
      moodValue={4}
      emotion="Grateful"
      reflection="Today was a wonderful day. I felt God's presence in the small moments and found joy in simple things. The morning prayer time was particularly meaningful."
      bibleVerse={{
        reference: "Psalm 118:24",
        text: "This is the day that the Lord has made; let us rejoice and be glad in it."
      }}
      onClick={() => console.log('Entry clicked')}
    />
  );
}
