import * as React from "react";
import { Button } from "../ui/button";

export type AllocateJournalFooterProps = {
  isLastStep: boolean;
  canSubmit: boolean;
  onSubmit: () => void;
  onNext: () => void;
  isNextDisabled: boolean;
  onClose: () => void;
  CloseButton: React.ElementType;
  currentStep: number;
  onBack: () => void;
};

export function AllocateJournalFooter({
  isLastStep,
  canSubmit,
  onSubmit,
  onNext,
  isNextDisabled,
  onClose,
  CloseButton,
  currentStep,
  onBack
}: AllocateJournalFooterProps) {
  return (
    <div className="flex gap-2 w-full ">
      {isLastStep ? (
        <Button
          onClick={onSubmit}
          disabled={!canSubmit}
          data-slot="button"
          data-size="sm"
          variant="default"
          className="flex-1"
        >
          تخصیص
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={isNextDisabled}
          data-slot="button"
          data-size="sm"
          variant="default"
          className="flex-1"
        >
          بعدی
        </Button>
      )}
      <CloseButton asChild>
        <Button type="button" variant="outline" data-slot="button" data-size="sm" onClick={onClose}>
          لغو
        </Button>
      </CloseButton>
      {currentStep > 1 && (
        <Button type="button" variant="outline" data-slot="button" data-size="sm" onClick={onBack}>
          بازگشت
        </Button>
      )}
    </div>
  );
}
