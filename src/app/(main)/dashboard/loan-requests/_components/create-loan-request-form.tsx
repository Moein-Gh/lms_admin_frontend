import * as React from "react";
import { UseMutationResult, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAccounts } from "@/hooks/use-account";
import { getApiErrorMessage } from "@/lib/api-error";
import { type CreateLoanRequestDto } from "@/lib/loan-request-api";
import { listUsers } from "@/lib/user-api";
import { AccountStatus } from "@/types/entities/account.type";
import type { LoanRequest } from "@/types/entities/loan-request.type";
import { StepSelectUserAccount } from "../../loans/_components/step-select-user-account";
import { LoanRequestFormFooter } from "./loan-request-form-footer";
import { StepLoanRequestFields } from "./step-loan-request-fields";

export type CreateLoanRequestFormProps = {
  isMobile: boolean;
  create: UseMutationResult<LoanRequest, unknown, CreateLoanRequestDto, unknown>;
  setOpen: (open: boolean) => void;
};

export function CreateLoanRequestForm({ isMobile, create, setOpen }: CreateLoanRequestFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<CreateLoanRequestDto>({
    defaultValues: {
      accountId: "",
      amount: "",
      startDate: new Date().toISOString(),
      paymentMonths: 10
    }
  });

  const { data: users } = useQuery({
    queryKey: ["users", "list"],
    queryFn: () => listUsers({ pageSize: 100 })
  });
  const usersOptions = users ? users.data.map((u) => ({ id: u.id, name: u.identity?.name ?? "بدون نام" })) : [];
  const [step, setStep] = React.useState(1);
  const [selectedUser, setSelectedUser] = React.useState<string | undefined>(undefined);
  const [selectedAccountId, setSelectedAccountId] = React.useState<string | undefined>(undefined);
  const { data: accountsData, isLoading: accountsLoading } = useAccounts(
    { userId: selectedUser, pageSize: 100, status: AccountStatus.ACTIVE },
    { enabled: !!selectedUser }
  );

  const selectedStartDateString = watch("startDate");
  const selectedStartDate = selectedStartDateString ? new Date(selectedStartDateString) : undefined;
  const [calOpen, setCalOpen] = React.useState(false);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        const payload: CreateLoanRequestDto = {
          ...data,
          accountId: selectedAccountId ?? data.accountId,
          paymentMonths: Number(data.paymentMonths),
          startDate: data.startDate // Already in ISO string format
        };
        create.mutate(payload, {
          onSuccess: () => {
            toast.success("درخواست وام با موفقیت ایجاد شد");
            setOpen(false);
            reset();
          },
          onError: (error: unknown) => {
            toast.error(getApiErrorMessage(error, "خطا در ایجاد درخواست وام"));
          }
        });
      })}
      className="space-y-5 py-4"
    >
      {step === 1 && (
        <StepSelectUserAccount
          usersOptions={usersOptions}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          selectedAccountId={selectedAccountId}
          setSelectedAccountId={setSelectedAccountId}
          setValue={setValue}
          accountsData={accountsData}
          accountsLoading={accountsLoading}
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
        selectedUser={selectedUser}
        selectedAccountId={selectedAccountId}
        reset={reset}
        setOpen={setOpen}
        create={create}
        isMobile={isMobile}
      />
    </form>
  );
}
