"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";

import { RoleAssignmentCard } from "@/components/entity-specific/role-assignment/role-assignment-card";
import { Button } from "@/components/ui/button";
import { CalendarHijri } from "@/components/ui/calendar-hijri";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose
} from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRoles } from "@/hooks/use-role";
import { useCreateRoleAssignment, useDeleteRoleAssignment, useRoleAssignments } from "@/hooks/use-role-assignment";
import { RoleAssignment } from "@/types/entities/role-assignment.type";

type Props = {
  userId: string;
  currentRoleId?: string | null;
};

type NewRow = { tempId: string; roleId?: string; expiresAt?: Date | undefined };

export function RoleAssignmentDialog({ userId }: Props) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  const { data: assignments } = useRoleAssignments({
    userId: userId,
    pageSize: 10
  });
  const { data: roles } = useRoles({ pageSize: 100 });

  const create = useCreateRoleAssignment();
  const remove = useDeleteRoleAssignment();

  const [newRows, setNewRows] = React.useState<NewRow[]>([]);
  const assignedRoleIds = React.useMemo(() => new Set((assignments?.data ?? []).map((a) => a.roleId)), [assignments]);
  const availableRoles = React.useMemo(
    () => (roles?.data ?? []).filter((r) => !assignedRoleIds.has(r.id)),
    [roles, assignedRoleIds]
  );
  console.log(assignments);
  React.useEffect(() => {
    if (!open) setNewRows([]);
  }, [open]);

  const handleAddRow = () => {
    setNewRows((s) => [...s, { tempId: String(Date.now()) }]);
  };

  const handleCreate = async (row: NewRow) => {
    if (!row.roleId) {
      toast.error("لطفاً یک نقش انتخاب کنید");
      return;
    }

    try {
      await create.mutateAsync({ userId, roleId: row.roleId, expiresAt: row.expiresAt });
      toast.success("نقش با موفقیت اضافه شد");
      setNewRows((s) => s.filter((r) => r.tempId !== row.tempId));
    } catch (err) {
      console.error(err);
      toast.error("خطا در افزودن نقش");
    }
  };

  const handleDelete = async (ra: RoleAssignment) => {
    const currentCount = assignments?.data.length ?? 0;
    if (currentCount <= 1) {
      toast.error("کاربر باید حداقل یک نقش داشته باشد");
      return;
    }

    try {
      await remove.mutateAsync(ra.id);
      toast.success("نقش حذف شد");
    } catch (err) {
      console.error(err);
      toast.error("خطا در حذف نقش");
    }
  };

  const content = (
    <div className="space-y-4 w-full">
      <div className="space-y-2">
        <label className="text-sm font-medium">نقش‌های فعلی</label>
        <div className="flex flex-col gap-2">
          {assignments?.data.map((ra) => (
            <RoleAssignmentCard key={ra.id} roleAssignment={ra} onDelete={() => handleDelete(ra)} />
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">افزودن نقش</label>
          <div className="text-xs text-muted-foreground">{availableRoles.length} نقش در دسترس</div>
        </div>

        <div className="p-3 rounded-md border bg-transparent shadow-sm">
          <div className="text-xs text-muted-foreground mb-2">
            نقش‌هایی که قبلاً به کاربر اختصاص داده نشده‌اند انتخاب کنید
          </div>

          <div className="flex flex-col gap-2">
            {newRows.map((row) => (
              <div key={row.tempId} className="p-3 rounded-md border bg-transparent">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="text-xs font-medium mb-1 block">نقش</label>
                    <Select
                      value={row.roleId}
                      onValueChange={(v) =>
                        setNewRows((s) => s.map((r) => (r.tempId === row.tempId ? { ...r, roleId: v } : r)))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="انتخاب نقش" />
                      </SelectTrigger>
                      <SelectContent side="top">
                        {availableRoles.length === 0 ? (
                          <SelectItem key="no-roles" value="" disabled>
                            نقشی برای افزودن موجود نیست
                          </SelectItem>
                        ) : (
                          availableRoles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="sm:col-span-1">
                    <label className="text-xs font-medium mb-1 block">انقضا</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full whitespace-nowrap text-sm">
                          {row.expiresAt ? new Date(row.expiresAt).toLocaleDateString("fa-IR") : "بدون انقضا"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0">
                        <CalendarHijri
                          selected={row.expiresAt}
                          onSelect={(d?: Date) => {
                            setNewRows((s) => s.map((r) => (r.tempId === row.tempId ? { ...r, expiresAt: d } : r)));
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setNewRows((s) => s.filter((r) => r.tempId !== row.tempId))}
                  >
                    لغو
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleCreate(row)}
                    disabled={!row.roleId || create.isPending}
                    aria-label="افزودن نقش"
                  >
                    افزودن
                  </Button>
                </div>
              </div>
            ))}

            {newRows.length === 0 && (
              <div className="text-sm text-muted-foreground">
                برای اضافه کردن نقش، روی «افزودن نقش» در پایین کلیک کنید.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button size="sm" variant="outline">
            مدیریت نقش‌ها
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-start">
            <DrawerTitle>نقش‌های کاربر</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 py-2">{content}</div>
          <DrawerFooter>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleAddRow} disabled={availableRoles.length === 0} aria-label="افزودن نقش">
                افزودن نقش
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  بستن
                </Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          مدیریت نقش‌ها
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>نقش‌های کاربر</DialogTitle>
        </DialogHeader>

        <div className="pt-2">{content}</div>
        <div className="flex items-center justify-end gap-2 mt-4">
          <Button size="sm" onClick={handleAddRow} disabled={availableRoles.length === 0} aria-label="افزودن نقش">
            افزودن نقش
          </Button>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            بستن
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RoleAssignmentDialog;
