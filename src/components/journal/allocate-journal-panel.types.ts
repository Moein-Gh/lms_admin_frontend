import { AllocationType } from "@/types/entities/journal-entry.type";

export type AllocationItem = {
  targetId: string;
  amount: number;
};

export type AllocationFormData = {
  userId: string;
  allocationType: AllocationType;
  accountId?: string;
  loanId?: string;
  items: AllocationItem[];
};
