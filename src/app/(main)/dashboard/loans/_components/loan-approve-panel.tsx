"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrawerClose, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ResponsivePanel } from "@/components/ui/responsive-panel";
import { useApproveLoan } from "@/hooks/use-loan";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Loan } from "@/types/entities/loan.type";

export function LoanApprovePanel({ loan, onApprove }: { loan: Loan; onApprove?: () => void }) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const approveLoanMutation = useApproveLoan(loan.id);

  const handleConfirm = async () => {
    try {
      await approveLoanMutation.mutateAsync();
      await onApprove?.();
    } finally {
      setOpen(false);
    }
  };

  const CloseButton = isMobile ? DrawerClose : DialogClose;
  const Header = isMobile ? DrawerHeader : DialogHeader;
  const Title = isMobile ? DrawerTitle : DialogTitle;
  const Description = isMobile ? DrawerDescription : DialogDescription;
  const Footer = isMobile ? DrawerFooter : DialogFooter;

  const descriptionLines = [
    "با تایید وام وضعیت آن به 'فعال' تغییر می‌کند.",
    'وضعیت اقساط وام نیز به وضعیت "فعال" تغییر خواهد کرد.',
    "تراکنش مالی مربوط به این وام نیز به صورت خودکار فعال شده و در محاسبات مالی  لحاظ خواهد شد."
  ];
  const descriptionText = (
    <ol className="space-y-2 list-decimal rtl:ps-6 pt-4">
      {descriptionLines.map((line, idx) => (
        <li key={idx}>{line}</li>
      ))}
    </ol>
  );

  return (
    <>
      <Button variant="default" onClick={() => setOpen(true)}>
        تأیید وام
      </Button>

      <ResponsivePanel variant="warning" open={open} onOpenChange={setOpen}>
        <Header>
          <Title>آیا مطمئن هستید که می‌خواهید این وام را تأیید کنید؟</Title>
          <Description>{descriptionText}</Description>
        </Header>

        <Footer>
          <div className="flex gap-2">
            <CloseButton asChild>
              <Button variant="outline">لغو</Button>
            </CloseButton>
            <Button onClick={handleConfirm}>تأیید نهایی</Button>
          </div>
        </Footer>
      </ResponsivePanel>
    </>
  );
}
