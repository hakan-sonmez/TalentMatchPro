import UploadZone from '../UploadZone';

export default function UploadZoneExample() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <UploadZone 
        onFilesChange={(files) => console.log('Files changed:', files)} 
        maxFiles={5}
      />
    </div>
  );
}
