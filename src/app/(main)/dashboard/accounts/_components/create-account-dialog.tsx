"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ComboboxFilter } from "@/components/filters/combobox-filter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pills, type PillOption } from "@/components/ui/pills";
import { useIsMobile } from "@/hooks/use-mobile";
import { createAccount, type CreateAccountRequest } from "@/lib/account-api";
import { listAccountTypes } from "@/lib/account-type-api";
import { listUsers } from "@/lib/user-api";
import { CardNumberField } from "./card-number-input";
import { CreateAccountDialogMobile, CreateAccountDialogDesktop } from "./create-account-dialog.parts";

// Design A — Progressive Inline (compact centered dialog with two inline selects)

export function CreateAccountDialog() {
  // Helper kept for reference (we'll use Pills and Combobox instead)
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

  // Controlled selection state so we can clear UI when dialog closes
  const [selectedAccountType, setSelectedAccountType] = React.useState<string | undefined>(undefined);
  const [selectedUser, setSelectedUser] = React.useState<string | undefined>(undefined);

  // Card number state and helpers
  const [cardParts, setCardParts] = React.useState(["", "", "", ""]);
  const [cardError, setCardError] = React.useState<string | null>(null);

  const inputsRef = React.useRef<Map<number, HTMLInputElement | null>>(new Map());

  const handleCardChange = (val: string, idx: number) => {
    const newParts = cardParts.map((p, i) => (i === idx ? val.slice(0, 4) : p));
    setCardParts(newParts);
    setCardError(null);
    if (val.length >= 4) {
      const next = inputsRef.current.get(idx + 1);
      if (next) next.focus();
    }
  };

  const handleCardPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\s|-/g, "")
      .replace(/[^0-9]/g, "");
    if (pasted.length >= 16) {
      const newParts = [pasted.slice(0, 4), pasted.slice(4, 8), pasted.slice(8, 12), pasted.slice(12, 16)];
      setCardParts(newParts);
      // focus last
      setTimeout(() => {
        const last = inputsRef.current.get(3);
        if (last) last.focus();
      }, 0);
    }
  };

  const formContent = (
    <form
      onSubmit={handleSubmit((data) => {
        // Combine card parts into single cardNumber before submitting
        const cardNum = cardParts.join("");
        if (cardNum.length < 16) {
          toast.error("شماره کارت نامعتبر است");
          return;
        }
        const payload: CreateAccountRequest = { ...data, cardNumber: cardNum } as CreateAccountRequest;
        create.mutate(payload);
      })}
      className="space-y-5 py-4"
    >
      <div className="grid grid-cols-1 gap-4">
        {/* Account type as Pills */}
        <div className="space-y-2">
          <Label htmlFor="atype" className="text-sm font-medium">
            نوع حساب
            <span className="text-destructive">*</span>
          </Label>
          <Pills
            options={(types?.data ?? []).map((t) => ({ value: t.id, label: t.name })) as PillOption<string>[]}
            mode="single"
            value={selectedAccountType}
            onValueChange={(v) => {
              const val = v;
              setSelectedAccountType(val);
              setValue("accountTypeId", val ?? "", { shouldValidate: true });
            }}
            variant="outline"
            className="w-full"
          />
          {errors.accountTypeId && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
        </div>
      </div>

      {/* User combobox as its own full-width row */}
      <div className="space-y-2">
        <Label htmlFor="auser" className="text-sm font-medium">
          کاربر
          <span className="text-destructive">*</span>
        </Label>
        <ComboboxFilter
          items={(users?.data ?? []).map((u) => ({ id: u.id, name: u.identity.name ?? "بدون نام" }))}
          selectedValue={selectedUser}
          onSelect={(v) => {
            const val = v;
            setSelectedUser(val);
            if (val) setValue("userId", val, { shouldValidate: true });
            else setValue("userId", "", { shouldValidate: true });
          }}
          getItemId={(i) => i.id}
          getItemLabel={(i) => i.name}
          placeholder="انتخاب کاربر"
          searchPlaceholder="جستجوی کاربر..."
          emptyMessage="کاربری یافت نشد"
          allLabel={""}
        />
        {errors.userId && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
      </div>

      <CardNumberField
        cardParts={cardParts as [string, string, string, string]}
        onPartChange={handleCardChange}
        onPaste={handleCardPaste}
        inputsRef={inputsRef}
        error={cardError}
      />

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

  // Clear form and local UI state whenever the dialog closes
  React.useEffect(() => {
    if (!open) {
      reset();
      setSelectedAccountType(undefined);
      setSelectedUser(undefined);
      setCardParts(["", "", "", ""]);
      setCardError(null);
      // clear refs
      inputsRef.current.clear();
    }
  }, [open, reset]);

  if (isMobile) {
    return <CreateAccountDialogMobile open={open} setOpen={setOpen} formContent={formContent} create={create} />;
  }
  return <CreateAccountDialogDesktop open={open} setOpen={setOpen} formContent={formContent} />;
}
