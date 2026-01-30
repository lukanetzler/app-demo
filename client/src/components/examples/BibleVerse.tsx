import BibleVerse from '../BibleVerse';

export default function BibleVerseExample() {
  return (
    <BibleVerse
      reference="Philippians 4:6-7"
      text="Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus."
      onSave={() => console.log('Saved to journal')}
    />
  );
}
