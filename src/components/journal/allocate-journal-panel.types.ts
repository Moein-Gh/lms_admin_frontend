export type AllocationKind = "ACCOUNT" | "SUBSCRIPTION_FEE" | "INSTALLMENT";

export type AllocationFormData = {
  userId: string;
  kind: AllocationKind;
  targetId: string;
  amount: string;
};
