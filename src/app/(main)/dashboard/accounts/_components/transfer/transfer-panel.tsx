"use client";

import * as React from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

import AccountCardSelectable from "@/components/entity-specific/account/account-card-selectable";
import AmountInput from "@/components/form/amount-input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useAccounts } from "@/hooks/use-account";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCreateTransfer } from "@/hooks/use-transaction";
import type { Account } from "@/types/entities/account.type";

type TransferPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceAccountId: string;
  userId?: string | null;
};

type Step1Form = {
  amount: string;
  description?: string;
};

export default function TransferPanel({ open, onOpenChange, sourceAccountId, userId }: TransferPanelProps) {
  const isMobile = useIsMobile();
  const [step, setStep] = React.useState<1 | 2>(1);
  const [selectedAccount, setSelectedAccount] = React.useState<string | null>(null);
  const [canProceed, setCanProceed] = React.useState(false);

  const create = useCreateTransfer();

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<Step1Form>({ defaultValues: { amount: "", description: "" } });

  const amount = watch("amount");

  React.useEffect(() => {
    setCanProceed(Boolean(Number(amount) > 0));
  }, [amount]);

  // fetch accounts when on step 2
  const { data: accountsData, isLoading: accountsLoading } = useAccounts(
    userId ? { userId, page: 1, pageSize: 20 } : undefined,
    { enabled: step === 2 && !!userId }
  );

  React.useEffect(() => {
    if (!open) {
      setStep(1);
      setSelectedAccount(null);
      reset();
      setCanProceed(false);
    }
  }, [open, reset]);

  const sortedAccounts = React.useMemo(() => {
    if (!accountsData?.data) return [] as Account[];
    return [...accountsData.data]
      .filter((a) => a.id !== sourceAccountId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [accountsData, sourceAccountId]);

  const goNext = () => {
    if (!canProceed) return;
    setStep(2);
  };
  const goBack = () => setStep(1);

  const submit = handleSubmit(async (values) => {
    if (step === 1) {
      goNext();
      return;
    }

    if (!selectedAccount) {
      toast.error("لطفاً یک حساب مقصد انتخاب کنید");
      return;
    }

    try {
      await create.mutateAsync({
        sourceAccountId,
        destinationAccountId: selectedAccount,
        amount: values.amount,
        description: values.description ?? null
      });
      toast.success("انتقال با موفقیت انجام شد");
      onOpenChange(false);
      reset();
      setStep(1);
    } catch (e) {
      toast.error("خطا در انجام انتقال");
    }
  });

  const stepDescription = step === 1 ? "مرحله ۱: اطلاعات انتقال" : "مرحله ۲: انتخاب حساب مقصد";

  const formContent = (
    <form onSubmit={submit} className="space-y-4 py-3">
      {step === 1 && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              مبلغ<span className="text-destructive">*</span>
            </label>
            <Controller
              control={control}
              name="amount"
              rules={{ required: true }}
              render={({ field }) => (
                <AmountInput placeholder="مبلغ انتقال" value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.amount && <div className="text-xs text-destructive">این فیلد الزامی است</div>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">توضیحات</label>
            <Input placeholder="توضیحات (اختیاری)" {...register("description")} />
          </div>

          {!isMobile && (
            <div className="flex gap-3 pt-2">
              <Button type="button" className="flex-1" onClick={goNext} disabled={!canProceed}>
                مرحله بعد <ArrowRightIcon className="size-4" />
              </Button>
              <Button type="button" variant="outline" onClick={() => reset()}>
                پاک کردن
              </Button>
            </div>
          )}
        </>
      )}

      {step === 2 && (
        <>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">حساب مقصد را انتخاب کنید</div>
            <div className="max-h-64 overflow-auto">
              {accountsLoading ? (
                <div className="text-sm text-muted-foreground">در حال بارگذاری...</div>
              ) : sortedAccounts.length === 0 ? (
                <div className="text-sm text-muted-foreground">حسابی جهت انتخاب یافت نشد</div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {sortedAccounts.map((acc) => (
                    <AccountCardSelectable
                      key={acc.id}
                      account={acc}
                      selected={selectedAccount === acc.id}
                      onSelect={(a) => setSelectedAccount(a.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {!isMobile && (
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1" disabled={create.isPending}>
                {create.isPending ? "در حال ارسال..." : "ارسال انتقال"}
              </Button>
              <Button type="button" variant="outline" onClick={goBack}>
                <ArrowLeftIcon className="size-4" /> مرحله قبل
              </Button>
            </div>
          )}
        </>
      )}
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-start">
            <DrawerTitle>انتقال وجه</DrawerTitle>
            <DialogDescription>{stepDescription}</DialogDescription>
          </DrawerHeader>

          <div className="px-4">{formContent}</div>

          <DrawerFooter>
            {step === 1 ? (
              <>
                <Button type="button" onClick={goNext} disabled={!canProceed}>
                  <ArrowRightIcon className="size-4" /> مرحله بعد
                </Button>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  لغو
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="submit"
                  onClick={() =>
                    document
                      .querySelector("form")
                      ?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
                  }
                  disabled={create.isPending}
                >
                  {create.isPending ? "در حال ارسال..." : "ارسال انتقال"}
                </Button>
                <Button type="button" variant="outline" onClick={goBack}>
                  مرحله قبل
                  <ArrowLeftIcon className="size-4" />
                </Button>
              </>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>انتقال وجه</DialogTitle>
          <DialogDescription>{stepDescription}</DialogDescription>
        </DialogHeader>
        <div className="px-2">{formContent}</div>
      </DialogContent>
    </Dialog>
  );
}
