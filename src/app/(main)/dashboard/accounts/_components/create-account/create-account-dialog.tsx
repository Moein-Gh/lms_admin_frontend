"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useIsMobile } from "@/hooks/use-mobile";
import { createAccount, type CreateAccountRequest } from "@/lib/account-api";
import { listAccountTypes } from "@/lib/account-type-api";
import { listUsers } from "@/lib/user-api";
import CardNumberField from "../card-number-input";
import { CreateAccountDialogMobile } from "./create-account-dialog-mobile";
import { CreateAccountDialogDesktop } from "./create-account-dialog.desktop";
import { AccountTypeSection } from "./form-items/account-type-section";
import { BankSection } from "./form-items/bank-name-section";
import { FormActionsSection } from "./form-items/form-actions-section";
import { UserSection } from "./form-items/user-section";

export function CreateAccountDialog() {
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

  const [selectedAccountType, setSelectedAccountType] = React.useState<string | undefined>(undefined);
  const [selectedUser, setSelectedUser] = React.useState<string | undefined>(undefined);
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
      setTimeout(() => {
        const last = inputsRef.current.get(3);
        if (last) last.focus();
      }, 0);
    }
  };

  const formContent = (
    <form
      onSubmit={handleSubmit((data) => {
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
      <UserSection
        items={(users?.data ?? []).map((u) => ({ id: u.id, name: u.identity.name ?? "بدون نام" }))}
        value={selectedUser}
        onChange={(val) => {
          setSelectedUser(val);
          if (val) setValue("userId", val, { shouldValidate: true });
          else setValue("userId", "", { shouldValidate: true });
        }}
        error={!!errors.userId}
      />
      <CardNumberField
        cardParts={cardParts as [string, string, string, string]}
        onPartChange={handleCardChange}
        onPaste={handleCardPaste}
        inputsRef={inputsRef}
        error={cardError}
      />

      <div className="grid  grid-cols-2 gap-4">
        <AccountTypeSection
          options={(types?.data ?? []).map((t) => ({ value: t.id, label: t.name }))}
          value={selectedAccountType}
          onChange={(val) => {
            setSelectedAccountType(val);
            setValue("accountTypeId", val ?? "", { shouldValidate: true });
          }}
          error={!!errors.accountTypeId}
        />
        <BankSection register={register} error={!!errors.bankName} />
      </div>

      {!isMobile && <FormActionsSection isPending={create.isPending} onReset={reset} />}
    </form>
  );

  React.useEffect(() => {
    if (!open) {
      reset();
      setSelectedAccountType(undefined);
      setSelectedUser(undefined);
      setCardParts(["", "", "", ""]);
      setCardError(null);
      inputsRef.current.clear();
    }
  }, [open, reset]);

  if (isMobile) {
    return <CreateAccountDialogMobile open={open} setOpen={setOpen} formContent={formContent} create={create} />;
  }
  return <CreateAccountDialogDesktop open={open} setOpen={setOpen} formContent={formContent} />;
}
