import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UploadZone from '@/components/UploadZone';
import JobUrlInput from '@/components/JobUrlInput';
import ProgressSteps from '@/components/ProgressSteps';
import ThemeToggle from '@/components/ThemeToggle';
import { Sparkles, Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadPageProps {
  onAnalyze: (files: File[], jobUrl: string, hiringManagerEmail?: string) => void;
}

export default function UploadPage({ onAnalyze }: UploadPageProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [jobUrl, setJobUrl] = useState('');
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);

  const validateEmail = (value: string) => {
    if (!value) {
      setIsEmailValid(null);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(value));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handleEmailBlur = () => {
    validateEmail(email);
  };

  const canAnalyze = files.length > 0 && files.length <= 5 && jobUrl && isUrlValid;

  const handleAnalyze = () => {
    if (canAnalyze) {
      onAnalyze(files, jobUrl, email || undefined);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">AI Recruiter</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <ProgressSteps currentStep="upload" />

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Smart Resume Analysis and Recommendations</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upload candidate resumes and provide the job description URL. Our AI will analyze, 
              score, and rank candidates, then generate tailored screening questions.
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <JobUrlInput 
                onUrlChange={setJobUrl}
                onValidate={setIsUrlValid}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hiring-manager-email" className="text-base font-medium">
                Hiring Manager Email <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="hiring-manager-email"
                  type="email"
                  placeholder="manager@company.com"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  className="pl-10 pr-10"
                  data-testid="input-hiring-manager-email"
                />
                {isEmailValid !== null && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isEmailValid ? (
                      <CheckCircle className="w-5 h-5 text-green-600" data-testid="icon-email-valid" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-destructive" data-testid="icon-email-invalid" />
                    )}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Analysis results will be sent to this email address
              </p>
              {isEmailValid === false && (
                <p className="text-sm text-destructive" data-testid="text-email-error">
                  Please enter a valid email address
                </p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Upload Candidate Resumes</h3>
              <UploadZone 
                onFilesChange={setFiles}
                maxFiles={5}
              />
            </div>

            <div className="flex justify-center pt-8">
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                className="px-8"
                data-testid="button-analyze"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Analyze Resumes
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
