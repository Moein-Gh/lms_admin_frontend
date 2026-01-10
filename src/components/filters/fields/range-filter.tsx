"use client";

import * as React from "react";
import { motion } from "motion/react";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type RangeFilterProps = {
  readonly min: number;
  readonly max: number;
  readonly step?: number;
  readonly value: [number, number];
  readonly onChange: (value: [number, number]) => void;
  readonly formatValue?: (value: number) => string;
  readonly histogram?: readonly number[];
  readonly className?: string;
};

export function RangeFilter({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue = (v) => v.toLocaleString("fa-IR"),
  histogram,
  className
}: RangeFilterProps) {
  const [localValue, setLocalValue] = React.useState<[number, number]>(value);

  // Sync with external value
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSliderChange = (newValue: number[]) => {
    if (newValue.length === 2) {
      setLocalValue([newValue[0], newValue[1]]);
    }
  };

  const handleSliderCommit = (newValue: number[]) => {
    if (newValue.length === 2) {
      onChange([newValue[0], newValue[1]]);
    }
  };

  const maxHistogramValue = histogram ? Math.max(...histogram) : 0;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Histogram visualization */}
      {histogram && histogram.length > 0 && (
        <div className="flex h-16 items-end gap-px">
          {histogram.map((count, index) => {
            const height = maxHistogramValue > 0 ? (count / maxHistogramValue) * 100 : 0;
            const position = index / histogram.length;
            const isInRange =
              position >= (localValue[0] - min) / (max - min) && position <= (localValue[1] - min) / (max - min);

            return (
              <motion.div
                key={`histogram-bar-${position}-${count}`}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(height, 4)}%` }}
                transition={{ delay: index * 0.01, duration: 0.2 }}
                className={cn("flex-1 rounded-t transition-colors", isInRange ? "bg-primary" : "bg-muted")}
              />
            );
          })}
        </div>
      )}

      {/* Slider */}
      <Slider
        value={localValue}
        min={min}
        max={max}
        step={step}
        onValueChange={handleSliderChange}
        onValueCommit={handleSliderCommit}
        className="py-4"
      />

      {/* Value display */}
      <div className="flex items-center justify-between gap-4">
        <motion.div
          key={localValue[0]}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-muted flex-1 rounded-lg p-3 text-center"
        >
          <p className="text-muted-foreground mb-1 text-xs">از</p>
          <p className="font-semibold">{formatValue(localValue[0])}</p>
        </motion.div>

        <div className="bg-border h-px w-4" />

        <motion.div
          key={localValue[1]}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-muted flex-1 rounded-lg p-3 text-center"
        >
          <p className="text-muted-foreground mb-1 text-xs">تا</p>
          <p className="font-semibold">{formatValue(localValue[1])}</p>
        </motion.div>
      </div>
    </div>
  );
}
