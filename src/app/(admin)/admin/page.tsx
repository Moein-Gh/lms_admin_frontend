import { Separator } from "@/components/ui/separator";
import { LoanRequestsWidget } from "./_components/summary/_components/loan-requests-widget";
import EntitiesSummary from "./_components/summary/entities-summary";
import FinancialSummary from "./_components/summary/financial-summary";

export default function Page() {
  return (
    <div className="space-y-4">
      <FinancialSummary />
      <Separator className="my-4 md:my-4" />
      <EntitiesSummary />
      <Separator className="my-4 md:my-4" />
      <LoanRequestsWidget />
    </div>
  );
}
