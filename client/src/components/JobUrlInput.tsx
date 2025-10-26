import { useState } from 'react';
import { Link as LinkIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface JobUrlInputProps {
  onUrlChange: (url: string) => void;
  onValidate?: (isValid: boolean) => void;
}

export default function JobUrlInput({ onUrlChange, onValidate }: JobUrlInputProps) {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateUrl = (value: string) => {
    if (!value) {
      setIsValid(null);
      onValidate?.(false);
      return;
    }
    
    try {
      new URL(value);
      setIsValid(true);
      onValidate?.(true);
    } catch {
      setIsValid(false);
      onValidate?.(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    onUrlChange(value);
  };

  const handleBlur = () => {
    validateUrl(url);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="job-url" className="text-base font-medium">
        Job Description URL
      </Label>
      <div className="relative">
        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          id="job-url"
          type="url"
          placeholder="https://example.com/job-posting"
          value={url}
          onChange={handleChange}
          onBlur={handleBlur}
          className="pl-10 pr-10"
          data-testid="input-job-url"
        />
        {isValid !== null && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid ? (
              <CheckCircle className="w-5 h-5 text-green-600" data-testid="icon-url-valid" />
            ) : (
              <AlertCircle className="w-5 h-5 text-destructive" data-testid="icon-url-invalid" />
            )}
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        Paste the URL of the job description to analyze against
      </p>
      {isValid === false && (
        <p className="text-sm text-destructive" data-testid="text-url-error">
          Please enter a valid URL
        </p>
      )}
    </div>
  );
}
