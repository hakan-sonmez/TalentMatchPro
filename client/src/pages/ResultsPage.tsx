import { Button } from '@/components/ui/button';
import ScoreCard, { type CategoryType } from '@/components/ScoreCard';
import ScreeningQuestions from '@/components/ScreeningQuestions';
import ResultsSummary from '@/components/ResultsSummary';
import ProgressSteps from '@/components/ProgressSteps';
import ThemeToggle from '@/components/ThemeToggle';
import { Sparkles, RotateCcw } from 'lucide-react';

export interface CandidateResult {
  candidateName: string;
  fileName: string;
  score: number;
  category: CategoryType;
  rank: number;
}

interface ResultsPageProps {
  candidates: CandidateResult[];
  genericQuestions: string[];
  specificQuestions: string[];
  topCandidateName: string;
  onStartNew: () => void;
}

export default function ResultsPage({ 
  candidates, 
  genericQuestions, 
  specificQuestions,
  topCandidateName,
  onStartNew 
}: ResultsPageProps) {
  const interviewCount = candidates.filter(c => c.category === 'interview').length;
  const backupCount = candidates.filter(c => c.category === 'backup').length;
  const eliminateCount = candidates.filter(c => c.category === 'eliminate').length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">AI Recruiter</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={onStartNew}
              data-testid="button-start-new"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <ProgressSteps currentStep="results" />

        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Analysis Complete</h2>
            <p className="text-muted-foreground">
              {candidates.length} candidates analyzed and ranked
            </p>
          </div>

          <ResultsSummary
            totalCandidates={candidates.length}
            interviewCount={interviewCount}
            backupCount={backupCount}
            eliminateCount={eliminateCount}
          />

          <div>
            <h2 className="text-xl font-semibold mb-6">Candidate Rankings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((candidate) => (
                <ScoreCard
                  key={candidate.rank}
                  candidateName={candidate.candidateName}
                  fileName={candidate.fileName}
                  score={candidate.score}
                  category={candidate.category}
                  rank={candidate.rank}
                />
              ))}
            </div>
          </div>

          <ScreeningQuestions
            genericQuestions={genericQuestions}
            topCandidateQuestions={specificQuestions}
            topCandidateName={topCandidateName}
          />
        </div>
      </main>
    </div>
  );
}
