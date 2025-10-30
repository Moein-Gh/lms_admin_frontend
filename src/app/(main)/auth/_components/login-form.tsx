"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
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
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { useRequestSms, useVerifySms } from "@/hooks/use-auth";

const PhoneSchema = z.object({
  phone: z
    .string()
    .refine(isValidPhoneNumber, { message: "شماره تلفن معتبر وارد کنید" }),
});

const CodeSchema = z.object({
  code: z.string().length(6, { message: "کد باید ۶ رقم باشد" }),
});

export function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");

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

  const onPhoneSubmit = async (data: z.infer<typeof PhoneSchema>) => {
    // Extract country code and phone number from E.164 format
    const phoneNumber = data.phone;
    const match = phoneNumber.match(/^\+(\d{1,3})(\d+)$/);

    if (!match) {
      toast.error("فرمت شماره تلفن نامعتبر است");
      return;
    }

    const extractedCountryCode = `+${match[1]}`;
    const extractedPhone = match[2];

    requestSmsMutation.mutate(
      {
        phone: extractedPhone,
        countryCode: extractedCountryCode,
        purpose: "login",
      },
      {
        onSuccess: () => {
          setPhone(extractedPhone);
          setCountryCode(extractedCountryCode);
          setStep("code");
          toast.success("کد تایید ارسال شد");
        },
        onError: () => {
          toast.error("خطا در ارسال کد. دوباره تلاش کنید");
        },
      }
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
        onError: () => {
          toast.error("کد نامعتبر است");
        },
      }
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>کد تایید</FormLabel>
              <FormControl>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  dir="ltr"
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
          disabled={verifySmsMutation.isPending}
        >
          {verifySmsMutation.isPending ? "در حال ورود..." : "ورود"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => setStep("phone")}
        >
          بازگشت
        </Button>
      </form>
    </Form>
  );
}
