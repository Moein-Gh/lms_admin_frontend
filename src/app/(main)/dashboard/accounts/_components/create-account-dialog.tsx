"use client";

import * as React from "react";
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { createAccount, type CreateAccountRequest } from "@/lib/account-api";
import { listAccountTypes } from "@/lib/account-type-api";
import { listUsers } from "@/lib/user-api";
import type { Account } from "@/types/entities/account.type";

// Design A — Progressive Inline (compact centered dialog with two inline selects)

type CreateAccountDialogMobileProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  formContent: React.ReactNode;
  create: UseMutationResult<Account, unknown, CreateAccountRequest, unknown>;
};
function CreateAccountDialogMobile({ open, setOpen, formContent, create }: CreateAccountDialogMobileProps) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>
          <PlusIcon className="size-4" />
          افزودن حساب جدید
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-right">
          <DrawerTitle>افزودن حساب جدید</DrawerTitle>
          <DrawerDescription>اطلاعات حساب بانکی جدید را وارد کنید</DrawerDescription>
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
            {create.isPending ? "در حال ایجاد..." : "ایجاد حساب"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">لغو</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

type CreateAccountDialogDesktopProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  formContent: React.ReactNode;
};
function CreateAccountDialogDesktop({ open, setOpen, formContent }: CreateAccountDialogDesktopProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="size-4" />
          افزودن حساب جدید
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>افزودن حساب جدید</DialogTitle>
          <DialogDescription>اطلاعات حساب بانکی جدید را وارد کنید</DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}

export function CreateAccountDialog() {
  // Helper to render select fields
  const renderSelect = (
    id: string,
    label: string,
    options: { id: string; name: string }[],
    valueKey: keyof CreateAccountRequest,
    error?: boolean
  ) => (
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
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const { data: types } = useQuery({
    queryKey: ["account-types", "list"],
    queryFn: () => listAccountTypes({ pageSize: 100 })
  });

  const { data: users } = useQuery({
    queryKey: ["users", "list"],
    queryFn: () => listUsers({ pageSize: 100 })
  });

  const create = useMutation({
    mutationFn: (data: CreateAccountRequest) => createAccount(data),
    onSuccess: () => {
      toast.success("حساب با موفقیت ایجاد شد");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setOpen(false);
    },
    onError: (err: unknown) => {
      let msg = "خطا در ایجاد حساب";
      if (err && typeof err === "object" && "message" in err) {
        msg = (err as { message?: string }).message ?? msg;
      }
      toast.error(msg);
    }
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<CreateAccountRequest>({
    defaultValues: {
      accountTypeId: "",
      userId: "",
      cardNumber: "",
      bankName: ""
    }
  });

  const formContent = (
    <form
      onSubmit={handleSubmit((data) => {
        create.mutate(data);
      })}
      className="space-y-5 py-4"
    >
      <div className="grid grid-cols-2 gap-4">
        {renderSelect("atype", "نوع حساب", types?.data ?? [], "accountTypeId", !!errors.accountTypeId)}
        {renderSelect(
          "auser",
          "کاربر",
          (users?.data ?? []).map((u) => ({ id: u.id, name: u.identity.name ?? "بدون نام" })),
          "userId",
          !!errors.userId
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="card" className="text-sm font-medium">
          شماره کارت
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="card"
          placeholder="xxxx-xxxx-xxxx-xxxx"
          className="font-mono tracking-wider"
          {...register("cardNumber", { required: true })}
        />
        {errors.cardNumber && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bank" className="text-sm font-medium">
          نام بانک
          <span className="text-destructive">*</span>
        </Label>
        <Input id="bank" placeholder="مثال: ملی، ملت، پاسارگاد" {...register("bankName", { required: true })} />
        {errors.bankName && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
      </div>

      {!isMobile && (
        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1" disabled={create.isPending}>
            {create.isPending ? "در حال ایجاد..." : "ایجاد حساب"}
          </Button>
          <Button type="button" variant="outline" onClick={() => reset()}>
            پاک کردن
          </Button>
        </div>
      )}
    </form>
  );

  if (isMobile) {
    return <CreateAccountDialogMobile open={open} setOpen={setOpen} formContent={formContent} create={create} />;
  }
  return <CreateAccountDialogDesktop open={open} setOpen={setOpen} formContent={formContent} />;
}
