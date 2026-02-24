"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight } from "@/components/icons/index";
import { ResponsivePanel } from "@/components/ui/responsive-panel";
import { useCreateMultipleJournalEntries } from "@/hooks/admin/use-journal-entries";
import { transactionKeys } from "@/hooks/admin/use-transaction";
import { useIsMobile } from "@/hooks/general/use-mobile";
import { AllocationType, JournalEntryTarget } from "@/types/entities/journal-entry.type";
import type { Journal } from "@/types/entities/journal.type";
import { AccountBalanceAmountStep } from "./account-balance-amount-step";
import { AllocateJournalFooter } from "./allocate-journal-footer";
import type { AllocationFormData } from "./allocate-journal-panel.types";
import { AllocateJournalTrigger } from "./allocate-journal-trigger";
import { calculateUnbalancedAmount } from "./calculate-unbalanced-amount";
import { StepIndicator } from "./step-indicator";
import { StepOne } from "./step-one";
import { StepSelectAccount } from "./step-select-account";
import { StepSelectFee } from "./step-select-fee";
import { StepSelectInstallment } from "./step-select-installment";
import { StepSelectLoan } from "./step-select-loan";
import { StepSelectUser } from "./step-select-user-account";
import { useResponsivePanelElements } from "./use-responsive-panel-elements";

type Props = {
  journal: Journal;
  onSuccess?: () => void;
};

const ALLOCATION_TO_TARGET_MAP: Record<AllocationType, JournalEntryTarget> = {
  [AllocationType.ACCOUNT_BALANCE]: JournalEntryTarget.ACCOUNT,
  [AllocationType.LOAN_REPAYMENT]: JournalEntryTarget.INSTALLMENT,
  [AllocationType.SUBSCRIPTION_FEE]: JournalEntryTarget.SUBSCRIPTION_FEE
};

export function AllocateJournalPanel({ onSuccess, journal }: Props) {
  const [open, setOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [direction, setDirection] = React.useState<1 | -1>(1);
  const [formData, setFormData] = React.useState<Partial<AllocationFormData>>({ items: [] });
  const isMobile = useIsMobile();
  const addEntryMutation = useCreateMultipleJournalEntries();
  const unbalancedAmount = calculateUnbalancedAmount(journal.entries);
  const queryClient = useQueryClient();
  const { CloseButton, Header, Title, Description, Footer } = useResponsivePanelElements(isMobile);

  const resetForm = React.useCallback(() => {
    setCurrentStep(1);
    setDirection(1);
    setFormData({ items: [] });
  }, []);

  const handleClose = React.useCallback(() => {
    setOpen(false);
    resetForm();
  }, [resetForm]);

  const handleNext = React.useCallback(() => {
    setDirection(1);
    setCurrentStep((prev) => prev + 1);
  }, []);

  const handleBack = React.useCallback(() => {
    setDirection(-1);
    setCurrentStep((prev) => prev - 1);
  }, []);

  const handleSubmit = React.useCallback(() => {
    if (!formData.allocationType || !formData.items || formData.items.length === 0) return;
    addEntryMutation.mutate(
      {
        journalId: journal.id,
        targetType: ALLOCATION_TO_TARGET_MAP[formData.allocationType],
        allocationType: formData.allocationType,
        items: formData.items
      },
      {
        onSuccess: () => {
          if (journal.transactionId) {
            queryClient.invalidateQueries({ queryKey: transactionKeys.detail(journal.transactionId) });
          }
          queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
          onSuccess?.();
          setOpen(false);
          resetForm();
        }
      }
    );
  }, [formData, addEntryMutation, journal, queryClient, onSuccess, resetForm]);

  // Step flow: 1=type, 2=user, 3=account, 4=amount/loan/fee, 5=installments (loan only)
  const canProceed = React.useMemo(
    () => ({
      fromStep2: !!formData.userId,
      fromStep3:
        formData.allocationType === AllocationType.SUBSCRIPTION_FEE
          ? (formData.accountIds?.length ?? 0) > 0
          : !!formData.accountId,
      fromStep4:
        formData.allocationType === AllocationType.LOAN_REPAYMENT
          ? !!formData.loanId
          : !!(formData.items && formData.items.length > 0),
      canSubmit: !!(formData.items && formData.items.length > 0)
    }),
    [formData]
  );

  const stepDescription = React.useMemo(() => {
    if (currentStep === 1) return "نوع تخصیص را انتخاب کنید";
    if (currentStep === 2) return "کاربر را انتخاب کنید";
    if (currentStep === 3)
      return formData.allocationType === AllocationType.SUBSCRIPTION_FEE
        ? "حساب‌ها را انتخاب کنید"
        : "حساب را انتخاب کنید";
    if (currentStep === 4) {
      if (formData.allocationType === AllocationType.ACCOUNT_BALANCE) return "مبلغ را وارد کنید";
      if (formData.allocationType === AllocationType.LOAN_REPAYMENT) return "وام را انتخاب کنید";
      if (formData.allocationType === AllocationType.SUBSCRIPTION_FEE) return "ماهیانه‌ها را انتخاب کنید";
    }
    if (currentStep === 5) return "اقساط را انتخاب کنید";
    return "";
  }, [currentStep, formData.allocationType]);

  const isNextDisabled = React.useMemo(() => {
    if (currentStep === 2) return !canProceed.fromStep2;
    if (currentStep === 3) return !canProceed.fromStep3;
    if (currentStep === 4) return !canProceed.fromStep4;
    return false;
  }, [currentStep, canProceed]);

  const isLastStep =
    (formData.allocationType === AllocationType.LOAN_REPAYMENT && currentStep === 5) ||
    (formData.allocationType !== AllocationType.LOAN_REPAYMENT && currentStep === 4);

  const renderStep = React.useCallback(() => {
    if (currentStep === 1) return <StepOne formData={formData} setFormData={setFormData} onNext={handleNext} />;
    if (currentStep === 2) return <StepSelectUser formData={formData} setFormData={setFormData} onNext={handleNext} />;
    if (currentStep === 3) return <StepSelectAccount formData={formData} setFormData={setFormData} />;
    if (currentStep === 4) {
      if (formData.allocationType === AllocationType.ACCOUNT_BALANCE)
        return (
          <AccountBalanceAmountStep formData={formData} setFormData={setFormData} unbalancedAmount={unbalancedAmount} />
        );
      if (formData.allocationType === AllocationType.LOAN_REPAYMENT)
        return <StepSelectLoan formData={formData} setFormData={setFormData} />;
      if (formData.allocationType === AllocationType.SUBSCRIPTION_FEE)
        return <StepSelectFee formData={formData} setFormData={setFormData} />;
    }
    if (currentStep === 5) return <StepSelectInstallment formData={formData} setFormData={setFormData} />;
    return null;
  }, [currentStep, formData, handleNext, unbalancedAmount]);

  return (
    <>
      <AllocateJournalTrigger onClick={() => setOpen(true)} />
      <ResponsivePanel open={open} onOpenChange={setOpen}>
        <Header>
          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="بازگشت"
              >
                <ChevronRight className="size-4" />
              </button>
            )}
            <Title className="flex-1">تخصیص ثبت حسابداری</Title>
          </div>
          {currentStep > 1 && <StepIndicator currentStep={currentStep} allocationType={formData.allocationType} />}
          <Description>{stepDescription}</Description>
        </Header>

        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={{
                enter: (dir: number) => ({ x: dir * -40, opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit: (dir: number) => ({ x: dir * 40, opacity: 0 })
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="space-y-4"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        <Footer>
          <AllocateJournalFooter
            isLastStep={isLastStep}
            canSubmit={canProceed.canSubmit}
            onSubmit={handleSubmit}
            onNext={handleNext}
            isNextDisabled={isNextDisabled}
            onClose={handleClose}
            CloseButton={CloseButton}
            currentStep={currentStep}
          />
        </Footer>
      </ResponsivePanel>
    </>
  );
}
