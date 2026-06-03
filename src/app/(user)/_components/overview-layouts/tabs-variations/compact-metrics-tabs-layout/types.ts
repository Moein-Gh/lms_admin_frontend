import type { UserOverviewDto } from "@/types/entities/user-overview.type";

export type TabType = "accounts" | "loans";

export type CompactMetricsTabContentProps = {
  readonly overview: UserOverviewDto;
};
