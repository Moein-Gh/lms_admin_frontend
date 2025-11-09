"use client";

import * as React from "react";
import { UseMutationResult, useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateLoan } from "@/hooks/use-loan";
import { useIsMobile } from "@/hooks/use-mobile";
import { listAccounts } from "@/lib/account-api";
import { type CreateLoanRequest } from "@/lib/loan-api";
import { listLoanTypes } from "@/lib/loan-type-api";
import type { Loan } from "@/types/entities/loan.type";
import { RequestError } from "@/types/error";

// Design A — Progressive Inline (compact centered dialog with two inline selects)

type CreateLoanDialogMobileProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  formContent: React.ReactNode;
  create: UseMutationResult<Loan, unknown, CreateLoanRequest, unknown>;
};
function CreateLoanDialogMobile({ open, setOpen, formContent, create }: CreateLoanDialogMobileProps) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>
          <PlusIcon className="size-4" />
          افزودن وام جدید
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-right">
          <DrawerTitle>افزودن وام جدید</DrawerTitle>
          <DrawerDescription>اطلاعات وام بانکی جدید را وارد کنید</DrawerDescription>
        </DrawerHeader>
        <div className="px-4">{formContent}</div>
        <DrawerFooter>
          <Button
            type="button"
            onClick={() => {
              const formElement = document.querySelector("form");
              if (formElement instanceof HTMLFormElement) {
                formElement.requestSubmit();
              }
            }}
            disabled={create.isPending}
          >
            {create.isPending ? "در حال ایجاد..." : "ایجاد وام"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">لغو</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

type CreateLoanDialogDesktopProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  formContent: React.ReactNode;
};
function CreateLoanDialogDesktop({ open, setOpen, formContent }: CreateLoanDialogDesktopProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="size-4" />
          افزودن وام جدید
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>افزودن وام جدید</DialogTitle>
          <DialogDescription>اطلاعات وام بانکی جدید را وارد کنید</DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  options: { id: string; name: string }[];
  valueKey: keyof CreateLoanRequest;
  error?: boolean;
  setValue: ReturnType<typeof useForm<CreateLoanRequest>>["setValue"];
};

function SelectField({ id, label, options, valueKey, error, setValue }: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        <span className="text-destructive">*</span>
      </Label>
      <Select value={undefined} onValueChange={(v) => setValue(valueKey, v, { shouldValidate: true })}>
        <SelectTrigger dir="rtl" id={id} className="w-full">
          <SelectValue placeholder={`انتخاب ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem dir="rtl" key={opt.id} value={opt.id}>
              {opt.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
    </div>
  );
}

type CreateLoanFormProps = {
  types: { id: string; name: string }[];
  accounts: { id: string; name: string }[];
  isMobile: boolean;
  create: UseMutationResult<Loan, unknown, CreateLoanRequest, unknown>;
  setOpen: (open: boolean) => void;
};

function CreateLoanForm({ types, accounts, isMobile, create, setOpen }: CreateLoanFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<CreateLoanRequest>({
    defaultValues: {
      accountId: "",
      loanTypeId: "",
      name: "",
      amount: "",
      startDate: new Date(),
      paymentMonths: 12
    }
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        create.mutate(data, {
          onSuccess: () => {
            toast.success("وام با موفقیت ایجاد شد");
            setOpen(false);
            reset();
          },
          onError: (error) => {
            const err = error as RequestError;
            toast.error(err.response?.data.detail ?? "خطا در ایجاد وام");
          }
        });
      })}
      className="space-y-5 py-4"
    >
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          نام وام
          <span className="text-destructive">*</span>
        </Label>
        <Input id="name" placeholder="نام وام" {...register("name", { required: true })} />
        {errors.name && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          id="loanType"
          label="نوع وام"
          options={types}
          valueKey="loanTypeId"
          error={!!errors.loanTypeId}
          setValue={setValue}
        />
        <SelectField
          id="account"
          label="حساب"
          options={accounts}
          valueKey="accountId"
          error={!!errors.accountId}
          setValue={setValue}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">
            مبلغ
            <span className="text-destructive">*</span>
          </Label>
          <Input id="amount" type="number" placeholder="مبلغ وام" {...register("amount", { required: true })} />
          {errors.amount && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentMonths" className="text-sm font-medium">
            تعداد اقساط (ماه)
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="paymentMonths"
            type="number"
            placeholder="تعداد ماه"
            {...register("paymentMonths", { required: true, valueAsNumber: true })}
          />
          {errors.paymentMonths && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="startDate" className="text-sm font-medium">
          تاریخ شروع
          <span className="text-destructive">*</span>
        </Label>
        <Input id="startDate" type="date" {...register("startDate", { required: true, valueAsDate: true })} />
        {errors.startDate && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
      </div>

      {!isMobile && (
        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1" disabled={create.isPending}>
            {create.isPending ? "در حال ایجاد..." : "ایجاد وام"}
          </Button>
          <Button type="button" variant="outline" onClick={() => reset()}>
            پاک کردن
          </Button>
        </div>
      )}
    </form>
  );
}

export function CreateLoanDialog() {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const { data: types } = useQuery({
    queryKey: ["loan-types", "list"],
    queryFn: () => listLoanTypes({ pageSize: 100 })
  });

  const { data: accounts } = useQuery({
    queryKey: ["accounts", "list"],
    queryFn: () => listAccounts({ pageSize: 100 })
  });

  const create = useCreateLoan();

  const typesOptions = types?.data ?? [];
  const accountsOptions = (accounts?.data ?? []).map((a) => ({ id: a.id, name: a.name }));

  const formContent = (
    <CreateLoanForm
      types={typesOptions}
      accounts={accountsOptions}
      isMobile={isMobile}
      create={create}
      setOpen={setOpen}
    />
  );

  if (isMobile) {
    return <CreateLoanDialogMobile open={open} setOpen={setOpen} formContent={formContent} create={create} />;
  }
  return <CreateLoanDialogDesktop open={open} setOpen={setOpen} formContent={formContent} />;
}
