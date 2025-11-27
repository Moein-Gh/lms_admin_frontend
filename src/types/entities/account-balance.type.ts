export type AccountBalanceSummary = {
  readonly accountId: string;
  readonly accountDeposits: {
    readonly count: number;
    readonly amount: number;
  };
  readonly subscriptionFeeDeposits: {
    readonly count: number;
    readonly amount: number;
  };
  readonly totalDeposits: number;
};
