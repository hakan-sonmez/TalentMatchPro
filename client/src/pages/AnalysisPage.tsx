import AnalysisProgress from '@/components/AnalysisProgress';
import ProgressSteps from '@/components/ProgressSteps';
import ThemeToggle from '@/components/ThemeToggle';
import { Sparkles } from 'lucide-react';

interface AnalysisPageProps {
  progress: number;
  statusMessage: string;
}

export default function AnalysisPage({ progress, statusMessage }: AnalysisPageProps) {
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
        <ProgressSteps currentStep="analysis" />
        <AnalysisProgress progress={progress} statusMessage={statusMessage} />
      </main>
    </div>
  );
}
