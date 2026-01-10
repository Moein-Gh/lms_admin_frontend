"use client";

import * as React from "react";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DateRangeFilterProps = {
  readonly value?: [Date, Date];
  readonly onChange: (value: [Date, Date] | undefined) => void;
  readonly minDate?: Date;
  readonly maxDate?: Date;
  readonly presets?: readonly { readonly label: string; readonly range: [Date, Date] }[];
  readonly className?: string;
};

export function DateRangeFilter({ value, onChange, minDate, maxDate, presets, className }: DateRangeFilterProps) {
  const [date, setDate] = React.useState<{ from?: Date; to?: Date }>({
    from: value?.[0],
    to: value?.[1]
  });

  const handleSelect = (selected: { from?: Date; to?: Date } | undefined) => {
    setDate(selected ?? {});
    if (selected?.from && selected.to) {
      onChange([selected.from, selected.to]);
    } else if (!selected || (!selected.from && !selected.to)) {
      onChange(undefined);
    }
  };

  const handlePreset = (preset: [Date, Date]) => {
    setDate({ from: preset[0], to: preset[1] });
    onChange(preset);
  };

  const handleClear = () => {
    setDate({});
    onChange(undefined);
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Presets */}
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="sm"
              onClick={() => handlePreset(preset.range)}
              className={cn(
                "text-xs",
                date.from &&
                  date.to &&
                  date.from.getTime() === preset.range[0].getTime() &&
                  date.to.getTime() === preset.range[1].getTime() &&
                  "bg-primary text-primary-foreground"
              )}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      )}

      {/* Date Range Pickers */}
      <div className="grid gap-3">
        {/* From Date */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">از تاریخ</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("justify-start text-start font-normal", !date.from && "text-muted-foreground")}
              >
                <CalendarIcon className="ms-2 size-4" />
                {date.from ? format(date.from, "PPP", { locale: faIR }) : "انتخاب تاریخ"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date.from}
                onSelect={(newDate) => handleSelect({ ...date, from: newDate })}
                disabled={(day) => {
                  if (minDate && day < minDate) return true;
                  if (maxDate && day > maxDate) return true;
                  if (date.to && day > date.to) return true;
                  return false;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* To Date */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">تا تاریخ</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("justify-start text-start font-normal", !date.to && "text-muted-foreground")}
              >
                <CalendarIcon className="ms-2 size-4" />
                {date.to ? format(date.to, "PPP", { locale: faIR }) : "انتخاب تاریخ"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date.to}
                onSelect={(newDate) => handleSelect({ ...date, to: newDate })}
                disabled={(day) => {
                  if (minDate && day < minDate) return true;
                  if (maxDate && day > maxDate) return true;
                  if (date.from && day < date.from) return true;
                  return false;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Clear button */}
      {(date.from ?? date.to) && (
        <Button variant="ghost" size="sm" onClick={handleClear} className="self-start">
          پاک کردن
        </Button>
      )}
    </div>
  );
}
