"use client";

import * as React from "react";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ResponsivePanel } from "@/components/ui/responsive-panel";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useUpdateLoan } from "@/hooks/admin/use-loan";
import type { Loan } from "@/types/entities/loan.type";

export function LoanUpdatePanel({ loan }: { loan: Loan }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { register, handleSubmit, formState, reset } = useForm<{ name: string }>({
    defaultValues: { name: loan.name }
  });

  const updateMutation = useUpdateLoan();

  const onSubmit = async (data: { name: string }) => {
    setLoading(true);
    setError(null);
    try {
      await updateMutation.mutateAsync({ loanId: loan.id, data: { name: data.name } });
      setOpen(false);
      reset({ name: data.name });
    } catch {
      setError("خطا در ثبت تغییرات");
    } finally {
      setLoading(false);
    }
  };

  // reset form when the panel closes (revert to original loan name)
  React.useEffect(() => {
    if (!open) reset({ name: loan.name });
  }, [open, reset, loan.name]);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
            <Pencil className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>ویرایش وام</TooltipContent>
      </Tooltip>
      <ResponsivePanel open={open} onOpenChange={setOpen}>
        <div className="w-full">
          <DialogTitle className="pb-6">ویرایش نام وام</DialogTitle>
          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit(onSubmit)}>
            <label className="text-start text-sm font-medium" htmlFor="loan-name">
              نام وام
            </label>
            <Input
              id="loan-name"
              type="text"
              className="text-start"
              {...register("name", { required: true })}
              disabled={loading}
              autoFocus
            />
            {formState.errors.name && <div className="text-destructive text-xs text-center">نام وام الزامی است</div>}
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
