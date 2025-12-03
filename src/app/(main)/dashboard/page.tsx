import { Separator } from "@/components/ui/separator";
import EntitiesSummary from "./_components/summary/entities-summary";
import FinancialSummary from "./_components/summary/financial-summary";

export default function Page() {
  return (
    <div>
      <FinancialSummary />
      <Separator className="my-4 md:my-4" />
      <EntitiesSummary />
    </div>
  );
}
