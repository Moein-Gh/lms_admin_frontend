import {
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue
} from "react-hook-form";
import AmountInput from "@/components/form/amount-input";
import { CalendarIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { CalendarHijri } from "@/components/ui/calendar-hijri";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { DATE_FORMATS, formatPersianDate } from "@/lib/date-service";
import type { CreateLoanRequestDto } from "@/lib/user-APIs/loan-request-api";
import { cn } from "@/lib/utils";

const LOAN_PRESET_AMOUNTS = [
  { label: "۵ میلیون", value: "5000000" },
  { label: "۱۰ میلیون", value: "10000000" },
  { label: "۲۰ میلیون", value: "20000000" },
  { label: "۵۰ میلیون", value: "50000000" }
] as const;

type StepLoanRequestFieldsProps = {
  control: Control<CreateLoanRequestDto>;
  setValue: UseFormSetValue<CreateLoanRequestDto>;
  register: UseFormRegister<CreateLoanRequestDto>;
  errors: FieldErrors<CreateLoanRequestDto>;
  selectedStartDate: Date | undefined;
  calOpen: boolean;
  setCalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function StepLoanRequestFields({
  control,
  setValue,
  register,
  errors,
  selectedStartDate,
  calOpen,
  setCalOpen
}: StepLoanRequestFieldsProps) {
  const currentAmount = useWatch({ control, name: "amount" });

  return (
    <div className="space-y-5">
      {/* Amount — large centered, like deposit */}
      <div className="flex flex-col gap-3">
        <div className="space-y-1 text-center">
          <Controller
            control={control}
            name="amount"
            rules={{ required: true }}
            render={({ field }) => (
              <AmountInput
                id="amount"
                placeholder="۰"
                persianDigits
                className="h-16 text-center text-3xl font-bold tracking-wider"
                value={field.value}
                onValueChange={(raw) => field.onChange(raw)}
              />
            )}
          />
          <p className="text-sm text-muted-foreground">تومان</p>
          {errors.amount && <p className="text-xs text-destructive">مبلغ وام الزامی است</p>}
        </div>

        {/* Preset chips */}
        <div className="grid grid-cols-4 gap-2">
          {LOAN_PRESET_AMOUNTS.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setValue("amount", value, { shouldValidate: true })}
              className={cn(
                "rounded-full border px-2 py-2 text-xs font-medium transition-colors",
                currentAmount === value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-muted/50 text-foreground active:bg-muted"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Payment months */}
      <div className="space-y-2">
        <Label htmlFor="paymentMonths" className="text-sm font-medium">
          تعداد اقساط (ماه)<span className="text-destructive">*</span>
        </Label>
        <Input
          id="paymentMonths"
          type="number"
          inputMode="numeric"
          min={1}
          placeholder="مثلاً ۱۲"
          {...register("paymentMonths", { required: true, valueAsNumber: true, min: 1 })}
        />
        {errors.paymentMonths && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
      </div>

      {/* Start date */}
      <div className="space-y-2">
        <Label htmlFor="startDate" className="text-sm font-medium">
          تاریخ شروع<span className="text-destructive">*</span>
        </Label>
        <Popover open={calOpen} onOpenChange={setCalOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between font-normal">
              <span>
                {selectedStartDate ? formatPersianDate(selectedStartDate, DATE_FORMATS.SHORT) : "انتخاب تاریخ"}
              </span>
              <CalendarIcon className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <CalendarHijri
              selected={selectedStartDate}
              onSelect={(d?: Date) => {
                setValue("startDate", d ? d.toISOString() : new Date().toISOString(), {
                  shouldValidate: true
                });
                setCalOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
        {errors.startDate && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
      </div>

      {/* Note */}
      <div className="space-y-2">
        <Label htmlFor="note" className="text-sm font-medium">
          توضیحات (اختیاری)
        </Label>
        <Textarea id="note" placeholder="توضیحات اضافی..." rows={2} {...register("note")} />
      </div>
    </div>
  );
}
