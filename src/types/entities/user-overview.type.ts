export type UserOverviewDto = {
  readonly activeAccountsCount: number;
  readonly totalAccountBalance: string;
  readonly activeLoansCount: number;
  readonly totalLoanAmount: string;
  readonly totalLoanPaid: string;
  readonly totalLoanOutstanding: string;
  readonly loanPaymentPercentage: number;
};
