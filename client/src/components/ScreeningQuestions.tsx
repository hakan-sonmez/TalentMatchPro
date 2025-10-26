import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';

interface ScreeningQuestionsProps {
  genericQuestions: string[];
  topCandidateQuestions: string[];
  topCandidateName: string;
}

export default function ScreeningQuestions({ 
  genericQuestions, 
  topCandidateQuestions, 
  topCandidateName 
}: ScreeningQuestionsProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Phone Screening Questions</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Use these questions to evaluate candidates during initial phone screenings
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Generic Questions (For All Candidates)</h3>
        <div className="space-y-4">
          {genericQuestions.map((question, index) => (
            <div key={index} className="flex gap-3" data-testid={`generic-question-${index + 1}`}>
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <p className="text-base flex-1 pt-0.5">{question}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-medium">
            Top Candidate Questions for{' '}
            <span className="text-primary" data-testid="text-top-candidate-name">
              {topCandidateName}
            </span>
          </h3>
        </div>
        <div className="space-y-4">
          {topCandidateQuestions.map((question, index) => (
            <div key={index} className="flex gap-3" data-testid={`specific-question-${index + 1}`}>
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <p className="text-base flex-1 pt-0.5">{question}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
