import { Check } from 'lucide-react';

type Step = 'upload' | 'analysis' | 'results';

interface ProgressStepsProps {
  currentStep: Step;
}

const steps = [
  { id: 'upload' as Step, label: 'Upload', number: 1 },
  { id: 'analysis' as Step, label: 'Analysis', number: 2 },
  { id: 'results' as Step, label: 'Results', number: 3 },
];

export default function ProgressSteps({ currentStep }: ProgressStepsProps) {
  const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);
  const currentIndex = getCurrentStepIndex();

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1 ml-[20px] mr-[20px] pl-[0px] pr-[0px]">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-medium transition-colors ${
                    isCompleted
                      ? 'bg-primary border-primary text-primary-foreground'
                      : isCurrent
                      ? 'border-primary text-primary'
                      : 'border-border text-muted-foreground'
                  }`}
                  data-testid={`step-${step.id}`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : step.number}
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    isCurrent ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-4 transition-colors ${
                    isCompleted ? 'bg-primary' : 'bg-border'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
