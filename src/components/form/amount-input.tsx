"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

type AmountInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
  value?: string | number | null;
  /** Called with the raw numeric string (only 0-9 and optional dot) */
  onValueChange?: (raw: string) => void;
  /** Thousand separator shown in the input */
  thousandSeparator?: string;
  /** Allow decimal point */
  allowDecimals?: boolean;
  /** Max decimals when allowDecimals is true */
  decimals?: number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** Number of chunks to render (OTP style). If > 1, component renders multiple inputs each of `chunkLength` digits. */
  chunks?: number;
  /** Number of digits per chunk when `chunks` > 1 */
  chunkLength?: number;
};

function persianToLatinDigits(s: string) {
  return s.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776));
}

function formatWithSeparator(raw: string, separator = ",") {
  if (!raw) return "";
  const [intPart, decPart] = raw.split(".");
  const intClean = intPart.replace(/^0+(?=\d)|[^0-9]/g, "") || "0";
  // Safe thousand separator insertion
  let withSep = "";
  for (let i = 0; i < intClean.length; i++) {
    if (i !== 0 && (intClean.length - i) % 3 === 0) {
      withSep += separator;
    }
    withSep += intClean.charAt(i);
  }
  return decPart && decPart.length > 0 ? `${withSep}.${decPart}` : withSep;
}

const AmountInput = React.forwardRef<HTMLInputElement, AmountInputProps>(
  (
    {
      value = "",
      onValueChange,
      thousandSeparator = ",",
      allowDecimals = false,
      decimals = 2,
      className,
      chunks = 1,
      chunkLength = 3,
      ...rest
    },
    ref
  ) => {
    const singleMode = !chunks || chunks <= 1;

    // Single-field behavior (existing)
    const [display, setDisplay] = React.useState<string>("");
    const [rawValue, setRawValue] = React.useState<string>("");

    React.useEffect(() => {
      if (!singleMode) return;
      const raw = value == null ? "" : String(value);
      const latin = persianToLatinDigits(raw);
      const cleaned = allowDecimals ? latin.replace(/[^0-9.]/g, "") : latin.replace(/[^0-9]/g, "");
      setRawValue(cleaned);
      setDisplay(formatWithSeparator(cleaned, thousandSeparator));
    }, [value, thousandSeparator, allowDecimals, singleMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      const latin = persianToLatinDigits(input);
      let raw = allowDecimals ? latin.replace(/[^0-9.]/g, "") : latin.replace(/[^0-9]/g, "");

      if (allowDecimals && raw.includes(".")) {
        const parts = raw.split(".");
        const intPart = parts.shift() ?? "";
        const dec = parts.join("").slice(0, decimals);
        raw = dec.length > 0 ? `${intPart}.${dec}` : intPart;
      }

      setDisplay(formatWithSeparator(raw, thousandSeparator));
      setRawValue(raw);
      onValueChange?.(raw);

      if (rest.onChange) {
        try {
          const synthetic = {
            ...e,
            target: { ...e.target, value: raw, name: (rest as any).name }
          } as unknown as React.ChangeEvent<HTMLInputElement>;
          rest.onChange(synthetic);
        } catch {
          // some consumers (like react-hook-form's register) expect a normal event handler shape
        }
      }
    };

    // Chunked OTP-style behavior
    const chunkRefs = React.useRef<Array<HTMLInputElement | null>>([]);
    const buildInitChunks = React.useCallback(() => {
      const raw = value == null ? "" : String(value);
      const latin = persianToLatinDigits(raw).replace(/[^0-9]/g, "");
      if (!latin) {
        return Array.from({ length: chunks }).map(() => "0".repeat(chunkLength));
      }
      // split from right into groups of chunkLength
      const groups: string[] = [];
      let rem = latin;
      for (let i = 0; i < chunks; i++) {
        const start = Math.max(0, rem.length - chunkLength);
        const part = rem.slice(start);
        groups.unshift(part.padStart(chunkLength, "0"));
        rem = rem.slice(0, start);
      }
      return groups;
    }, [value, chunks, chunkLength]);

    const [chunkVals, setChunkVals] = React.useState<string[]>(() => buildInitChunks());

    React.useEffect(() => {
      if (singleMode) return;
      setChunkVals(buildInitChunks());
    }, [buildInitChunks, singleMode]);

    const assembleRaw = (arr: string[]) => arr.join("");

    const focusTo = (index: number) => {
      const el = chunkRefs.current[index];
      el?.focus();
      el?.select();
    };

    const handleChunkChange = (index: number, val: string) => {
      const latin = persianToLatinDigits(val).replace(/[^0-9]/g, "");
      const trimmed = latin.slice(0, chunkLength);
      const newChunks = [...chunkVals];
      newChunks[index] = trimmed.padStart(chunkLength, "0").slice(-chunkLength);
      setChunkVals(newChunks);
      onValueChange?.(assembleRaw(newChunks));

      if (trimmed.length >= chunkLength && index < chunks - 1) {
        focusTo(index + 1);
      }
    };

    const handleChunkKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
      const key = e.key;
      const val = (e.target as HTMLInputElement).value;
      if (key === "Backspace" && val.length === 0 && idx > 0) {
        e.preventDefault();
        focusTo(idx - 1);
      }
      if (key === "ArrowLeft" && idx < chunks - 1) {
        e.preventDefault();
        focusTo(idx + 1);
      }
      if (key === "ArrowRight" && idx > 0) {
        e.preventDefault();
        focusTo(idx - 1);
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, startIdx: number) => {
      e.preventDefault();
      const paste = e.clipboardData.getData("text");
      const latin = persianToLatinDigits(paste).replace(/[^0-9]/g, "");
      if (!latin) return;
      const combined =
        assembleRaw(chunkVals).slice(0, startIdx * chunkLength) +
        latin +
        assembleRaw(chunkVals).slice((startIdx + 1) * chunkLength);
      const newArr: string[] = [];
      let pos = 0;
      for (let i = 0; i < chunks; i++) {
        const part = combined.slice(pos, pos + chunkLength).padStart(chunkLength, "0");
        newArr.push(part.slice(-chunkLength));
        pos += chunkLength;
      }
      setChunkVals(newArr);
      onValueChange?.(assembleRaw(newArr));
    };

    if (!singleMode) {
      // when used inside native forms we want the submitted value to be the raw numeric string
      const hiddenName = rest.name;
      const visibleProps = { ...rest };
      if (hiddenName) delete visibleProps.name;
      if (visibleProps.onChange) delete visibleProps.onChange;

      return (
        <div className={`flex gap-2 ${className ?? ""}`}>
          {hiddenName && <input type="hidden" name={hiddenName} value={assembleRaw(chunkVals)} />}
          {Array.from({ length: chunks }).map((_, i) => (
            <Input
              key={i}
              ref={(el) => {
                chunkRefs.current.splice(i, 1, el);
              }}
              value={chunkVals[i] ?? ""}
              onChange={(e) => handleChunkChange(i, e.target.value)}
              onKeyDown={(e) => handleChunkKeyDown(e, i)}
              onPaste={(e) => handlePaste(e, i)}
              maxLength={chunkLength}
              inputMode="numeric"
              className="text-center w-17 sm:w-21"
              {...visibleProps}
            />
          ))}
        </div>
      );
    }

    return (
      <>
        {rest.name && <input type="hidden" name={rest.name} value={rawValue} />}
        <Input
          {...rest}
          ref={ref}
          name={rest.name ? undefined : rest.name}
          value={display}
          onChange={handleChange}
          inputMode={allowDecimals ? "decimal" : "numeric"}
          className={className}
        />
      </>
    );
  }
);

AmountInput.displayName = "AmountInput";

export default AmountInput;
