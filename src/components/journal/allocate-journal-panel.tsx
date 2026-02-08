"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import { StepOne } from "./step-one";
import { StepSelectFee } from "./step-select-fee";
import { StepSelectInstallment } from "./step-select-installment";
import { StepSelectLoan } from "./step-select-loan";
import { useResponsivePanelElements } from "./use-responsive-panel-elements";

type Props = {
  journal: Journal;
  onSuccess?: () => void;
};

// Maps allocation types to their corresponding journal entry target types
const ALLOCATION_TO_TARGET_MAP: Record<AllocationType, JournalEntryTarget> = {
  [AllocationType.ACCOUNT_BALANCE]: JournalEntryTarget.ACCOUNT,
  [AllocationType.LOAN_REPAYMENT]: JournalEntryTarget.INSTALLMENT,
  [AllocationType.SUBSCRIPTION_FEE]: JournalEntryTarget.SUBSCRIPTION_FEE
};

// ...existing code...

export function AllocateJournalPanel({ onSuccess, journal }: Props) {
  const [open, setOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState<Partial<AllocationFormData>>({ items: [] });
  const isMobile = useIsMobile();
  const addEntryMutation = useCreateMultipleJournalEntries();
  const unbalancedAmount = calculateUnbalancedAmount(journal.entries);
  const queryClient = useQueryClient();
  const { CloseButton, Header, Title, Description, Footer } = useResponsivePanelElements(isMobile);

  const resetForm = React.useCallback(() => {
    setCurrentStep(1);
    setFormData({ items: [] });
  }, []);

  const handleClose = React.useCallback(() => {
    setOpen(false);
    resetForm();
  }, [resetForm]);

  const handleNext = React.useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const handleBack = React.useCallback(() => {
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

  const getTotalSteps = React.useCallback(() => {
    if (!formData.allocationType) return 1;
    if (formData.allocationType === AllocationType.ACCOUNT_BALANCE) return 2;
    if (formData.allocationType === AllocationType.LOAN_REPAYMENT) return 3;
    return 2;
  }, [formData.allocationType]);
  const totalSteps = getTotalSteps();

  const getCanProceedFlags = React.useCallback(
    () => ({
      fromStep1: !!(formData.userId && formData.allocationType && formData.accountId),
      fromStep2:
        formData.allocationType === AllocationType.LOAN_REPAYMENT
          ? !!formData.loanId
          : !!(formData.items && formData.items.length > 0),
      canSubmit: !!(formData.items && formData.items.length > 0)
    }),
    [formData]
  );
  const canProceed = getCanProceedFlags();

  const getStepDescription = React.useCallback(() => {
    if (currentStep === 1) return "کاربر، نوع و حساب را انتخاب کنید";
    if (currentStep === 2) {
      if (formData.allocationType === AllocationType.ACCOUNT_BALANCE) return "مبلغ را وارد کنید";
      if (formData.allocationType === AllocationType.LOAN_REPAYMENT) return "وام را انتخاب کنید";
      if (formData.allocationType === AllocationType.SUBSCRIPTION_FEE) return "یک یا چند ماهیانه را انتخاب کنید";
    }
    if (formData.allocationType === AllocationType.LOAN_REPAYMENT && currentStep === 3) {
      return "یک یا چند قسط را انتخاب کنید";
    }
    return "";
  }, [currentStep, formData.allocationType]);

  const renderCurrentStep = React.useCallback(() => {
    if (currentStep === 1) return <StepOne formData={formData} setFormData={setFormData} />;
    if (currentStep === 2) {
      if (formData.allocationType === AllocationType.ACCOUNT_BALANCE)
        return (
          <AccountBalanceAmountStep formData={formData} setFormData={setFormData} unbalancedAmount={unbalancedAmount} />
        );
      if (formData.allocationType === AllocationType.LOAN_REPAYMENT)
        return <StepSelectLoan formData={formData} setFormData={setFormData} />;
      if (formData.allocationType === AllocationType.SUBSCRIPTION_FEE)
        return <StepSelectFee formData={formData} setFormData={setFormData} />;
    }
    if (formData.allocationType === AllocationType.LOAN_REPAYMENT && currentStep === 3) {
      return <StepSelectInstallment formData={formData} setFormData={setFormData} />;
    }
    return null;
  }, [currentStep, formData, setFormData, unbalancedAmount]);

  const isNextDisabled = React.useCallback(() => {
    if (currentStep === 1) return !canProceed.fromStep1;
    if (currentStep === 2) return !canProceed.fromStep2;
    return false;
  }, [currentStep, canProceed]);
  const isLastStep = currentStep === totalSteps;

  return (
    <>
      <AllocateJournalTrigger onClick={() => setOpen(true)} />
      <ResponsivePanel open={open} onOpenChange={setOpen}>
        <Header>
          <Title>تخصیص ثبت حسابداری</Title>
          <Description>{getStepDescription()}</Description>
        </Header>
        <div className="flex-1  space-y-4 overflow-auto">{renderCurrentStep()}</div>
        <Footer>
          <AllocateJournalFooter
            isLastStep={isLastStep}
            canSubmit={canProceed.canSubmit}
            onSubmit={handleSubmit}
            onNext={handleNext}
            isNextDisabled={isNextDisabled()}
            onClose={handleClose}
            CloseButton={CloseButton}
            currentStep={currentStep}
            onBack={handleBack}
          />
        </Footer>
      </ResponsivePanel>
    </>
  );
}
