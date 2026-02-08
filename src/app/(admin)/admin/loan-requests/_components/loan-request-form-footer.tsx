import type { UseMutationResult } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { CreateLoanRequestDto } from "@/lib/admin-APIs/loan-request-api";
import type { LoanRequest } from "@/types/entities/loan-request.type";

type LoanRequestFormFooterProps = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  selectedUser: string | undefined;
  selectedAccountId: string | undefined;
  reset: () => void;
  setOpen: (open: boolean) => void;
  create: UseMutationResult<LoanRequest, unknown, CreateLoanRequestDto, unknown>;
  isMobile: boolean;
};

export function LoanRequestFormFooter({
  step,
  setStep,
  selectedUser,
  selectedAccountId,
  reset,
  setOpen,
  create,
  isMobile
}: LoanRequestFormFooterProps) {
  return (
    <div className="flex gap-3 pt-4">
      {step === 1 ? (
        <>
          <Button
            type="button"
            className="flex-1"
            onClick={() => setStep(2)}
            disabled={!selectedUser || !selectedAccountId}
          >
            بعدی
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              setOpen(false);
            }}
          >
            لغو
          </Button>
        </>
      ) : (
        <>
          <Button type="submit" className="flex-1" disabled={create.isPending}>
            {create.isPending ? "در حال ایجاد..." : "ایجاد درخواست"}
          </Button>
          <Button type="button" variant="outline" onClick={() => setStep(1)}>
            بازگشت
          </Button>
        </>
      )}
    </div>
  );
}
