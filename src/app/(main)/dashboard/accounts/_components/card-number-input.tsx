"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CardNumberFieldProps = {
  cardParts: [string, string];
  onPartChange: (val: string, idx: number) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  inputsRef: React.RefObject<Map<number, HTMLInputElement | null>>;
  error?: string | null;
};

export function CardNumberField({ cardParts, onPartChange, onPaste, inputsRef, error }: CardNumberFieldProps) {
  const [p0, p1] = cardParts;

  return (
    <div className="space-y-2">
      <Label htmlFor="card" className="text-sm font-medium">
        ۸ رقم آخر شماره کارت <span className="text-destructive">*</span>
      </Label>
      <div className="flex gap-2" dir="ltr">
        <Input
          ref={(el) => {
            inputsRef.current.set(0, el);
          }}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          value={p0}
          onPaste={onPaste}
          onChange={(e) => onPartChange(e.target.value.replace(/[^0-9]/g, ""), 0)}
          className="text-center  tracking-widest"
        />
        <Input
          ref={(el) => {
            inputsRef.current.set(1, el);
          }}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          value={p1}
          onPaste={onPaste}
          onChange={(e) => onPartChange(e.target.value.replace(/[^0-9]/g, ""), 1)}
          className="text-center  tracking-widest"
        />
      </div>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}

export default CardNumberField;
