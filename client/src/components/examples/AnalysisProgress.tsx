import { useState, useEffect } from 'react';
import AnalysisProgress from '../AnalysisProgress';

export default function AnalysisProgressExample() {
  const [progress, setProgress] = useState(0);
  const messages = [
    'Extracting resume text...',
    'Fetching job description...',
    'Analyzing candidate qualifications...',
    'Calculating match scores...',
    'Generating screening questions...'
  ];
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        if (prev >= 80) setMessageIndex(4);
        else if (prev >= 60) setMessageIndex(3);
        else if (prev >= 40) setMessageIndex(2);
        else if (prev >= 20) setMessageIndex(1);
        return prev + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8">
      <AnalysisProgress 
        progress={progress} 
        statusMessage={messages[messageIndex]} 
      />
    </div>
  );
}
