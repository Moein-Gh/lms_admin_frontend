"use client";

import * as React from "react";
import { CalendarIcon, Plus, Trash2, Clock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarHijri } from "@/components/ui/calendar-hijri";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRoles } from "@/hooks/use-role";
import { useCreateRoleAssignment, useDeleteRoleAssignment, useRoleAssignments } from "@/hooks/use-role-assignment";
import { cn, formatDate } from "@/lib/utils";
import { RoleAssignment } from "@/types/entities/role-assignment.type";

type Props = {
  userId: string;
};

export function RoleAssignmentDialog({ userId }: Props) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  // Data Fetching
  const { data: assignments } = useRoleAssignments({
    userId: userId,
    pageSize: 100 // Fetch all to be safe
  });
  const { data: roles } = useRoles({ pageSize: 100 });

  // Mutations
  const create = useCreateRoleAssignment();
  const remove = useDeleteRoleAssignment();

  // State for new assignment
  const [selectedRoleId, setSelectedRoleId] = React.useState<string>("");
  const [expiresAt, setExpiresAt] = React.useState<Date | undefined>(undefined);

  // Derived State
  const activeAssignments = React.useMemo(() => {
    const all = assignments?.data ?? [];
    return all.filter((a) => a.isActive !== false);
  }, [assignments]);

  const assignedRoleIds = React.useMemo(() => new Set(activeAssignments.map((a) => a.roleId)), [activeAssignments]);

  const availableRoles = React.useMemo(
    () => (roles?.data ?? []).filter((r) => !assignedRoleIds.has(r.id)),
    [roles, assignedRoleIds]
  );

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setSelectedRoleId("");
      setExpiresAt(undefined);
    }
  }, [open]);

  // Handlers
  const handleCreate = async () => {
    if (!selectedRoleId) return;

    try {
      await create.mutateAsync({ userId, roleId: selectedRoleId, expiresAt });
      toast.success("نقش با موفقیت اضافه شد");
      setSelectedRoleId("");
      setExpiresAt(undefined);
    } catch (err) {
      console.error(err);
      toast.error("خطا در افزودن نقش");
    }
  };

  const handleDelete = async (ra: RoleAssignment) => {
    try {
      await remove.mutateAsync(ra.id);
      toast.success("نقش حذف شد");
    } catch (err) {
      console.error(err);
      toast.error("خطا در حذف نقش");
    }
  };

  // Render Content
  const content = (
    <div className="space-y-6">
      {/* List of Current Roles */}
      <div className="space-y-3">
        {activeAssignments.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
            این کاربر هیچ نقشی ندارد.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {activeAssignments.map((ra) => (
              <div
                key={ra.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-medium text-sm truncate">{ra.role?.name ?? "نقش نامشخص"}</span>
                  {ra.expiresAt && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 h-5 gap-1 font-normal text-muted-foreground"
                    >
                      <Clock className="w-3 h-3" />
                      {formatDate(ra.expiresAt)}
                    </Badge>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                  onClick={() => handleDelete(ra)}
                  disabled={remove.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="sr-only">حذف نقش</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Add New Role Form */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">افزودن نقش جدید</Label>
          {availableRoles.length === 0 && (
            <span className="text-xs text-muted-foreground">همه نقش‌ها اختصاص داده شده‌اند</span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex w-full gap-3 sm:contents">
            <div className="flex-1 space-y-1.5 min-w-0">
              <span className="text-xs text-muted-foreground px-1">نقش</span>
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId} disabled={availableRoles.length === 0}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="انتخاب نقش..." />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 sm:w-[160px] sm:flex-none space-y-1.5 min-w-0">
              <span className="text-xs text-muted-foreground px-1">انقضا</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-9 justify-start text-left font-normal px-3",
                      !expiresAt && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                    {expiresAt ? (
                      <span className="truncate">{new Date(expiresAt).toLocaleDateString("fa-IR")}</span>
                    ) : (
                      <span>بدون انقضا</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarHijri selected={expiresAt} onSelect={setExpiresAt} disabled={(date) => date < new Date()} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button
            className="w-full sm:w-auto h-9"
            onClick={handleCreate}
            disabled={!selectedRoleId || create.isPending}
          >
            <Plus className="w-4 h-4 sm:ml-2" />
            <span className="sm:inline">افزودن</span>
          </Button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button size="sm" variant="outline" aria-label="مدیریت نقش‌ها">
            <ShieldCheck className="size-4" />
            {!isMobile && <span className="me-2">مدیریت نقش‌ها</span>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-start">
            <DrawerTitle>مدیریت نقش‌های کاربر</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 py-2 pb-8">{content}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" aria-label="مدیریت نقش‌ها">
          <ShieldCheck className="size-4" />
          {!isMobile && <span className="me-2">مدیریت نقش‌ها</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>مدیریت نقش‌های کاربر</DialogTitle>
        </DialogHeader>
        <div className="py-2">{content}</div>
      </DialogContent>
    </Dialog>
  );
}

export default RoleAssignmentDialog;
