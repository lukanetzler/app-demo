import ReflectionInput from '../ReflectionInput';

export default function ReflectionInputExample() {
  return (
    <ReflectionInput
      onSave={(text) => console.log('Saved:', text)}
      onSkip={() => console.log('Skipped')}
    />
  );
}
