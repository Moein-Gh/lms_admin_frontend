"use client";

import * as React from "react";
import { UseMutationResult } from "@tanstack/react-query";
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { Pills } from "@/components/ui/pills";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCreateTransaction } from "@/hooks/use-transaction";
import { useUsers } from "@/hooks/use-user";
import { type CreateTransactionRequest } from "@/lib/transaction-api";
import type { Transaction, TransactionKind } from "@/types/entities/transaction.type";
import { RequestError } from "@/types/error";

type DialogWrapperProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  formContent: React.ReactNode;
  create: UseMutationResult<Transaction, unknown, CreateTransactionRequest, unknown>;
  step: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  canProceed: boolean;
  isMobile: boolean;
};

function DialogWrapper({
  open,
  setOpen,
  formContent,
  create,
  step,
  onNextStep,
  onPrevStep,
  canProceed,
  isMobile
}: DialogWrapperProps) {
  const stepDescription = step === 1 ? "مرحله ۱: اطلاعات تراکنش" : "مرحله ۲: انتخاب کاربر";

  const triggerButton = (
    <Button>
      <PlusIcon className="size-4" />
      <span className="hidden md:inline"> افزودن تراکنش جدید</span>
    </Button>
  );

  const submitForm = () => {
    const formElement = document.querySelector("form");
    if (formElement instanceof HTMLFormElement) formElement.requestSubmit();
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-start">
            <DrawerTitle>افزودن تراکنش جدید</DrawerTitle>
            <DrawerDescription>{stepDescription}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4">{formContent}</div>
          <DrawerFooter>
            {step === 1 ? (
              <>
                <Button type="button" onClick={onNextStep} disabled={!canProceed}>
                  مرحله بعد <ArrowLeftIcon className="size-4" />
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">لغو</Button>
                </DrawerClose>
              </>
            ) : (
              <>
                <Button type="button" onClick={submitForm} disabled={create.isPending}>
                  {create.isPending ? "در حال ایجاد..." : "ایجاد تراکنش"}
                </Button>
                <Button type="button" variant="outline" onClick={onPrevStep}>
                  <ArrowRightIcon className="size-4" /> مرحله قبل
                </Button>
              </>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>افزودن تراکنش جدید</DialogTitle>
          <DialogDescription>{stepDescription}</DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}

type FormProps = {
  kinds: { id: string; name: string }[];
  accounts: { id: string; name: string }[];
  isMobile: boolean;
  create: UseMutationResult<Transaction, unknown, CreateTransactionRequest, unknown>;
  setOpen: (open: boolean) => void;
  step: number;
  setStep: (step: number) => void;
  setCanProceed: (canProceed: boolean) => void;
};

function CreateTransactionForm({
  kinds,
  accounts,
  isMobile,
  create,
  setOpen,
  step,
  setStep,
  setCanProceed
}: FormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm<CreateTransactionRequest>({
    defaultValues: { kind: "DEPOSIT", amount: "", userId: "", externalRef: "", note: "" }
  });

  const selectedKind = watch("kind");
  const amount = watch("amount");
  const isStep1Valid = Boolean(selectedKind) && Boolean(amount);

  React.useEffect(() => {
    setCanProceed(isStep1Valid);
  }, [isStep1Valid, setCanProceed]);

  const goNext = () => isStep1Valid && setStep(2);
  const goBack = () => setStep(1);

  const onSubmit = handleSubmit((data) => {
    create.mutate(data, {
      onSuccess: () => {
        toast.success("تراکنش با موفقیت ایجاد شد");
        setOpen(false);
        reset();
        setStep(1);
      },
      onError: (e) => toast.error((e as RequestError).response?.data.detail ?? "خطا در ایجاد تراکنش")
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5 py-4">
      {step === 1 && (
        <>
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              نوع تراکنش<span className="text-destructive">*</span>
            </Label>
            <Pills
              options={kinds.map((k) => ({ value: k.id, label: k.name }))}
              value={selectedKind}
              onValueChange={(v) => setValue("kind", (v ?? "DEPOSIT") as TransactionKind, { shouldValidate: true })}
              variant="outline"
              size="sm"
              allowDeselect={false}
            />
            {errors.kind && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              مبلغ<span className="text-destructive">*</span>
            </Label>
            <Input id="amount" type="number" placeholder="مبلغ تراکنش" {...register("amount", { required: true })} />
            {errors.amount && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="note" className="text-sm font-medium">
              توضیحات
            </Label>
            <Input id="note" placeholder="توضیحات" {...register("note")} />
          </div>
          {!isMobile && (
            <div className="flex gap-3 pt-4">
              <Button type="button" className="flex-1" onClick={goNext} disabled={!isStep1Valid}>
                <ArrowRightIcon className="size-4" /> مرحله بعد
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
          <div className="space-y-2">
            <Label htmlFor="userId" className="text-sm font-medium">
              کاربر<span className="text-destructive">*</span>
            </Label>
            <Select onValueChange={(v) => setValue("userId", v, { shouldValidate: true })}>
              <SelectTrigger dir="rtl" id="userId" className="w-full">
                <SelectValue placeholder="انتخاب کاربر" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((acc) => (
                  <SelectItem dir="rtl" key={acc.id} value={acc.id}>
                    {acc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.userId && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
          </div>
          {!isMobile && (
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={create.isPending}>
                {create.isPending ? "در حال ایجاد..." : "ایجاد تراکنش"}
              </Button>
              <Button type="button" variant="outline" onClick={goBack}>
                <ArrowRightIcon className="size-4" /> مرحله قبل
              </Button>
            </div>
          )}
        </>
      )}
    </form>
  );
}

export function CreateTransactionDialog() {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [canProceed, setCanProceed] = React.useState(false);
  const isMobile = useIsMobile();

  // Reset step when dialog closes
  React.useEffect(() => {
    if (!open) {
      setStep(1);
      setCanProceed(false);
    }
  }, [open]);

  const kinds = [
    { id: "DEPOSIT", name: "واریز" },
    { id: "WITHDRAWAL", name: "برداشت" },
    { id: "LOAN_DISBURSEMENT", name: "پرداخت وام" },
    { id: "LOAN_REPAYMENT", name: "بازپرداخت وام" },
    { id: "SUBSCRIPTION_PAYMENT", name: "پرداخت اشتراک" },
    { id: "FEE", name: "کارمزد" }
  ];

  const { data: usersData } = useUsers({ pageSize: 100 });
  const usersOptions = (usersData?.data ?? []).map((u) => ({
    id: u.id,
    name: u.identity.name ?? String(u.identity.phone)
  }));

  const create = useCreateTransaction();
  const handleNextStep = () => setStep(2);
  const handlePrevStep = () => setStep(1);

  const formContent = (
    <CreateTransactionForm
      kinds={kinds}
      accounts={usersOptions}
      isMobile={isMobile}
      create={create}
      setOpen={setOpen}
      step={step}
      setStep={setStep}
      setCanProceed={setCanProceed}
    />
  );

  return (
    <DialogWrapper
      open={open}
      setOpen={setOpen}
      formContent={formContent}
      create={create}
      step={step}
      onNextStep={handleNextStep}
      onPrevStep={handlePrevStep}
      canProceed={canProceed}
      isMobile={isMobile}
    />
  );
}
