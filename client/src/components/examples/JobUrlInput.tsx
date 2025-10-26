import JobUrlInput from '../JobUrlInput';

export default function JobUrlInputExample() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <JobUrlInput 
        onUrlChange={(url) => console.log('URL changed:', url)}
        onValidate={(isValid) => console.log('URL valid:', isValid)}
      />
    </div>
  );
}
