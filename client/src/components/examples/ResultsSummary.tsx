import ResultsSummary from '../ResultsSummary';

export default function ResultsSummaryExample() {
  return (
    <div className="p-8">
      <ResultsSummary
        totalCandidates={5}
        interviewCount={2}
        backupCount={2}
        eliminateCount={1}
      />
    </div>
  );
}
