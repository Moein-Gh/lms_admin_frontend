"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Split } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrawerClose, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResponsivePanel } from "@/components/ui/responsive-panel";
import { useCreateJournalEntry } from "@/hooks/use-journal-entries";
import { useIsMobile } from "@/hooks/use-mobile";
import { transactionKeys } from "@/hooks/use-transaction";
import { AllocationType, JournalEntryTarget } from "@/types/entities/journal-entry.type";
import type { Journal } from "@/types/entities/journal.type";
import type { AllocationFormData } from "./allocate-journal-panel.types";
import { StepOne } from "./step-one";
import { StepSelectAccount } from "./step-select-account";
import { StepSelectFee } from "./step-select-fee";
import { StepSelectInstallment } from "./step-select-installment";
import { StepSelectLoan } from "./step-select-loan";

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

function calculateUnbalancedAmount(entries: Journal["entries"]) {
  const account2050Entries = entries?.filter((entry) => entry.ledgerAccount?.code === "2050") ?? [];
  const totalDebit = account2050Entries.reduce(
    (sum, entry) => (entry.dc === "DEBIT" ? sum + Number(entry.amount) : sum),
    0
  );
  const totalCredit = account2050Entries.reduce(
    (sum, entry) => (entry.dc === "CREDIT" ? sum + Number(entry.amount) : sum),
    0
  );
  const amount = Math.abs(totalDebit - totalCredit);
  return amount;
}

export function AllocateJournalPanel({ onSuccess, journal }: Props) {
  const [open, setOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState<Partial<AllocationFormData>>({});
  const isMobile = useIsMobile();

  const addEntryMutation = useCreateJournalEntry();
  const unbalancedAmount = calculateUnbalancedAmount(journal.entries);
  const queryClient = useQueryClient();

  const CloseButton = isMobile ? DrawerClose : DialogClose;
  const Header = isMobile ? DrawerHeader : DialogHeader;
  const Title = isMobile ? DrawerTitle : DialogTitle;
  const Description = isMobile ? DrawerDescription : DialogDescription;
  const Footer = isMobile ? DrawerFooter : DialogFooter;

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({});
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    if (!formData.allocationType || !formData.amount || !formData.targetId) return;

    addEntryMutation.mutate(
      {
        journalId: journal.id,
        amount: Number(formData.amount),
        targetType: ALLOCATION_TO_TARGET_MAP[formData.allocationType],
        targetId: formData.targetId,
        allocationType: formData.allocationType
      },
      {
        onSuccess: () => {
          // Invalidate the transaction detail so pages showing the transaction refresh
          if (journal.transactionId) {
            queryClient.invalidateQueries({ queryKey: transactionKeys.detail(journal.transactionId) });
          }
          // Also refresh transaction lists
          queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });

          onSuccess?.();
          setOpen(false);
          resetForm();
        }
      }
    );
  };

  // Determine total steps based on allocation type
  const getTotalSteps = () => {
    if (!formData.allocationType) return 1;
    if (formData.allocationType === AllocationType.ACCOUNT_BALANCE) return 3;
    if (formData.allocationType === AllocationType.LOAN_REPAYMENT) return 4;
    // AllocationType.SUBSCRIPTION_FEE
    return 3;
  };

  const totalSteps = getTotalSteps();

  const getCanProceedFlags = () => ({
    fromStep1: formData.userId && formData.allocationType,
    fromStep2: !!formData.accountId,
    fromStep3:
      formData.allocationType === AllocationType.LOAN_REPAYMENT ||
      formData.allocationType === AllocationType.SUBSCRIPTION_FEE
        ? !!formData.loanId
        : !!(formData.targetId && formData.amount),
    canSubmit: !!(formData.targetId && formData.amount)
  });

  const canProceed = getCanProceedFlags();

  const getStepDescription = () => {
    if (currentStep === 1) return "کاربر و نوع تخصیص را انتخاب کنید";
    if (currentStep === 2) return "حساب کاربر را انتخاب کنید";
    if (formData.allocationType === AllocationType.LOAN_REPAYMENT) {
      if (currentStep === 3) return "وام را انتخاب کنید";
      if (currentStep === 4) return "قسط را انتخاب کنید";
    }
    if (formData.allocationType === AllocationType.SUBSCRIPTION_FEE && currentStep === 3) {
      return "هزینه اشتراک را انتخاب کنید";
    }
    if (formData.allocationType === AllocationType.ACCOUNT_BALANCE && currentStep === 3) {
      return "مبلغ را وارد کنید";
    }
    return "";
  };

  const renderStep1 = () => <StepOne formData={formData} setFormData={setFormData} />;

  const renderStep2 = () => <StepSelectAccount formData={formData} setFormData={setFormData} />;

  const renderAccountBalanceStep3 = () => (
    <div className="space-y-2">
      <Label htmlFor="amount">مبلغ</Label>
      <Input
        id="amount"
        type="number"
        placeholder={unbalancedAmount ? `مبلغ پیشنهادی: ${unbalancedAmount}` : "مبلغ را وارد کنید"}
        value={formData.amount ?? ""}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        min="0"
        step="0.01"
      />
      {unbalancedAmount > 0 && (
        <p className="text-sm text-muted-foreground">
          مبلغ عدم تعادل حساب ۲۰۵۰: {unbalancedAmount.toLocaleString("fa-IR")}
        </p>
      )}
    </div>
  );

  const renderCurrentStep = () => {
    if (currentStep === 1) return renderStep1();
    if (currentStep === 2) return renderStep2();

    if (formData.allocationType === AllocationType.ACCOUNT_BALANCE && currentStep === 3) {
      return renderAccountBalanceStep3();
    }

    if (formData.allocationType === AllocationType.LOAN_REPAYMENT) {
      if (currentStep === 3) return <StepSelectLoan formData={formData} setFormData={setFormData} />;
      if (currentStep === 4) return <StepSelectInstallment formData={formData} setFormData={setFormData} />;
    }

    if (formData.allocationType === AllocationType.SUBSCRIPTION_FEE && currentStep === 3) {
      return <StepSelectFee formData={formData} setFormData={setFormData} />;
    }

    return null;
  };

  const isNextDisabled = () => {
    if (currentStep === 1) return !canProceed.fromStep1;
    if (currentStep === 2) return !canProceed.fromStep2;
    if (currentStep === 3) return !canProceed.fromStep3;
    return false;
  };

  const isLastStep = currentStep === totalSteps;

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Split className="size-4" />
        تخصیص ژورنال
      </Button>
      <ResponsivePanel open={open} onOpenChange={setOpen}>
        <Header>
          <Title>تخصیص ثبت حسابداری</Title>
          <Description>{getStepDescription()}</Description>
        </Header>
        <div className="p-4 space-y-4">{renderCurrentStep()}</div>
        <Footer>
          <div className="flex gap-2 w-full">
            {isLastStep ? (
              <Button onClick={handleSubmit} disabled={!canProceed.canSubmit} className="flex-1">
                تخصیص
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={isNextDisabled()} className="flex-1">
                بعدی
              </Button>
            )}
            <CloseButton asChild>
              <Button variant="outline" onClick={handleClose}>
                لغو
              </Button>
            </CloseButton>
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack}>
                بازگشت
              </Button>
            )}
          </div>
        </Footer>
      </ResponsivePanel>
    </>
  );
}
