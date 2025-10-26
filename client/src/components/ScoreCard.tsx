import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';

export type CategoryType = 'interview' | 'backup' | 'eliminate';

interface ScoreCardProps {
  candidateName: string;
  fileName: string;
  score: number;
  category: CategoryType;
  rank: number;
}

const getCategoryConfig = (category: CategoryType) => {
  switch (category) {
    case 'interview':
      return {
        label: 'INTERVIEW LIST',
        className: 'bg-green-600 text-white hover:bg-green-600',
      };
    case 'backup':
      return {
        label: 'BACKUP LIST',
        className: 'bg-amber-600 text-white hover:bg-amber-600',
      };
    case 'eliminate':
      return {
        label: 'ELIMINATE LIST',
        className: 'bg-red-600 text-white hover:bg-red-600',
      };
  }
};

const getRankDisplay = (rank: number) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return rank.toString();
};

export default function ScoreCard({ candidateName, fileName, score, category, rank }: ScoreCardProps) {
  const categoryConfig = getCategoryConfig(category);

  return (
    <Card className="p-6 relative hover-elevate" data-testid={`card-candidate-${rank}`}>
      <div className="absolute top-4 right-4">
        <Badge className={categoryConfig.className} data-testid={`badge-category-${rank}`}>
          {categoryConfig.label}
        </Badge>
      </div>
      
      <div className="flex items-start gap-4 mb-4">
        <div className="text-2xl font-bold w-10 text-center" data-testid={`text-rank-${rank}`}>
          {getRankDisplay(rank)}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1" data-testid={`text-candidate-name-${rank}`}>
            {candidateName}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span className="truncate" title={fileName} data-testid={`text-filename-${rank}`}>
              {fileName}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl font-bold font-mono mb-1" data-testid={`text-score-${rank}`}>
            {score}
          </div>
          <div className="text-sm text-muted-foreground font-mono">/ 100</div>
        </div>
      </div>
    </Card>
  );
}
