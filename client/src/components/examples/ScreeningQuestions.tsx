import ScreeningQuestions from '../ScreeningQuestions';

export default function ScreeningQuestionsExample() {
  const genericQuestions = [
    "Can you tell me about your current role and what attracted you to this position?",
    "What are your salary expectations for this role?",
    "When would you be available to start if offered the position?"
  ];

  const topCandidateQuestions = [
    "I noticed you have extensive experience with cloud infrastructure. Can you describe a complex migration project you've led?",
    "Your resume mentions implementing CI/CD pipelines. What tools and methodologies do you prefer?",
    "How do you approach mentoring junior engineers on your team?"
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <ScreeningQuestions
        genericQuestions={genericQuestions}
        topCandidateQuestions={topCandidateQuestions}
        topCandidateName="Sarah Johnson"
      />
    </div>
  );
}
