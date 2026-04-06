import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Step {
  label: string;
  content: ReactNode;
}

interface StepWizardProps {
  steps: Step[];
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
  canContinue?: boolean;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const StepWizard = ({
  steps,
  currentStep,
  onNext,
  onBack,
  canContinue = true,
  isSubmitting = false,
  submitLabel = "Submit Booking Request",
}: StepWizardProps) => {
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-sans font-medium transition-colors ${
                  i <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              <span className="text-xs font-sans text-muted-foreground mt-1 hidden md:block text-center">
                {step.label}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[400px] animate-fade-in" key={currentStep}>
        {steps[currentStep]?.content}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={currentStep === 0}
          className="font-sans"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!canContinue || isSubmitting}
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-sans uppercase tracking-wide px-8"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Submitting...
            </span>
          ) : isLast ? (
            submitLabel
          ) : (
            <>Continue <ChevronRight className="h-4 w-4 ml-1" /></>
          )}
        </Button>
      </div>
    </div>
  );
};

export default StepWizard;
