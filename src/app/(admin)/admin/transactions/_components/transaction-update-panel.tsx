"use client";

import * as React from "react";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ResponsivePanel } from "@/components/ui/responsive-panel";
import { useUpdateTransaction } from "@/hooks/admin/use-transaction";
import type { Transaction } from "@/types/entities/transaction.type";

export function TransactionUpdatePanel({ transaction }: { transaction: Transaction }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { register, handleSubmit, formState, reset } = useForm<{ note: string; externalRef: string | null }>({
    defaultValues: {
      note: transaction.note ?? "",
      externalRef: transaction.externalRef ?? ""
    }
  });

  const updateMutation = useUpdateTransaction();

  const onSubmit = async (data: { note: string; externalRef: string | null }) => {
    setLoading(true);
    setError(null);
    try {
      await updateMutation.mutateAsync({
        transactionId: transaction.id,
        data: { note: data.note, externalRef: data.externalRef }
      });
      setOpen(false);
      reset({ note: data.note, externalRef: data.externalRef });
    } catch {
      setError("خطا در ثبت تغییرات");
    } finally {
      setLoading(false);
    }
  };

  // reset form when the panel closes (revert to original transaction values)
  React.useEffect(() => {
    if (!open) reset({ note: transaction.note ?? "", externalRef: transaction.externalRef ?? "" });
  }, [open, reset, transaction.note, transaction.externalRef]);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Pencil />
      </Button>
      <ResponsivePanel open={open} onOpenChange={setOpen}>
        <div className="w-full">
          <DialogTitle className="pb-6">ویرایش تراکنش</DialogTitle>
          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit(onSubmit)}>
            <label className="text-start text-sm font-medium" htmlFor="transaction-note">
              توضیحات
            </label>
            <Input
              id="transaction-note"
              type="text"
              className="text-start"
              {...register("note")}
              disabled={loading}
              autoFocus
            />
            <label className="text-start text-sm font-medium" htmlFor="transaction-externalRef">
              شناسه خارجی
            </label>
            <Input
              id="transaction-externalRef"
              type="text"
              className="text-start"
              {...register("externalRef")}
              disabled={loading}
            />
            {error && <div className="text-destructive text-xs text-center">{error}</div>}
            <div className="flex gap-2 justify-center mt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                انصراف
              </Button>
              <Button type="submit" disabled={loading || formState.isSubmitting}>
                ثبت تغییرات
              </Button>
            </div>
          </form>
        </div>
      </ResponsivePanel>
    </>
  );
}
