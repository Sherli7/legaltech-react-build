import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WizardStep {
  id: number;
  title: string;
  description?: string;
}

interface WizardStepperProps {
  steps: WizardStep[];
  currentStep: number;
  className?: string;
}

export function WizardStepper({ steps, currentStep, className }: WizardStepperProps) {
  return (
    <nav aria-label="Progress" className={cn("w-full", className)}>
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isPending = step.id > currentStep;

          return (
            <li key={step.id} className={cn(
              "relative flex-1",
              index !== steps.length - 1 && "pr-8 sm:pr-20"
            )}>
              {/* Connector line */}
              {index !== steps.length - 1 && (
                <div 
                  className="absolute top-5 left-5 w-full h-0.5 bg-border"
                  aria-hidden="true"
                >
                  <div 
                    className={cn(
                      "h-full bg-primary transition-all duration-500",
                      isCompleted ? "w-full" : "w-0"
                    )}
                  />
                </div>
              )}

              <div className="relative flex flex-col items-start group">
                {/* Step circle */}
                <span className={cn(
                  "wizard-step z-10",
                  isCompleted && "wizard-step-completed",
                  isCurrent && "wizard-step-active",
                  isPending && "wizard-step-pending"
                )}>
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </span>

                {/* Step label */}
                <div className="mt-2 min-w-0">
                  <span className={cn(
                    "text-sm font-medium",
                    isCurrent && "text-primary",
                    isPending && "text-muted-foreground",
                    isCompleted && "text-foreground"
                  )}>
                    {step.title}
                  </span>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
