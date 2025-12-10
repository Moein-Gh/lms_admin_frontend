"use client";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { RoleAssignment } from "@/types/entities/role-assignment.type";

type RoleAssignmentCardProps = {
  readonly roleAssignment: RoleAssignment;
  readonly onDelete: () => void;
};

export const RoleAssignmentCard = ({ roleAssignment, onDelete }: RoleAssignmentCardProps) => {
  return (
    <div className="p-4 rounded-md border bg-transparent" data-slot="role-assignment-card-detailed">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">{roleAssignment.role?.name ?? roleAssignment.roleId}</div>
          <div className="text-xs text-muted-foreground">اختصاص داده شده: {formatDate(roleAssignment.createdAt)}</div>
          <div className="mt-2 text-sm text-muted-foreground">{roleAssignment.role?.description}</div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-xs text-muted-foreground">
            {roleAssignment.expiresAt ? formatDate(roleAssignment.expiresAt) : "بدون انقضا"}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="destructive" onClick={onDelete}>
              حذف
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
