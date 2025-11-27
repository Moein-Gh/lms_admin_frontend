export type LoanBalanceSummary = {
  loanId: string;
  loanAmount: number;
  repayments: DipositDetails;
  outstandingBalance: number;
  paidPercentage: number;
};

export type DipositDetails = {
  count: number;
  amount: number;
};
