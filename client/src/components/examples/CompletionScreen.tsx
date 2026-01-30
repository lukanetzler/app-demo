import CompletionScreen from '../CompletionScreen';

export default function CompletionScreenExample() {
  return <CompletionScreen onContinue={() => console.log('Continue clicked')} />;
}
