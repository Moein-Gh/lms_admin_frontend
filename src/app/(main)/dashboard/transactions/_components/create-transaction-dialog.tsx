"use client";

import * as React from "react";
import { UseMutationResult } from "@tanstack/react-query";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { useCreateTransaction } from "@/hooks/use-transaction";
import { useUsers } from "@/hooks/use-user";
import { type CreateTransactionRequest } from "@/lib/transaction-api";
import type { Transaction } from "@/types/entities/transaction.type";
import { RequestError } from "@/types/error";

// Design A — Progressive Inline (compact centered dialog with two inline selects)

type CreateTransactionDialogMobileProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  formContent: React.ReactNode;
  create: UseMutationResult<Transaction, unknown, CreateTransactionRequest, unknown>;
};
function CreateTransactionDialogMobile({ open, setOpen, formContent, create }: CreateTransactionDialogMobileProps) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>
          <PlusIcon className="size-4" />
          افزودن تراکنش جدید
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-right">
          <DrawerTitle>افزودن تراکنش جدید</DrawerTitle>
          <DrawerDescription>اطلاعات تراکنش جدید را وارد کنید</DrawerDescription>
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
            {create.isPending ? "در حال ایجاد..." : "ایجاد تراکنش"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">لغو</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

type CreateTransactionDialogDesktopProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  formContent: React.ReactNode;
};
function CreateTransactionDialogDesktop({ open, setOpen, formContent }: CreateTransactionDialogDesktopProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="size-4" />
          افزودن تراکنش جدید
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>افزودن تراکنش جدید</DialogTitle>
          <DialogDescription>اطلاعات تراکنش جدید را وارد کنید</DialogDescription>
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
  valueKey: keyof CreateTransactionRequest;
  error?: boolean;
  setValue: ReturnType<typeof useForm<CreateTransactionRequest>>["setValue"];
};

function SelectField({ id, label, options, valueKey, error, setValue }: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        <span className="text-destructive">*</span>
      </Label>
      <Select onValueChange={(v) => setValue(valueKey, v, { shouldValidate: true })}>
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

type CreateTransactionFormProps = {
  kinds: { id: string; name: string }[];
  accounts: { id: string; name: string }[];
  isMobile: boolean;
  create: UseMutationResult<Transaction, unknown, CreateTransactionRequest, unknown>;
  setOpen: (open: boolean) => void;
};

function CreateTransactionForm({ kinds, accounts, isMobile, create, setOpen }: CreateTransactionFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<CreateTransactionRequest>({
    defaultValues: {
      kind: "DEPOSIT",
      amount: "",
      userId: "",
      externalRef: "",
      note: ""
    }
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        create.mutate(data, {
          onSuccess: () => {
            toast.success("تراکنش با موفقیت ایجاد شد");
            setOpen(false);
            reset();
          },
          onError: (error) => {
            const err = error as RequestError;
            toast.error(err.response?.data.detail ?? "خطا در ایجاد تراکنش");
          }
        });
      })}
      className="space-y-5 py-4"
    >
      <div className="space-y-2">
        <SelectField
          id="kind"
          label="نوع تراکنش"
          options={kinds}
          valueKey="kind"
          error={!!errors.kind}
          setValue={setValue}
        />
      </div>

      <div className="space-y-2">
        <SelectField
          id="userId"
          label="کاربر"
          options={accounts}
          valueKey="userId"
          error={!!errors.userId}
          setValue={setValue}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount" className="text-sm font-medium">
          مبلغ
          <span className="text-destructive">*</span>
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
          <Button type="submit" className="flex-1" disabled={create.isPending}>
            {create.isPending ? "در حال ایجاد..." : "ایجاد تراکنش"}
          </Button>
          <Button type="button" variant="outline" onClick={() => reset()}>
            پاک کردن
          </Button>
        </div>
      )}
    </form>
  );
}

export function CreateTransactionDialog() {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  // Transaction kinds from type
  const kinds = [
    { id: "DEPOSIT", name: "واریز" },
    { id: "WITHDRAWAL", name: "برداشت" },
    { id: "LOAN_DISBURSEMENT", name: "پرداخت وام" },
    { id: "LOAN_REPAYMENT", name: "بازپرداخت وام" },
    { id: "SUBSCRIPTION_PAYMENT", name: "پرداخت اشتراک" },
    { id: "FEE", name: "کارمزد" }
  ];

  // Users for user selection
  const { data: usersData } = useUsers({ pageSize: 100 });
  const usersOptions = (usersData?.data ?? []).map((u) => ({
    id: u.id,
    name: u.identity.name ?? String(u.identity.phone)
  }));

  const create = useCreateTransaction();

  const formContent = (
    <CreateTransactionForm
      kinds={kinds}
      accounts={usersOptions}
      isMobile={isMobile}
      create={create}
      setOpen={setOpen}
    />
  );

  if (isMobile) {
    return <CreateTransactionDialogMobile open={open} setOpen={setOpen} formContent={formContent} create={create} />;
  }
  return <CreateTransactionDialogDesktop open={open} setOpen={setOpen} formContent={formContent} />;
}
