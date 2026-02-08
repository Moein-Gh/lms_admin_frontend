"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLoanType, useUpdateLoanType } from "@/hooks/admin/use-loan-type";
import { LoanType } from "@/types/entities/loan-type.type";

const loanTypeSchema = z
  .object({
    name: z.string().min(1, "نام الزامی است"),
    commissionPercentage: z.coerce.number().min(0).max(100, "درصد کارمزد باید بین ۰ تا ۱۰۰ باشد"),
    defaultInstallments: z.coerce.number().min(1, "تعداد اقساط پیش‌فرض الزامی است"),
    minInstallments: z.coerce.number().min(1, "حداقل تعداد اقساط الزامی است"),
    maxInstallments: z.coerce.number().min(1, "حداکثر تعداد اقساط الزامی است"),
    creditRequirementPct: z.coerce.number().min(0).max(100, "درصد اعتبار مورد نیاز باید بین ۰ تا ۱۰۰ باشد"),
    description: z.string().optional().nullable()
  })
  .refine((data) => data.maxInstallments >= data.minInstallments, {
    message: "حداکثر اقساط نمی‌تواند کمتر از حداقل اقساط باشد",
    path: ["maxInstallments"]
  });

type LoanTypeFormValues = z.infer<typeof loanTypeSchema>;

interface LoanTypeFormProps {
  initialData?: LoanType;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function LoanTypeForm({ initialData, onSuccess, onCancel }: LoanTypeFormProps) {
  const createMutation = useCreateLoanType();
  const updateMutation = useUpdateLoanType();

  const form = useForm<LoanTypeFormValues>({
    resolver: zodResolver(loanTypeSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      commissionPercentage: initialData?.commissionPercentage ?? 0,
      defaultInstallments: initialData?.defaultInstallments ?? 12,
      minInstallments: initialData?.minInstallments ?? 1,
      maxInstallments: initialData?.maxInstallments ?? 24,
      creditRequirementPct: initialData?.creditRequirementPct ?? 0,
      description: initialData?.description ?? ""
    }
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  async function onSubmit(values: LoanTypeFormValues) {
    try {
      if (initialData) {
        await updateMutation.mutateAsync({
          loanTypeId: initialData.id,
          data: values
        });
        toast.success("نوع وام با موفقیت بروزرسانی شد");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("نوع وام جدید با موفقیت ایجاد شد");
      }
      onSuccess?.();
    } catch {
      toast.error("خطایی رخ داده است");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نام نوع وام</FormLabel>
              <FormControl>
                <Input placeholder="مثلا: وام قرض‌الحسنه" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="commissionPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>درصد کارمزد</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="creditRequirementPct"
            render={({ field }) => (
              <FormItem>
                <FormLabel>درصد اعتبار مورد نیاز</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="minInstallments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>حداقل اقساط</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxInstallments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>حداکثر اقساط</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="defaultInstallments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اقساط پیش‌فرض</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>توضیحات</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="توضیحات اختیاری..."
                  className="resize-none"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
          <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
            {initialData ? "بروزرسانی" : "ایجاد"}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="w-fit self-end sm:w-auto sm:order-first"
            >
              انصراف
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
