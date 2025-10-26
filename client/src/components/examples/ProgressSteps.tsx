import { useState } from 'react';
import ProgressSteps from '../ProgressSteps';
import { Button } from '@/components/ui/button';

export default function ProgressStepsExample() {
  const [currentStep, setCurrentStep] = useState<'upload' | 'analysis' | 'results'>('upload');

  return (
    <div className="p-8">
      <ProgressSteps currentStep={currentStep} />
      <div className="flex gap-4 justify-center mt-8">
        <Button onClick={() => setCurrentStep('upload')} variant="outline">
          Upload
        </Button>
        <Button onClick={() => setCurrentStep('analysis')} variant="outline">
          Analysis
        </Button>
        <Button onClick={() => setCurrentStep('results')} variant="outline">
          Results
        </Button>
      </div>
    </div>
  );
}
