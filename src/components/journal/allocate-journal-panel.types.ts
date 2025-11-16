import { AllocationType } from "@/types/entities/journal-entry.type";

export type AllocationFormData = {
  userId: string;
  allocationType: AllocationType;
  accountId?: string;
  loanId?: string;
  targetId: string;
  amount: string;
};
