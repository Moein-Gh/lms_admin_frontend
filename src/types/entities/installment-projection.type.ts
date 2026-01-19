import { type Installment } from "./installment.type";

export interface InstallmentPeriod {
  count: number;
  totalAmount: string;
  installments: InstallmentWithRelations[];
}

export interface CurrentMonthBreakdown {
  expected: InstallmentPeriod;
  paid: InstallmentPeriod;
  pending: InstallmentPeriod;
}

export interface InstallmentProjection {
  currentMonth: CurrentMonthBreakdown;
  nextMonth: InstallmentPeriod;
  next3Months: InstallmentPeriod;
}

export interface InstallmentWithRelations extends Omit<Installment, "loan"> {
  loan: {
    id: string;
    code: number;
    name: string;
    accountId: string;
    loanTypeId: string;
    userId: string;
    amount: string;
    startDate: string;
    paymentMonths: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    deletedAt: string | null;
    deletedBy: string | null;
    ownerId: string | null;
    createdBy: string | null;
    user: {
      id: string;
      code: number;
      status: string;
      createdAt: string;
      updatedAt: string;
      identityId: string;
      isDeleted: boolean;
      deletedAt: string | null;
      deletedBy: string | null;
      identity: {
        id: string;
        phone: string;
        email: string | null;
        name: string;
        countryCode: string;
        lastLoginAt: string | null;
        createdAt: string;
        updatedAt: string;
        isDeleted: boolean;
        deletedAt: string | null;
        deletedBy: string | null;
      };
    };
  };
  isDeleted: boolean;
}
