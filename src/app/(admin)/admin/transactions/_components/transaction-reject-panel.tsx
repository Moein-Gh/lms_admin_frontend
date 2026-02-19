"use client";

import * as React from "react";
import { toast } from "sonner";
import { RejectIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { ResponsivePanel } from "@/components/ui/responsive-panel";
import { useRejectTransaction } from "@/hooks/admin/use-transaction";
import type { Transaction } from "@/types/entities/transaction.type";

export function TransactionRejectPanel({ transaction }: { transaction: Transaction }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const rejectMutation = useRejectTransaction(transaction.id);

  const handleReject = async () => {
    setLoading(true);
    setError(null);
    try {
      await rejectMutation.mutateAsync();
      toast.success("تراکنش با موفقیت رد شد");
      setOpen(false);
    } catch {
      setError("خطا در رد تراکنش");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" type="button" aria-label="رد تراکنش" onClick={() => setOpen(true)}>
        <RejectIcon className="text-destructive" />
        رد تراکنش
      </Button>

      <ResponsivePanel open={open} onOpenChange={setOpen} variant="destructive">
        <div className="w-full">
          <DialogTitle className="pb-6">رد تراکنش</DialogTitle>

          <p className="text-start text-sm text-muted-foreground">
            آیا مطمئن هستید که می‌خواهید این تراکنش را رد کنید؟ این عملیات قابل بازگشت نیست.
          </p>

          {error && <div className="mt-3 text-destructive text-xs text-center">{error}</div>}

          <div className="flex gap-2 justify-center mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              انصراف
            </Button>

            <Button type="button" variant="destructive" onClick={handleReject} disabled={loading}>
              رد تراکنش
            </Button>
          </div>
        </div>
      </ResponsivePanel>
    </>
  );
}
