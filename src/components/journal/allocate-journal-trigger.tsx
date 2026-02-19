import { Split } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function AllocateJournalTrigger({ onClick }: { readonly onClick: () => void }) {
  return (
    <Button variant="outline" size="sm" onClick={onClick}>
      <Split className="size-4" />
      تخصیص تراکنش
    </Button>
  );
}
