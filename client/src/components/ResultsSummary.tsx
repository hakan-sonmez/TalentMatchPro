import { Card } from '@/components/ui/card';
import { Users, UserCheck, UserMinus, UserX } from 'lucide-react';

interface ResultsSummaryProps {
  totalCandidates: number;
  interviewCount: number;
  backupCount: number;
  eliminateCount: number;
}

export default function ResultsSummary({ 
  totalCandidates, 
  interviewCount, 
  backupCount, 
  eliminateCount 
}: ResultsSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Analyzed</p>
            <p className="text-2xl font-bold font-mono" data-testid="text-total-candidates">
              {totalCandidates}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-green-600/10">
            <UserCheck className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Interview Ready</p>
            <p className="text-2xl font-bold font-mono" data-testid="text-interview-count">
              {interviewCount}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-600/10">
            <UserMinus className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Backup List</p>
            <p className="text-2xl font-bold font-mono" data-testid="text-backup-count">
              {backupCount}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-red-600/10">
            <UserX className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Eliminated</p>
            <p className="text-2xl font-bold font-mono" data-testid="text-eliminate-count">
              {eliminateCount}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
