"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CalendarHijri } from "@/components/ui/calendar-hijri";
import { Pills, type PillOption } from "@/components/ui/pills";
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

  const persianFormatter = React.useMemo(
    () => new Intl.DateTimeFormat("fa-IR-u-ca-persian", { day: "numeric", month: "long", year: "numeric" }),
    []
  );

  const selectedPresetValue = React.useMemo(() => {
    if (!presets || !date.from || !date.to) return undefined;
    const idx = presets.findIndex(
      (p) => date.from!.getTime() === p.range[0].getTime() && date.to!.getTime() === p.range[1].getTime()
    );
    return idx === -1 ? undefined : String(idx);
  }, [presets, date.from, date.to]);

  const presetMap = React.useMemo(() => {
    const map: Record<string, [Date, Date]> = {};
    presets?.forEach((p, i) => {
      map[String(i)] = p.range;
    });
    return map;
  }, [presets]);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Presets */}
      {presets && presets.length > 0 && (
        <div dir="rtl">
          <Pills
            mode="single"
            variant="outline"
            size="sm"
            options={presets.map((p, i) => ({ value: String(i), label: p.label })) as PillOption<string>[]}
            value={selectedPresetValue}
            allowDeselect={true}
            onValueChange={(val) => {
              if (val === undefined) {
                handleClear();
                return;
              }
              const range = presetMap[String(val)];
              handlePreset(range);
            }}
          />
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
                {date.from ? persianFormatter.format(date.from) : "انتخاب تاریخ"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarHijri
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
                {date.to ? persianFormatter.format(date.to) : "انتخاب تاریخ"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarHijri
                mode="single"
                selected={date.to}
                onSelect={(newDate) => handleSelect({ ...date, to: newDate })}
                disabled={(day) => {
                  if (minDate && day < minDate) return true;
                  if (maxDate && day > maxDate) return true;
                  if (date.from && day < date.from) return true;
                  return false;
                }}
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
