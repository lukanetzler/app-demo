import EmotionSelector from '../EmotionSelector';

export default function EmotionSelectorExample() {
  return <EmotionSelector onSelect={(emotion) => console.log('Selected emotion:', emotion)} />;
}
