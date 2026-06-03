"use client";

import * as React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import AmountInput from "@/components/form/amount-input";
import UploadField from "@/components/form/upload-field";
import { PlusIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/admin/use-current-user";
import { useCreateTransaction } from "@/hooks/admin/use-transaction";
import { useIsMobile } from "@/hooks/general/use-mobile";
import { cn } from "@/lib/utils";
import { TransactionKind } from "@/types/entities/transaction.type";
import { RequestError } from "@/types/error";

type FormValues = {
  amount: string;
  note: string;
  image?: File[];
};

type CreateDepositDialogProps = {
  readonly buttonSize?: "default" | "sm" | "lg" | "icon";
  readonly buttonClassName?: string;
  readonly buttonLabel?: string;
  readonly buttonIcon?: React.ReactNode;
};

const PRESET_AMOUNTS = [
  { label: "۱ میلیون", value: "1000000" },
  { label: "۲ میلیون", value: "2000000" },
  { label: "۵ میلیون", value: "5000000" },
  { label: "۱۰ میلیون", value: "10000000" }
] as const;

function formatAmountDisplay(raw: string): string {
  if (!raw) return "۰";
  const num = parseInt(raw, 10);
  if (isNaN(num)) return "۰";
  return num.toLocaleString("fa-IR");
}

export function CreateDepositDialog({
  buttonSize = "default",
  buttonClassName,
  buttonLabel = "واریز جدید",
  buttonIcon
}: CreateDepositDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<1 | 2>(1);
  const formRef = React.useRef<HTMLFormElement>(null);
  const isMobile = useIsMobile();
  const { data: user } = useAuth();
  const create = useCreateTransaction();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      amount: "",
      note: "",
      image: []
    }
  });

  const currentAmount = useWatch({ control, name: "amount" });

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) {
      reset();
      setStep(1);
    }
  };

  const onSubmit = handleSubmit((data) => {
    if (!user?.id) {
      toast.error("کاربر یافت نشد");
      return;
    }

    const formData = new FormData();
    formData.append("kind", TransactionKind.DEPOSIT);
    formData.append("amount", String(data.amount));
    formData.append("userId", user.id);
    if (data.note) formData.append("note", String(data.note));
    const file = data.image && data.image.length > 0 ? data.image[0] : null;
    if (file) formData.append("image", file);

    create.mutate(formData, {
      onSuccess: () => {
        toast.success("واریز شما ثبت شد و پس از تایید اعمال خواهد شد");
        handleOpenChange(false);
      },
      onError: (e) => toast.error((e as RequestError).response?.data.detail ?? "خطا در ثبت واریز")
    });
  });

  const handleNext = async () => {
    const valid = await trigger("amount");
    if (valid) setStep(2);
  };

  const triggerButton = (
    <Button variant="default" size={buttonSize} className={cn(buttonClassName)}>
      {buttonIcon ?? <PlusIcon className="size-4" />}
      {buttonLabel}
    </Button>
  );

  // ── Mobile Drawer — 2-step wizard ──────────────────────────────────────────
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-start">
            <DrawerTitle>واریز جدید</DrawerTitle>
            <DrawerDescription>{step === 1 ? "مبلغ واریز را وارد کنید" : "جزئیات تکمیلی (اختیاری)"}</DrawerDescription>
          </DrawerHeader>

          {/* Step progress bar */}
          <div className="flex gap-1.5 px-4 pb-4">
            <div className="h-1 flex-1 rounded-full bg-primary transition-colors" />
            <div className={cn("h-1 flex-1 rounded-full transition-colors", step === 2 ? "bg-primary" : "bg-muted")} />
          </div>

          <form ref={formRef} onSubmit={onSubmit} encType="multipart/form-data">
            {step === 1 ? (
              // ── Step 1: Amount ──────────────────────────────────────────────
              <div className="flex flex-col gap-5 px-4 pb-2">
                <div className="space-y-1 text-center">
                  <Controller
                    control={control}
                    name="amount"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <AmountInput
                        id="amount-mobile"
                        placeholder="۰"
                        persianDigits
                        className="h-16 text-center text-3xl font-bold tracking-wider"
                        value={field.value}
                        onValueChange={(raw) => field.onChange(raw)}
                      />
                    )}
                  />
                  <p className="text-sm text-muted-foreground">تومان</p>
                  {errors.amount && <p className="text-xs text-destructive">مبلغ واریز الزامی است</p>}
                </div>

                {/* Quick-pick preset chips */}
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_AMOUNTS.map(({ label, value }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setValue("amount", value, { shouldValidate: true })}
                      className={cn(
                        "rounded-full border px-2 py-2 text-xs font-medium transition-colors",
                        currentAmount === value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-muted/50 text-foreground active:bg-muted"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // ── Step 2: Details ─────────────────────────────────────────────
              <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-2">
                {/* Amount summary */}
                <div className="flex items-center justify-between rounded-xl bg-primary/10 px-4 py-3">
                  <span className="text-sm text-muted-foreground">مبلغ واریز</span>
                  <span className="text-lg font-bold text-primary">{formatAmountDisplay(currentAmount)} تومان</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note-mobile" className="text-sm font-medium">
                    توضیحات
                  </Label>
                  <Input id="note-mobile" placeholder="شماره پیگیری یا توضیحات" {...register("note")} />
                </div>

                <UploadField<FormValues, "image">
                  name="image"
                  control={control}
                  accept="image/*,.pdf"
                  multiple={false}
                  maxFiles={1}
                  label="پیوست رسید واریز"
                />

                <p className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                  واریز شما پس از بررسی و تایید توسط مدیریت اعمال خواهد شد.
                </p>
              </div>
            )}
          </form>

          <DrawerFooter>
            {step === 1 ? (
              <>
                <Button type="button" onClick={handleNext}>
                  ادامه
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">لغو</Button>
                </DrawerClose>
              </>
            ) : (
              <>
                <Button type="button" onClick={() => formRef.current?.requestSubmit()} disabled={create.isPending}>
                  {create.isPending ? "در حال ثبت..." : "ثبت واریز"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  بازگشت
                </Button>
              </>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  // ── Desktop Dialog (unchanged) ─────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>واریز جدید</DialogTitle>
          <DialogDescription>ثبت واریز به حساب</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-5 py-4" encType="multipart/form-data">
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
            توجه: واریز شما پس از بررسی و تایید توسط مدیریت اعمال خواهد شد.
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              مبلغ واریز<span className="text-destructive">*</span>
            </Label>
            <AmountInput id="amount" placeholder="مبلغ مورد نظر" {...register("amount", { required: true })} />
            {errors.amount && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-sm font-medium">
              توضیحات
            </Label>
            <Input id="note" placeholder="توضیحات یا شماره پیگیری" {...register("note")} />
          </div>

          <UploadField<FormValues, "image">
            name="image"
            control={control}
            accept="image/*,.pdf"
            multiple={false}
            maxFiles={1}
            label="پیوست رسید واریز"
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={create.isPending}>
              {create.isPending ? "در حال ثبت..." : "ثبت واریز"}
            </Button>
            <Button type="button" variant="outline" onClick={() => reset()}>
              پاک کردن
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
