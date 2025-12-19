import * as React from "react";
import { UseMutationResult, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAccounts } from "@/hooks/use-account";
import { type CreateLoanRequest } from "@/lib/loan-api";
import { listUsers } from "@/lib/user-api";
import { AccountStatus } from "@/types/entities/account.type";
import type { Loan } from "@/types/entities/loan.type";
import { FormFooter } from "./form-footer";
import { StepLoanFields } from "./step-loan-fields";
import { StepSelectUserAccount } from "./step-select-user-account";

export type CreateLoanFormProps = {
  types: { id: string; name: string }[];
  accounts: { id: string; name: string }[];
  isMobile: boolean;
  create: UseMutationResult<Loan, unknown, CreateLoanRequest, unknown>;
  setOpen: (open: boolean) => void;
};

export function CreateLoanForm({ types, accounts, isMobile, create, setOpen }: CreateLoanFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<CreateLoanRequest>({
    defaultValues: {
      accountId: "",
      loanTypeId: "",
      name: "",
      amount: "",
      startDate: new Date(),
      paymentMonths: 10
    }
  });

  const [selectedLoanTypeLocal, setSelectedLoanTypeLocal] = React.useState<string | undefined>(undefined);
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
  void accounts;
  const selectedLoanType = watch("loanTypeId");
  const selectedStartDate = watch("startDate");
  const [calOpen, setCalOpen] = React.useState(false);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        const payload: CreateLoanRequest = {
          ...data,
          loanTypeId: selectedLoanTypeLocal ?? data.loanTypeId,
          accountId: selectedAccountId ?? data.accountId
        };
        create.mutate(payload, {
          onSuccess: () => {
            toast.success("وام با موفقیت ایجاد شد");
            setOpen(false);
            reset();
          },
          onError: (error: unknown) => {
            toast.error("خطا در ایجاد وام");
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
        <StepLoanFields
          types={types}
          selectedLoanTypeLocal={selectedLoanTypeLocal}
          setSelectedLoanTypeLocal={setSelectedLoanTypeLocal}
          selectedLoanType={selectedLoanType}
          setValue={setValue}
          register={register}
          errors={errors}
          selectedStartDate={selectedStartDate}
          calOpen={calOpen}
          setCalOpen={setCalOpen}
        />
      )}
      <FormFooter
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
