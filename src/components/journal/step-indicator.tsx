import * as React from "react";
import { FormattedNumber } from "@/components/formatted-number";
import { Check } from "@/components/icons/index";

import { cn } from "@/lib/utils";
import { AllocationType } from "@/types/entities/journal-entry.type";

type StepMeta = {
  readonly label: string;
};

const STEPS_BY_TYPE: Record<AllocationType, StepMeta[]> = {
  [AllocationType.ACCOUNT_BALANCE]: [{ label: "نوع" }, { label: "کاربر" }, { label: "حساب" }, { label: "مبلغ" }],
  [AllocationType.LOAN_REPAYMENT]: [
    { label: "نوع" },
    { label: "کاربر" },
    { label: "حساب" },
    { label: "وام" },
    { label: "اقساط" }
  ],
  [AllocationType.SUBSCRIPTION_FEE]: [{ label: "نوع" }, { label: "کاربر" }, { label: "حساب" }, { label: "ماهیانه" }]
};

type Props = {
  readonly currentStep: number;
  readonly allocationType: AllocationType | undefined;
};

function getSteps(type: AllocationType): StepMeta[] {
  switch (type) {
    case AllocationType.ACCOUNT_BALANCE:
      return STEPS_BY_TYPE[AllocationType.ACCOUNT_BALANCE];
    case AllocationType.LOAN_REPAYMENT:
      return STEPS_BY_TYPE[AllocationType.LOAN_REPAYMENT];
    case AllocationType.SUBSCRIPTION_FEE:
      return STEPS_BY_TYPE[AllocationType.SUBSCRIPTION_FEE];
  }
}

export function StepIndicator({ currentStep, allocationType }: Props) {
  const steps = allocationType ? getSteps(allocationType) : null;
  if (!steps) return null;

  return (
    <div dir="rtl" className="flex w-full items-start px-2 py-5">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={stepNumber}>
            {/* Circle + label */}
            <div className="flex shrink-0 flex-col items-center gap-1.5">
              <div
                className={cn(
                  "relative flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-all duration-300",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  isCurrent &&
                    "border-primary bg-primary text-primary-foreground shadow-[0_0_0_4px_var(--color-primary)/15]",
                  !isCompleted && !isCurrent && "border-border bg-background text-muted-foreground/50"
                )}
              >
                {isCompleted ? (
                  <Check className="size-3.5 stroke-3" />
                ) : (
                  <FormattedNumber value={stepNumber} type="normal" />
                )}
              </div>
              <span
                className={cn(
                  "text-center text-xs font-medium leading-none transition-colors duration-300",
                  isCurrent && "text-primary",
                  isCompleted && "text-muted-foreground",
                  !isCompleted && !isCurrent && "text-muted-foreground/40"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting line between circles */}
            {!isLast && (
              <div className="relative mx-1 mt-3.5 flex-1">
                <div className="h-0.5 w-full rounded-full bg-border" />
                <div
                  className={cn(
                    "absolute inset-0 h-0.5 rounded-full bg-primary transition-all duration-500 ease-out",
                    isCompleted ? "w-full" : "w-0"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
