"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// Replaced OTP component with a simple input for reliability
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { useRequestSms, useVerifySms } from "@/hooks/use-auth";
import type { ProblemDetails } from "@/types/api";

const PhoneSchema = z.object({
  phone: z
    .string()
    .refine(isValidPhoneNumber, { message: "شماره تلفن معتبر وارد کنید" }),
});

const CodeSchema = z.object({
  code: z.string().length(6, { message: "کد باید ۶ رقم باشد" }),
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
      phone: "",
    },
  });

  const codeForm = useForm<z.infer<typeof CodeSchema>>({
    resolver: zodResolver(CodeSchema),
    defaultValues: {
      code: "",
    },
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
      onTitleChange?.(
        "ورود",
        "برای ورود به سیستم، شماره موبایل خود را وارد کنید",
      );
    } else {
      onTitleChange?.(
        "تایید کد",
        `کد تایید ارسال شده به شماره ${phone} را وارد کنید`,
      );
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
        purpose: "login",
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
          const message =
            axiosError.response?.data.detail ??
            "خطا در ارسال کد. دوباره تلاش کنید";
          toast.error(message);
        },
      },
    );
  };

  const onCodeSubmit = async (data: z.infer<typeof CodeSchema>) => {
    verifySmsMutation.mutate(
      {
        phone,
        code: data.code,
        purpose: "login",
      },
      {
        onSuccess: () => {
          toast.success("ورود موفقیت‌آمیز");
          router.push("/dashboard/default");
        },
        onError: (error: Error) => {
          const axiosError = error as AxiosError<ProblemDetails>;
          const message = axiosError.response?.data.detail ?? "کد نامعتبر است";
          toast.error(message);
        },
      },
    );
  };

  if (step === "phone") {
    return (
      <Form {...phoneForm}>
        <form
          onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}
          className="space-y-4"
        >
          <FormField
            control={phoneForm.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>شماره موبایل</FormLabel>
                <FormControl>
                  <PhoneInput
                    placeholder="9xxxxxxxxx"
                    defaultCountry="IR"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="w-full"
            type="submit"
            disabled={requestSmsMutation.isPending}
          >
            {requestSmsMutation.isPending
              ? "در حال ارسال..."
              : "دریافت کد تایید"}
          </Button>
        </form>
      </Form>
    );
  }

  return (
    <Form {...codeForm}>
      <form
        onSubmit={codeForm.handleSubmit(onCodeSubmit)}
        className="space-y-4"
      >
        <FormField
          control={codeForm.control}
          name="code"
          render={() => (
            <FormItem>
              <FormLabel>کد تایید</FormLabel>
              <FormControl>
                <Input
                  dir="ltr"
                  type="text"
                  className="text-foreground"
                  placeholder="123456"
                  value={rawCode}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRawCode(val);
                    // Keep RHF in sync without triggering validation while typing
                    codeForm.setValue("code", val, {
                      shouldValidate: false,
                      shouldDirty: true,
                    });
                    // Hide any prior validation error until submit
                    codeForm.clearErrors("code");
                  }}
                  autoFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          type="submit"
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
          {countdown > 0
            ? `درخواست کد جدید (${countdown} ثانیه)`
            : "درخواست کد جدید"}
        </Button>
      </form>
    </Form>
  );
}
