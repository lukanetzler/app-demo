import MoodSelector from '../MoodSelector';

export default function MoodSelectorExample() {
  return <MoodSelector onSelect={(value) => console.log('Selected mood:', value)} />;
}
