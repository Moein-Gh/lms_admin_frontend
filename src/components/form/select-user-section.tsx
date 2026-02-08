import { ComboboxFilter } from "@/components/filters/combobox-filter";
import { Label } from "@/components/ui/label";
import { useUsers } from "@/hooks/admin/use-user";

type UserItem = { id: string; name: string };
type Props = {
  items?: UserItem[];
  value: string | undefined;
  onChange: (val: string | undefined) => void;
  error?: boolean;
};

export function SelectUserSection({ items, value, onChange, error }: Props) {
  const { data: usersData } = useUsers({ pageSize: 100 }, { enabled: !items });
  const usersOptions: UserItem[] = (usersData?.data ?? []).map((u) => ({
    id: u.id,
    name: u.identity.name ?? String(u.identity.phone)
  }));

  const options = items ?? usersOptions;

  return (
    <div className="space-y-2">
      <Label htmlFor="auser" className="text-sm font-medium">
        کاربر
        <span className="text-destructive">*</span>
      </Label>
      <ComboboxFilter
        items={options}
        selectedValue={value}
        onSelect={onChange}
        getItemId={(i) => i.id}
        getItemLabel={(i) => i.name}
        placeholder="انتخاب کاربر"
        searchPlaceholder="جستجوی کاربر..."
        emptyMessage="کاربری یافت نشد"
        allLabel={""}
      />
      {error && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
    </div>
  );
}
