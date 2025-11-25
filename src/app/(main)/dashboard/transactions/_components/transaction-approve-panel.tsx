"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrawerClose, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ResponsivePanel } from "@/components/ui/responsive-panel";
import { useIsMobile } from "@/hooks/use-mobile";
import { useApproveTransaction } from "@/hooks/use-transaction";
import type { Transaction } from "@/types/entities/transaction.type";

export function TransactionApprovePanel({
  transaction,
  onApprove
}: {
  transaction: Transaction;
  onApprove?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const approveTransactionMutation = useApproveTransaction(transaction.id);

  const handleConfirm = async () => {
    try {
      await approveTransactionMutation.mutateAsync();
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
    "با تایید تراکنش وضعیت آن به 'تایید شده' تغییر می‌کند.",
    "تراکنش مالی در گزارش‌ها و محاسبات لحاظ خواهد شد.",
    "امکان بازگشت یا ویرایش تراکنش پس از تایید وجود نخواهد داشت."
  ];

  return (
    <>
      <Button variant="default" onClick={() => setOpen(true)}>
        تایید تراکنش
      </Button>

      <ResponsivePanel variant="warning" open={open} onOpenChange={setOpen}>
        <Header>
          <Title>آیا مطمئن هستید که می‌خواهید این وام را تأیید کنید؟</Title>
          <Description>با تأیید این تراکنش، تغییرات زیر اعمال خواهد شد:</Description>
        </Header>
        <ol className="space-y-2 list-decimal rtl:ps-6 px-4">
          {descriptionLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>

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
