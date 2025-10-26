import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface AnalysisProgressProps {
  progress: number;
  statusMessage: string;
}

export default function AnalysisProgress({ progress, statusMessage }: AnalysisProgressProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="p-12 max-w-lg w-full text-center">
        <Loader2 className="w-16 h-16 mx-auto mb-6 text-primary animate-spin" data-testid="icon-loading" />
        <h2 className="text-2xl font-semibold mb-4">Analyzing Resumes</h2>
        <p className="text-muted-foreground mb-6" data-testid="text-status-message">
          {statusMessage}
        </p>
        <Progress value={progress} className="mb-2" data-testid="progress-bar" />
        <p className="text-sm text-muted-foreground font-mono" data-testid="text-progress-percentage">
          {progress}%
        </p>
      </Card>
    </div>
  );
}
