"use client";

import * as React from "react";
import { Split } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrawerClose, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ResponsivePanel } from "@/components/ui/responsive-panel";
import { useAccounts } from "@/hooks/use-account";
import { useInstallments } from "@/hooks/use-installment";
import { useAddJournalEntry } from "@/hooks/use-journal";
import { useLoans } from "@/hooks/use-loan";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUsers } from "@/hooks/use-user";
import type { Journal } from "@/types/entities/journal.type";
import type { AllocationKind, AllocationFormData } from "./allocate-journal-panel.types";
import { StepOne } from "./step-one";
import { StepTwo } from "./step-two";

type Props = {
  journal: Journal;
  onSuccess?: () => void;
};

function PanelFooter({
  step,
  formData,
  handleBack,
  handleClose,
  handleNext,
  handleSubmit,
  CloseButton,
  Footer
}: {
  step: number;
  formData: Partial<AllocationFormData>;
  handleBack: () => void;
  handleClose: () => void;
  handleNext: () => void;
  handleSubmit: () => void;
  CloseButton: React.ElementType;
  Footer: React.ElementType;
}) {
  const isAmountValid = formData.amount && !isNaN(Number(formData.amount)) && Number(formData.amount) > 0;
  const isNextDisabled = step !== 1 || !formData.userId || !formData.kind || !isAmountValid;

  return (
    <Footer>
      <div className="flex gap-2 w-full">
        {step === 2 && (
          <Button variant="outline" onClick={handleBack}>
            بازگشت
          </Button>
        )}
        <CloseButton asChild>
          <Button variant="outline" onClick={handleClose}>
            لغو
          </Button>
        </CloseButton>
        {step === 1 ? (
          <Button onClick={handleNext} disabled={isNextDisabled} className="flex-1">
            بعدی
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!formData.targetId} className="flex-1">
            تخصیص
          </Button>
        )}
      </div>
    </Footer>
  );
}

// eslint-disable-next-line complexity
function getFilteredTargets(
  kind: AllocationKind | undefined,
  userId: string | undefined,
  accountsData: { data: { id: string; userId?: string; name?: string; code?: number }[] } | undefined,
  loansData: { data: { id: string; account?: { userId?: string }; name?: string; code?: number }[] } | undefined,
  installmentsData:
    | { data: { id: string; loan?: { account?: { userId?: string } }; name?: string; code?: number }[] }
    | undefined
): readonly { id: string; name?: string; code?: number }[] {
  if (!userId || !kind) return [];
  if (kind === "ACCOUNT") {
    return accountsData?.data.filter((a) => a.userId === userId) ?? [];
  }
  if (kind === "SUBSCRIPTION_FEE") {
    return loansData?.data.filter((l) => l.account?.userId === userId) ?? [];
  }
  return installmentsData?.data.filter((i) => i.loan?.account?.userId === userId) ?? [];
}

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
  const dc = totalDebit > totalCredit ? ("CREDIT" as const) : ("DEBIT" as const);
  return { amount, dc };
}

export function AllocateJournalPanel({ onSuccess, journal }: Props) {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState<Partial<AllocationFormData>>({});
  const isMobile = useIsMobile();

  const { data: usersData } = useUsers({ pageSize: 100 });
  const { data: accountsData } = useAccounts({ pageSize: 100 });
  const { data: loansData } = useLoans({ pageSize: 100 });
  const { data: installmentsData } = useInstallments({ pageSize: 100 });
  const addEntryMutation = useAddJournalEntry(journal.id);
  const { amount: unbalancedAmount, dc: unbalancedDC } = calculateUnbalancedAmount(journal.entries);

  const CloseButton = isMobile ? DrawerClose : DialogClose;
  const Header = isMobile ? DrawerHeader : DialogHeader;
  const Title = isMobile ? DrawerTitle : DialogTitle;
  const Description = isMobile ? DrawerDescription : DialogDescription;
  const Footer = isMobile ? DrawerFooter : DialogFooter;
  const handleNext = () => {
    setStep(2);
  };
  const handleBack = () => {
    setStep(1);
    setFormData((prev) => ({ ...prev, targetId: undefined }));
  };
  const handleSubmit = () => {
    const amountValid = formData.amount && !isNaN(Number(formData.amount)) && Number(formData.amount) > 0;
    if (!formData.targetId || !formData.kind || !formData.amount || !amountValid) return;
    const targetTypeMap = {
      ACCOUNT: "ACCOUNT",
      SUBSCRIPTION_FEE: "SUBSCRIPTION_FEE",
      INSTALLMENT: "INSTALLMENT"
    } as const;

    addEntryMutation.mutate(
      {
        ledgerAccountCode: 2050,
        dc: unbalancedDC,
        amount: formData.amount,
        targetType: targetTypeMap[formData.kind],
        targetId: formData.targetId,
        targetLedgerAccountCode: undefined
      },
      {
        onSuccess: () => {
          onSuccess?.();
          setOpen(false);
          setStep(1);
          setFormData({});
        }
      }
    );
  };
  const handleClose = () => {
    setOpen(false);
    setStep(1);
    setFormData({});
  };

  const targetList = React.useMemo(
    () => getFilteredTargets(formData.kind, formData.userId, accountsData, loansData, installmentsData),
    [formData.userId, formData.kind, accountsData, loansData, installmentsData]
  );
  const targetLabel = React.useMemo(() => {
    if (formData.kind === "ACCOUNT") return "انتخاب حساب";
    if (formData.kind === "SUBSCRIPTION_FEE") return "انتخاب وام";
    if (formData.kind === "INSTALLMENT") return "انتخاب قسط";
    return "انتخاب موجودیت";
  }, [formData.kind]);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Split className="size-4" />
        تخصیص ژورنال
      </Button>
      <ResponsivePanel open={open} onOpenChange={setOpen}>
        <Header>
          <Title>تخصیص ثبت حسابداری</Title>
          <Description>
            {step === 1 ? "کاربر، نوع موجودیت و مبلغ را انتخاب کنید" : "موجودیت مورد نظر را برای تخصیص انتخاب کنید"}
          </Description>
        </Header>
        <div className="p-4 space-y-4">
          {step === 1 ? (
            <StepOne
              formData={formData}
              setFormData={setFormData}
              usersData={usersData}
              suggestedAmount={unbalancedAmount}
            />
          ) : (
            <StepTwo formData={formData} setFormData={setFormData} targetLabel={targetLabel} targetList={targetList} />
          )}
        </div>
        <PanelFooter
          step={step}
          formData={formData}
          handleBack={handleBack}
          handleClose={handleClose}
          handleNext={handleNext}
          handleSubmit={handleSubmit}
          CloseButton={CloseButton}
          Footer={Footer}
        />
      </ResponsivePanel>
    </>
  );
}
