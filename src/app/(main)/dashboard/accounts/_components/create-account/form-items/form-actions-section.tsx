import { Button } from "@/components/ui/button";

type Props = {
  isPending: boolean;
  onReset: () => void;
};

export function FormActionsSection({ isPending, onReset }: Props) {
  return (
    <div className="flex gap-3 pt-4">
      <Button type="submit" className="flex-1" disabled={isPending}>
        {isPending ? "در حال ایجاد..." : "ایجاد حساب"}
      </Button>
      <Button type="button" variant="outline" onClick={onReset}>
        پاک کردن
      </Button>
    </div>
  );
}
