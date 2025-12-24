import { useState } from "react";
import type { UseFormSetValue, UseFormRegister, FieldErrors } from "react-hook-form";
import AmountInput from "@/components/form/amount-input";
import { Button } from "@/components/ui/button";
import { CalendarHijri } from "@/components/ui/calendar-hijri";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pills } from "@/components/ui/pills";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { CreateLoanRequest } from "@/lib/loan-api";

type StepLoanFieldsProps = {
  types: { id: string; name: string }[];
  selectedLoanTypeLocal: string | undefined;
  setSelectedLoanTypeLocal: (id: string | undefined) => void;
  selectedLoanType: string | undefined;
  setValue: UseFormSetValue<CreateLoanRequest>;
  register: UseFormRegister<CreateLoanRequest>;
  errors: FieldErrors<CreateLoanRequest>;
  selectedStartDate: Date | undefined;
  calOpen: boolean;
  setCalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function StepLoanFields({
  types,
  selectedLoanTypeLocal,
  setSelectedLoanTypeLocal,
  selectedLoanType,
  setValue,
  register,
  errors,
  selectedStartDate,
  calOpen,
  setCalOpen
}: StepLoanFieldsProps) {
  const [touchedAmount, setTouchedAmount] = useState(false);

  const amountRegister = register("amount", { required: true }) as ReturnType<UseFormRegister<CreateLoanRequest>>;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">
            مبلغ
            <span className="text-destructive">*</span>
          </Label>
          <AmountInput
            id="amount"
            placeholder="مبلغ وام"
            {...amountRegister}
            onBlur={(e) => {
              if (typeof amountRegister.onBlur === "function") {
                amountRegister.onBlur(e);
              }
              setTouchedAmount(true);
            }}
            onChange={amountRegister.onChange}
          />
          {errors.amount && touchedAmount && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="paymentMonths" className="text-sm font-medium">
            تعداد اقساط (ماه)
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="paymentMonths"
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
        <Popover open={calOpen} onOpenChange={setCalOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between font-normal">
              {selectedStartDate ? new Date(selectedStartDate).toLocaleDateString("fa-IR") : "انتخاب تاریخ"}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <CalendarHijri
              selected={selectedStartDate}
              onSelect={(d?: Date) => {
                setValue("startDate", d ?? new Date(), { shouldValidate: true });
                setCalOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
        {errors.startDate && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="loanType" className="text-sm font-medium">
          نوع وام
          <span className="text-destructive">*</span>
        </Label>
        <Pills
          options={types.map((t) => ({ value: t.id, label: t.name }))}
          mode="single"
          value={selectedLoanTypeLocal ?? selectedLoanType}
          onValueChange={(v) => {
            const val = v ?? "";
            setSelectedLoanTypeLocal(val || undefined);
            setValue("loanTypeId", val, { shouldValidate: true });
          }}
          variant="outline"
          className="w-full"
        />
        {errors.loanTypeId && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
      </div>
    </div>
  );
}
