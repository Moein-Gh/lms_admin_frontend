"use client";

import * as React from "react";
import { UseMutationResult } from "@tanstack/react-query";
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { SelectUserSection } from "@/components/form/select-user-section";
import TransactionKindSection from "@/components/form/transaction-kind-section";
import UploadField from "@/components/form/upload-field";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { useCreateTransaction } from "@/hooks/use-transaction";
import { type CreateTransactionRequest } from "@/lib/transaction-api";
import { TransactionKind, type Transaction } from "@/types/entities/transaction.type";
import { RequestError } from "@/types/error";

type DialogWrapperProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  formContent: React.ReactNode;
  create: UseMutationResult<Transaction, unknown, CreateTransactionRequest | FormData, unknown>;
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
  isMobile: boolean;
  create: UseMutationResult<Transaction, unknown, CreateTransactionRequest | FormData, unknown>;
  setOpen: (open: boolean) => void;
  step: number;
  setStep: (step: number) => void;
  setCanProceed: (canProceed: boolean) => void;
};

function CreateTransactionForm({ isMobile, create, setOpen, step, setStep, setCanProceed }: FormProps) {
  type FormValues = CreateTransactionRequest & { image?: File[] };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      kind: TransactionKind.DEPOSIT,
      amount: "",
      userId: "",
      externalRef: "",
      note: "",
      image: []
    }
  });

  const selectedKind = watch("kind");
  const amount = watch("amount");
  const selectedUser = watch("userId");
  const isStep1Valid = Boolean(selectedKind) && Boolean(amount);

  React.useEffect(() => {
    setCanProceed(isStep1Valid);
  }, [isStep1Valid, setCanProceed]);

  const goNext = () => isStep1Valid && setStep(2);
  const goBack = () => setStep(1);

  const onSubmit = handleSubmit((data) => {
    // Build FormData so files can be uploaded alongside fields.
    const formData = new FormData();
    formData.append("kind", String(data.kind));
    formData.append("amount", String(data.amount));
    formData.append("userId", String(data.userId));
    if (data.externalRef) formData.append("externalRef", String(data.externalRef));
    if (data.note) formData.append("note", String(data.note));
    const file = data.image && data.image.length > 0 ? data.image[0] : null;
    if (file) formData.append("image", file);

    create.mutate(formData, {
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
    <form onSubmit={onSubmit} className="space-y-5 py-4" encType="multipart/form-data">
      {step === 1 && (
        <>
          <TransactionKindSection
            value={selectedKind}
            onChange={(v) => setValue("kind", v ?? TransactionKind.DEPOSIT, { shouldValidate: true })}
            error={!!errors.kind}
          />
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
          <div className="space-y-2 flex flex-col gap-3">
            <SelectUserSection
              value={selectedUser}
              onChange={(val) => setValue("userId", val ?? "", { shouldValidate: true })}
              error={!!errors.userId}
            />
            {errors.userId && <span className="text-xs text-destructive">این فیلد الزامی است</span>}

            <UploadField<FormValues, "image">
              name="image"
              control={control}
              accept="image/*,.pdf"
              multiple={false}
              maxFiles={1}
              label="پیوست فایل تراکنش"
            />
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

  const create = useCreateTransaction();
  const handleNextStep = () => setStep(2);
  const handlePrevStep = () => setStep(1);

  const formContent = (
    <CreateTransactionForm
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
