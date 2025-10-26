import { useState } from 'react';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient, apiRequest } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';
import UploadPage from '@/pages/UploadPage';
import AnalysisPage from '@/pages/AnalysisPage';
import ResultsPage, { type CandidateResult } from '@/pages/ResultsPage';
import type { AnalysisResponse } from '@shared/schema';

type AppState = 'upload' | 'analysis' | 'results';

function AppContent() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResponse | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async (files: File[], jobUrl: string) => {
    console.log('Starting analysis with files:', files, 'Job URL:', jobUrl);
    setAppState('analysis');
    setProgress(0);
    
    const messages = [
      'Uploading resume files...',
      'Fetching job description...',
      'Extracting resume text...',
      'Analyzing candidate qualifications...',
      'Calculating match scores...',
      'Generating screening questions...'
    ];
    
    let currentProgress = 0;
    let messageIndex = 0;
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      currentProgress += 3;
      if (currentProgress >= 95) {
        clearInterval(progressInterval);
        return;
      }
      
      setProgress(currentProgress);
      
      if (currentProgress >= 80) messageIndex = 5;
      else if (currentProgress >= 65) messageIndex = 4;
      else if (currentProgress >= 50) messageIndex = 3;
      else if (currentProgress >= 35) messageIndex = 2;
      else if (currentProgress >= 20) messageIndex = 1;
      
      setStatusMessage(messages[messageIndex]);
    }, 400);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('jobUrl', jobUrl);
      files.forEach((file) => {
        formData.append('resumes', file);
      });

      // Call the backend API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze resumes');
      }

      const data: AnalysisResponse = await response.json();
      
      clearInterval(progressInterval);
      setProgress(100);
      setStatusMessage('Analysis complete!');
      
      setTimeout(() => {
        setAnalysisResults(data);
        setAppState('results');
      }, 500);
      
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Analysis error:', error);
      
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
      
      setAppState('upload');
    }
  };

  const handleStartNew = () => {
    setAppState('upload');
    setProgress(0);
    setStatusMessage('');
    setAnalysisResults(null);
  };

  return (
    <>
      {appState === 'upload' && (
        <UploadPage onAnalyze={handleAnalyze} />
      )}
      {appState === 'analysis' && (
        <AnalysisPage progress={progress} statusMessage={statusMessage} />
      )}
      {appState === 'results' && analysisResults && (
        <ResultsPage
          candidates={analysisResults.candidates}
          genericQuestions={analysisResults.genericQuestions}
          specificQuestions={analysisResults.specificQuestions}
          topCandidateName={analysisResults.topCandidateName}
          onStartNew={handleStartNew}
        />
      )}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
