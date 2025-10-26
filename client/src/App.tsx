import { useState, useEffect } from 'react';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import UploadPage from '@/pages/UploadPage';
import AnalysisPage from '@/pages/AnalysisPage';
import ResultsPage, { type CandidateResult } from '@/pages/ResultsPage';

type AppState = 'upload' | 'analysis' | 'results';

//todo: remove mock functionality
const mockCandidates: CandidateResult[] = [
  {
    candidateName: 'Sarah Johnson',
    fileName: 'sarah_johnson_resume.pdf',
    score: 92,
    category: 'interview',
    rank: 1,
  },
  {
    candidateName: 'Michael Chen',
    fileName: 'michael_chen_cv.docx',
    score: 85,
    category: 'interview',
    rank: 2,
  },
  {
    candidateName: 'Emily Davis',
    fileName: 'emily_davis_resume.pdf',
    score: 72,
    category: 'backup',
    rank: 3,
  },
  {
    candidateName: 'James Wilson',
    fileName: 'james_wilson_cv.pdf',
    score: 68,
    category: 'backup',
    rank: 4,
  },
  {
    candidateName: 'Lisa Anderson',
    fileName: 'lisa_anderson_resume.docx',
    score: 48,
    category: 'eliminate',
    rank: 5,
  },
];

//todo: remove mock functionality
const mockGenericQuestions = [
  "Can you tell me about your current role and what attracted you to this position?",
  "What are your salary expectations for this role?",
  "When would you be available to start if offered the position?"
];

//todo: remove mock functionality
const mockSpecificQuestions = [
  "I noticed you have extensive experience with cloud infrastructure. Can you describe a complex AWS migration project you've led?",
  "Your resume mentions implementing CI/CD pipelines at scale. What tools and methodologies do you prefer and why?",
  "How do you approach mentoring junior engineers and fostering a culture of continuous learning on your team?"
];

function App() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  const handleAnalyze = (files: File[], jobUrl: string) => {
    console.log('Analyzing files:', files, 'Job URL:', jobUrl);
    setAppState('analysis');
    setProgress(0);
    
    //todo: remove mock functionality - simulate analysis progress
    const messages = [
      'Extracting resume text...',
      'Fetching job description...',
      'Analyzing candidate qualifications...',
      'Calculating match scores...',
      'Generating screening questions...'
    ];
    
    let currentProgress = 0;
    let messageIndex = 0;
    
    const interval = setInterval(() => {
      currentProgress += 5;
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setAppState('results');
        }, 500);
        return;
      }
      
      setProgress(currentProgress);
      
      if (currentProgress >= 80) messageIndex = 4;
      else if (currentProgress >= 60) messageIndex = 3;
      else if (currentProgress >= 40) messageIndex = 2;
      else if (currentProgress >= 20) messageIndex = 1;
      
      setStatusMessage(messages[messageIndex]);
    }, 200);
  };

  const handleStartNew = () => {
    setAppState('upload');
    setProgress(0);
    setStatusMessage('');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {appState === 'upload' && (
          <UploadPage onAnalyze={handleAnalyze} />
        )}
        {appState === 'analysis' && (
          <AnalysisPage progress={progress} statusMessage={statusMessage} />
        )}
        {appState === 'results' && (
          <ResultsPage
            candidates={mockCandidates}
            genericQuestions={mockGenericQuestions}
            specificQuestions={mockSpecificQuestions}
            topCandidateName={mockCandidates[0].candidateName}
            onStartNew={handleStartNew}
          />
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
