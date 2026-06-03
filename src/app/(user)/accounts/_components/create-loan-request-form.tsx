import * as React from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useUserAccounts } from "@/hooks/user/use-account";
import { getApiErrorMessage } from "@/lib/api-error";
import type { CreateLoanRequestDto } from "@/lib/user-APIs/loan-request-api";
import { AccountStatus } from "@/types/entities/account.type";
import type { LoanRequest } from "@/types/entities/loan-request.type";
import { LoanRequestFormFooter } from "./loan-request-form-footer";
import { StepLoanRequestFields } from "./step-loan-request-fields";
import { StepSelectAccount } from "./step-select-account";

export type CreateLoanRequestFormProps = {
  defaultAccountId?: string;
  create: UseMutationResult<LoanRequest, unknown, CreateLoanRequestDto, unknown>;
  setOpen: (open: boolean) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
  hideFooter?: boolean;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  selectedAccountId: string | undefined;
  setSelectedAccountId: (id: string | undefined) => void;
};

export function CreateLoanRequestForm({
  defaultAccountId,
  create,
  setOpen,
  formRef,
  hideFooter = false,
  step,
  setStep,
  selectedAccountId,
  setSelectedAccountId
}: CreateLoanRequestFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
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

  const [calOpen, setCalOpen] = React.useState(false);

  const { data: accountsData, isLoading: accountsLoading } = useUserAccounts({
    status: AccountStatus.ACTIVE
  });
  const accounts = accountsData?.data ?? [];

  const startDateStr = useWatch({ control, name: "startDate" }) as string | undefined;
  const selectedStartDate = startDateStr ? new Date(startDateStr) : undefined;

  return (
    <form
      ref={formRef}
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
          control={control}
          setValue={setValue}
          register={register}
          errors={errors}
          selectedStartDate={selectedStartDate}
          calOpen={calOpen}
          setCalOpen={setCalOpen}
        />
      )}
      {!hideFooter && (
        <LoanRequestFormFooter
          step={step}
          setStep={setStep}
          selectedAccountId={selectedAccountId}
          reset={reset}
          setOpen={setOpen}
          create={create}
        />
      )}
    </form>
  );
}
