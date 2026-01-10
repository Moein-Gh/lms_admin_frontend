"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ResponsivePanel } from "@/components/ui/responsive-panel";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDeleteLoan } from "@/hooks/use-loan";
import type { Loan } from "@/types/entities/loan.type";

export function LoanDeletePanel({ loan, onDelete }: { loan: Loan; onDelete?: (id: string) => Promise<void> | void }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // exact Persian phrase required to enable delete
  const requiredPhrase = "متوجه شدم";

  const { register, watch, handleSubmit, formState, reset } = useForm<{ confirm: string }>({
    defaultValues: { confirm: "" }
  });

  const confirmValue = watch("confirm", "");
  const isMatch = confirmValue.trim() === requiredPhrase;

  const deleteMutation = useDeleteLoan();
  const router = useRouter();

  const onSubmit = async () => {
    if (!isMatch) {
      setError("لطفاً عبارت خواسته شده را دقیق وارد کنید");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await deleteMutation.mutateAsync(loan.id);
      // notify parent
      await onDelete?.(loan.id);
      setOpen(false);
      reset();
      // Navigate back to loans list after successful deletion
      router.push("/dashboard/loans");
    } catch {
      setError("خطا در حذف وام");
    } finally {
      setLoading(false);
    }
  };

  // reset confirm input when panel closes
  React.useEffect(() => {
    if (!open) reset({ confirm: "" });
  }, [open, reset]);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="destructive" size="icon" type="button" aria-label="حذف وام" onClick={() => setOpen(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>حذف وام</TooltipContent>
      </Tooltip>

      <ResponsivePanel open={open} onOpenChange={setOpen} variant="destructive">
        <div className="w-full">
          <DialogTitle className="sr-only">حذف وام</DialogTitle>

          <p className="text-start text-sm">برای حذف این وام، لطفاً عبارت زیر را دقیقاً وارد کنید:</p>
          <div className="mt-2 text-start font-medium">{requiredPhrase}</div>

          <form className="flex flex-col gap-4 w-full mt-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="confirm-delete"
              placeholder="عبارت را اینجا وارد کنید"
              className="text-start"
              {...register("confirm", { required: true })}
              disabled={loading}
              autoFocus
            />

            {formState.errors.confirm && <div className="text-destructive text-xs text-center">کادر الزامی است</div>}
            {error && <div className="text-destructive text-xs text-center">{error}</div>}

            <div className="flex gap-2 justify-center mt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                انصراف
              </Button>

              <Button type="submit" variant="destructive" disabled={loading || !isMatch}>
                حذف نهایی
              </Button>
            </div>
          </form>
        </div>
      </ResponsivePanel>
    </>
  );
}
