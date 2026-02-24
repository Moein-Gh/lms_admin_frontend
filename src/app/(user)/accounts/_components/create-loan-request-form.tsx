import * as React from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUserAccounts } from "@/hooks/user/use-account";
import { getApiErrorMessage } from "@/lib/api-error";
import type { CreateLoanRequestDto } from "@/lib/user-APIs/loan-request-api";
import type { LoanRequest } from "@/types/entities/loan-request.type";
import { LoanRequestFormFooter } from "./loan-request-form-footer";
import { StepLoanRequestFields } from "./step-loan-request-fields";
import { StepSelectAccount } from "./step-select-account";

export type CreateLoanRequestFormProps = {
  defaultAccountId?: string;
  create: UseMutationResult<LoanRequest, unknown, CreateLoanRequestDto, unknown>;
  setOpen: (open: boolean) => void;
};

export function CreateLoanRequestForm({ defaultAccountId, create, setOpen }: CreateLoanRequestFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<CreateLoanRequestDto>({
    defaultValues: {
      accountId: defaultAccountId ?? "",
      amount: "",
      startDate: new Date().toISOString(),
      paymentMonths: 10
    }
  });

  const [step, setStep] = React.useState(1);
  const [selectedAccountId, setSelectedAccountId] = React.useState<string | undefined>(defaultAccountId);
  const [calOpen, setCalOpen] = React.useState(false);

  const { data: accountsData, isLoading: accountsLoading } = useUserAccounts();
  const accounts = accountsData?.data ?? [];

  const selectedStartDateString = watch("startDate");
  const selectedStartDate = selectedStartDateString ? new Date(selectedStartDateString) : undefined;

  return (
    <form
      onSubmit={handleSubmit((data) => {
        const payload: CreateLoanRequestDto = {
          ...data,
          accountId: selectedAccountId ?? data.accountId,
          paymentMonths: Number(data.paymentMonths),
          startDate: data.startDate
        };
        create.mutate(payload, {
          onSuccess: () => {
            toast.success("درخواست وام با موفقیت ثبت شد");
            setOpen(false);
            reset();
          },
          onError: (error: unknown) => {
            toast.error(getApiErrorMessage(error, "خطا در ثبت درخواست وام"));
          }
        });
      })}
      className="space-y-5 py-4"
    >
      {step === 1 && (
        <StepSelectAccount
          accounts={accounts}
          isLoading={accountsLoading}
          selectedAccountId={selectedAccountId}
          setSelectedAccountId={setSelectedAccountId}
          setValue={setValue}
        />
      )}
      {step === 2 && (
        <StepLoanRequestFields
          setValue={setValue}
          register={register}
          errors={errors}
          selectedStartDate={selectedStartDate}
          calOpen={calOpen}
          setCalOpen={setCalOpen}
        />
      )}
      <LoanRequestFormFooter
        step={step}
        setStep={setStep}
        selectedAccountId={selectedAccountId}
        reset={reset}
        setOpen={setOpen}
        create={create}
      />
    </form>
  );
}
