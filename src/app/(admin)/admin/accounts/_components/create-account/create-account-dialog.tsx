"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

import { AccountTypeSection } from "@/components/form/account-type-section";

import { SelectUserSection } from "@/components/form/select-user-section";
import { CalendarHijri } from "@/components/ui/calendar-hijri";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/general/use-mobile";
import { createAccount, type CreateAccountRequest } from "@/lib/admin-APIs/account-api";
import { listAccountTypes } from "@/lib/admin-APIs/account-type-api";
import { listUsers } from "@/lib/admin-APIs/user-api";
import { BANK_NAMES } from "@/lib/bank-names";
import { formatPersianDate, DATE_FORMATS } from "@/lib/date-service";
import CardNumberField from "../card-number-input";
import { CreateAccountDialogMobile } from "./create-account-dialog-mobile";
import { CreateAccountDialogDesktop } from "./create-account-dialog.desktop";
import { FormActionsSection } from "./form-items/form-actions-section";

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
    control,
    formState: { errors }
  } = useForm<CreateAccountRequest>({
    defaultValues: {
      accountTypeId: "",
      userId: "",
      cardNumber: "",
      bankName: "",
      bookCode: "",
      createdAt: undefined
    }
  });

  const [selectedAccountType, setSelectedAccountType] = React.useState<string | undefined>(undefined);
  const [selectedUser, setSelectedUser] = React.useState<string | undefined>(undefined);
  const [cardParts, setCardParts] = React.useState(["", ""]);
  const [cardError, setCardError] = React.useState<string | null>(null);
  const inputsRef = React.useRef<Map<number, HTMLInputElement | null>>(new Map());
  const [createdAt, setCreatedAt] = React.useState<Date | undefined>(undefined);
  const [createdAtOpen, setCreatedAtOpen] = React.useState(false);

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
    if (pasted.length >= 8) {
      const newParts = [pasted.slice(0, 4), pasted.slice(4, 8)];
      setCardParts(newParts);
      setTimeout(() => {
        const last = inputsRef.current.get(1);
        if (last) last.focus();
      }, 0);
    }
  };

  const formContent = (
    <form
      onSubmit={handleSubmit((data) => {
        const cardNum = cardParts.join("");
        if (cardNum.length < 8) {
          toast.error("شماره کارت نامعتبر است");
          return;
        }
        const payload: CreateAccountRequest = { ...data, cardNumber: cardNum } as CreateAccountRequest;
        create.mutate(payload);
      })}
      className="space-y-5 py-4"
    >
      {/* register createdAt so it's validated by RHF */}
      <input type="hidden" {...register("createdAt", { required: true })} />
      <SelectUserSection
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
        cardParts={cardParts as [string, string]}
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
        <div className="space-y-2">
          <label className="text-sm font-medium">نام بانک</label>
          {/* Use Controller for Select to bind with RHF */}
          <Controller
            name="bankName"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select required value={field.value || ""} onValueChange={(val) => field.onChange(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="انتخاب بانک" />
                </SelectTrigger>
                <SelectContent>
                  {BANK_NAMES.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.bankName && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
        </div>
      </div>

      {/* Created at date and book code */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">تاریخ ایجاد</label>
          <Popover open={createdAtOpen} onOpenChange={setCreatedAtOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="w-full rounded-md border px-3 py-2 text-sm text-muted-foreground flex items-center justify-between"
              >
                {createdAt ? formatPersianDate(createdAt, DATE_FORMATS.SHORT) : "انتخاب تاریخ"}
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <CalendarHijri
                selected={createdAt}
                onSelect={(d?: Date) => {
                  if (!d) return;
                  setCreatedAt(d);
                  setValue("createdAt", d.toISOString(), { shouldValidate: true });
                  setCreatedAtOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
          {errors.createdAt && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">شماره دفترچه</label>
          <Input type="text" placeholder="10" {...register("bookCode")} className="text-end" />
        </div>
      </div>

      {!isMobile && <FormActionsSection isPending={create.isPending} onReset={reset} />}
    </form>
  );

  React.useEffect(() => {
    if (!open) {
      reset();
      setSelectedAccountType(undefined);
      setSelectedUser(undefined);
      setCardParts(["", ""]);
      setCardError(null);
      inputsRef.current.clear();
      setCreatedAt(undefined);
      setValue("createdAt", "");
      setValue("bankName", "");
      setValue("bookCode", "");
    }
  }, [open, reset, setValue]);

  React.useEffect(() => {
    if (open && !createdAt) {
      const now = new Date();
      setCreatedAt(now);
      setValue("createdAt", now.toISOString(), { shouldValidate: true });
    }
  }, [open, createdAt, setValue]);

  if (isMobile) {
    return <CreateAccountDialogMobile open={open} setOpen={setOpen} formContent={formContent} create={create} />;
  }
  return <CreateAccountDialogDesktop open={open} setOpen={setOpen} formContent={formContent} />;
}
