"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ResponsivePanel } from "@/components/ui/responsive-panel";
import { useBuyOutAccount } from "@/hooks/use-account";

type BuyoutPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string;
};

export default function BuyoutPanel({ open, onOpenChange, accountId }: BuyoutPanelProps) {
  const { register, watch, reset } = useForm<{ confirm: string }>({ defaultValues: { confirm: "" } });
  const confirmValue = watch("confirm", "");
  const requiredPhrase = "متوجه شدم";
  const isMatch = confirmValue.trim() === requiredPhrase;

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const buyOutMutation = useBuyOutAccount();

  React.useEffect(() => {
    if (!open) reset({ confirm: "" });
  }, [open, reset]);

  const onSubmit = async () => {
    if (!isMatch) {
      setError("لطفاً عبارت خواسته شده را دقیق وارد کنید");
      await buyOutMutation.mutateAsync(accountId);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await buyOutMutation.mutateAsync(accountId);
      toast.success("تسویه با موفقیت انجام شد");
      onOpenChange(false);
      reset();
    } catch {
      setError("خطا در انجام تسویه");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsivePanel open={open} onOpenChange={onOpenChange} variant="destructive">
      <div dir="rtl" className="w-full">
        <DialogTitle className="sr-only">تسویه حساب</DialogTitle>

        <p className="text-start text-sm">برای تسویه این حساب، لطفاً عبارت زیر را دقیقاً وارد کنید:</p>
        <div className="mt-2 text-start font-medium">{requiredPhrase}</div>

        <form
          className="flex flex-col gap-4 w-full mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <Input
            id="confirm-buyout"
            placeholder="عبارت را اینجا وارد کنید"
            className="text-start"
            {...register("confirm", { required: true })}
            disabled={loading}
            autoFocus
          />

          {!isMatch && watch("confirm").length > 0 && (
            <div className="text-destructive text-xs text-center">عبارت وارد شده صحیح نیست</div>
          )}
          {error && <div className="text-destructive text-xs text-center">{error}</div>}

          <div className="flex gap-2 justify-center mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              انصراف
            </Button>

            <Button type="button" variant="destructive" disabled={loading || !isMatch} onClick={onSubmit}>
              تسویه نهایی
            </Button>
          </div>
        </form>
      </div>
    </ResponsivePanel>
  );
}
