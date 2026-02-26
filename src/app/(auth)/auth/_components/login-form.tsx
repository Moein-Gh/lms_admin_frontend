"use client";

import * as React from "react";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { OTPInputContext } from "input-otp";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup } from "@/components/ui/input-otp";
import { PhoneInput } from "@/components/ui/phone-input";
import { useRequestSms, useVerifySms } from "@/hooks/auth/use-auth";
import { getMe } from "@/lib/admin-APIs/user-api";
import { cn } from "@/lib/utils";
import type { ProblemDetails } from "@/types/api";
import { RoleAssignmentStatus } from "@/types/entities/role-assignment.type";

const toFarsi = (v: string) => v.replace(/[0-9]/g, (d) => String.fromCharCode(d.charCodeAt(0) + 0x06c0));

function OTPSlot({ index }: { index: number }) {
  const ctx = React.useContext(OTPInputContext);
  const slot = ctx.slots.at(index);
  const char = slot?.char;
  const hasFakeCaret = slot?.hasFakeCaret;
  const isActive = slot?.isActive;
  return (
    <div
      className={cn(
        "relative flex h-11 w-9 items-end justify-center pb-1 text-lg transition-colors",
        "border-b-2 border-muted-foreground/25",
        isActive && "border-b-foreground"
      )}
    >
      {char != null ? toFarsi(char) : null}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink h-5 w-px bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
}

const PhoneSchema = z.object({
  phone: z
    .string()
    .min(1, { message: "شماره موبایل الزامی است" })
    .refine(isValidPhoneNumber, { message: "شماره تلفن معتبر وارد کنید" })
});

const CodeSchema = z.object({
  code: z.string().min(1, { message: "کد تایید الزامی است" }).length(6, { message: "کد باید ۶ رقم باشد" })
});

type LoginFormProps = {
  onTitleChange?: (title: string, description: string) => void;
};

export function LoginForm({ onTitleChange }: LoginFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  // Country code is sent directly in the request; no need to keep it in state
  const [countdown, setCountdown] = useState(0);
  // Local state ensures the input always reflects what the user types
  const [rawCode, setRawCode] = useState("");

  const requestSmsMutation = useRequestSms();
  const verifySmsMutation = useVerifySms();

  const phoneForm = useForm<z.infer<typeof PhoneSchema>>({
    resolver: zodResolver(PhoneSchema),
    defaultValues: {
      phone: ""
    }
  });

  const codeForm = useForm<z.infer<typeof CodeSchema>>({
    resolver: zodResolver(CodeSchema),
    defaultValues: {
      code: ""
    }
  });

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Update title when step changes
  useEffect(() => {
    if (step === "phone") {
      onTitleChange?.("ورود", "برای ورود به سیستم، شماره موبایل خود را وارد کنید");
    } else {
      onTitleChange?.("تایید کد", `کد تایید ارسال شده به شماره ${phone} را وارد کنید`);
    }
  }, [step, phone, onTitleChange]);

  const onPhoneSubmit = async (data: z.infer<typeof PhoneSchema>) => {
    // Parse phone number using react-phone-number-input
    const phoneNumber = data.phone;
    const parsed = parsePhoneNumber(phoneNumber);

    if (!parsed) {
      toast.error("فرمت شماره تلفن نامعتبر است");
      return;
    }

    const extractedCountryCode = `+${parsed.countryCallingCode}`;
    const extractedPhone = parsed.nationalNumber;

    requestSmsMutation.mutate(
      {
        phone: extractedPhone,
        countryCode: extractedCountryCode,
        purpose: "login"
      },
      {
        onSuccess: () => {
          setPhone(extractedPhone);
          // Reset any previously entered verification code when entering code step
          setRawCode("");
          codeForm.reset({ code: "" });
          setStep("code");
          setCountdown(30); // Start 30 second countdown
          toast.success("کد تایید ارسال شد");
        },
        onError: (error: Error) => {
          const axiosError = error as AxiosError<ProblemDetails>;
          const message = axiosError.response?.data.detail ?? "خطا در ارسال کد. دوباره تلاش کنید";
          toast.error(message);
        }
      }
    );
  };

  const onCodeSubmit = async (data: z.infer<typeof CodeSchema>) => {
    verifySmsMutation.mutate(
      {
        phone,
        code: data.code,
        purpose: "login"
      },
      {
        onSuccess: async () => {
          try {
            const user = await getMe();

            const hasAccountHolder = user.roleAssignments?.some(
              (assignment) =>
                assignment.role?.key === "account-holder" && assignment.status === RoleAssignmentStatus.ACTIVE
            );

            if (hasAccountHolder) {
              router.push("/");
              return;
            }

            const hasAdmin = user.roleAssignments?.some(
              (assignment) => assignment.role?.key === "admin" && assignment.status === RoleAssignmentStatus.ACTIVE
            );

            if (hasAdmin) {
              router.push("/admin");
              return;
            }

            // fallback to user dashboard
            router.push("/");
          } catch {
            // If fetching user fails, fall back to admin route (legacy behavior)
            router.push("/admin");
          }
        },
        onError: (error: Error) => {
          const axiosError = error as AxiosError<ProblemDetails>;
          const message = axiosError.response?.data.detail ?? "کد نامعتبر است";
          toast.error(message);
        }
      }
    );
  };

  if (step === "phone") {
    return (
      <Form {...phoneForm}>
        <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
          <FormField
            control={phoneForm.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>شماره موبایل</FormLabel>
                <FormControl>
                  <PhoneInput placeholder="۹۱۲۳۴۵۶۷۸۹" defaultCountry="IR" required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit" disabled={requestSmsMutation.isPending}>
            {requestSmsMutation.isPending ? "در حال ارسال..." : "دریافت کد تایید"}
          </Button>
        </form>
      </Form>
    );
  }

  return (
    <Form {...codeForm}>
      <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="space-y-4">
        <FormField
          control={codeForm.control}
          name="code"
          render={() => (
            <FormItem>
              <FormControl>
                <div dir="ltr" style={{ direction: "ltr" }}>
                  <InputOTP
                    maxLength={6}
                    value={rawCode}
                    autoFocus
                    pattern="[0-9]*"
                    inputMode="numeric"
                    containerClassName="[direction:ltr]"
                    style={{ direction: "ltr" }}
                    onChange={(val) => {
                      const digits = val.replace(/\D/g, "");
                      setRawCode(digits);
                      codeForm.setValue("code", digits, { shouldValidate: false, shouldDirty: true });
                      codeForm.clearErrors("code");
                    }}
                  >
                    <InputOTPGroup className="w-full justify-center gap-4">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <OTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full mt-6"
          type="submit"
          variant="outline"
          disabled={verifySmsMutation.isPending || rawCode.length !== 6}
        >
          {verifySmsMutation.isPending ? "در حال ورود..." : "ورود"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => {
            setStep("phone");
            setCountdown(0);
            // Clear the code input when returning to phone step
            setRawCode("");
            codeForm.reset({ code: "" });
          }}
          disabled={countdown > 0}
        >
          {countdown > 0 ? `درخواست کد جدید (${countdown} ثانیه)` : "درخواست کد جدید"}
        </Button>
      </form>
    </Form>
  );
}
