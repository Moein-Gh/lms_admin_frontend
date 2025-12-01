"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CardNumberFieldProps = {
  cardParts: [string, string, string, string];
  onPartChange: (val: string, idx: number) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  inputsRef: React.RefObject<Map<number, HTMLInputElement | null>>;
  error?: string | null;
};

export function CardNumberField({ cardParts, onPartChange, onPaste, inputsRef, error }: CardNumberFieldProps) {
  const [p0, p1, p2, p3] = cardParts;

  return (
    <div className="space-y-2">
      <Label htmlFor="card" className="text-sm font-medium">
        شماره کارت
        <span className="text-destructive">*</span>
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
          className="text-center font-mono tracking-widest"
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
          className="text-center font-mono tracking-widest"
        />
        <Input
          ref={(el) => {
            inputsRef.current.set(2, el);
          }}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          value={p2}
          onPaste={onPaste}
          onChange={(e) => onPartChange(e.target.value.replace(/[^0-9]/g, ""), 2)}
          className="text-center font-mono tracking-widest"
        />
        <Input
          ref={(el) => {
            inputsRef.current.set(3, el);
          }}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          value={p3}
          onPaste={onPaste}
          onChange={(e) => onPartChange(e.target.value.replace(/[^0-9]/g, ""), 3)}
          className="text-center font-mono tracking-widest"
        />
      </div>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}

export default CardNumberField;
