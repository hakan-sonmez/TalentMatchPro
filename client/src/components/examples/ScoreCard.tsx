import ScoreCard from '../ScoreCard';

export default function ScoreCardExample() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ScoreCard
          candidateName="Sarah Johnson"
          fileName="sarah_johnson_resume.pdf"
          score={92}
          category="interview"
          rank={1}
        />
        <ScoreCard
          candidateName="Michael Chen"
          fileName="michael_chen_cv.docx"
          score={75}
          category="backup"
          rank={2}
        />
        <ScoreCard
          candidateName="Emily Davis"
          fileName="emily_davis_resume.pdf"
          score={48}
          category="eliminate"
          rank={3}
        />
      </div>
    </div>
  );
}
