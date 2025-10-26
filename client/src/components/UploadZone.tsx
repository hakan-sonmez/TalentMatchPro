import { useCallback, useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface UploadZoneProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
}

export default function UploadZone({ onFilesChange, maxFiles = 5 }: UploadZoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf' || 
              file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
              file.type === 'application/msword'
    );
    
    const newFiles = [...files, ...droppedFiles].slice(0, maxFiles);
    setFiles(newFiles);
    onFilesChange(newFiles);
  }, [files, maxFiles, onFilesChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newFiles = [...files, ...selectedFiles].slice(0, maxFiles);
      setFiles(newFiles);
      onFilesChange(newFiles);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border'
        }`}
        data-testid="dropzone-upload"
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">Drop resume files here</h3>
        <p className="text-sm text-muted-foreground mb-4">
          or click to browse (PDF, DOCX, DOC)
        </p>
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.doc"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          data-testid="input-file-upload"
        />
        <label htmlFor="file-upload">
          <Button variant="outline" asChild data-testid="button-browse-files">
            <span className="cursor-pointer">Browse Files</span>
          </Button>
        </label>
        <p className="text-xs text-muted-foreground mt-4">
          {files.length} / {maxFiles} resumes uploaded
        </p>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {files.map((file, index) => (
            <Card key={index} className="p-4 relative" data-testid={`card-file-${index}`}>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => removeFile(index)}
                data-testid={`button-remove-file-${index}`}
              >
                <X className="w-4 h-4" />
              </Button>
              <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-xs font-medium truncate" title={file.name}>
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatFileSize(file.size)}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
