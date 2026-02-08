import { useState } from "react";
import type { UseFormSetValue, UseFormRegister, FieldErrors } from "react-hook-form";
import AmountInput from "@/components/form/amount-input";
import { Button } from "@/components/ui/button";
import { CalendarHijri } from "@/components/ui/calendar-hijri";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { CreateLoanRequestDto } from "@/lib/admin-APIs/loan-request-api";
import { formatPersianDate, DATE_FORMATS } from "@/lib/date-service";

type StepLoanRequestFieldsProps = {
  setValue: UseFormSetValue<CreateLoanRequestDto>;
  register: UseFormRegister<CreateLoanRequestDto>;
  errors: FieldErrors<CreateLoanRequestDto>;
  selectedStartDate: Date | undefined;
  calOpen: boolean;
  setCalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function StepLoanRequestFields({
  setValue,
  register,
  errors,
  selectedStartDate,
  calOpen,
  setCalOpen
}: StepLoanRequestFieldsProps) {
  const [touchedAmount, setTouchedAmount] = useState(false);

  const amountRegister = register("amount", { required: true }) as ReturnType<UseFormRegister<CreateLoanRequestDto>>;

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
              {selectedStartDate ? formatPersianDate(selectedStartDate, DATE_FORMATS.SHORT) : "انتخاب تاریخ"}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <CalendarHijri
              selected={selectedStartDate}
              onSelect={(d?: Date) => {
                setValue("startDate", d ? d.toISOString() : new Date().toISOString(), { shouldValidate: true });
                setCalOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
        {errors.startDate && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
      </div>
    </div>
  );
}
