import { Separator } from "@/components/ui/separator";
import Summary from "./_components/summary/summary";

export default function Page() {
  return (
    <div>
      <Summary />
      <Separator className="my-4 md:my-4" />
    </div>
  );
}
