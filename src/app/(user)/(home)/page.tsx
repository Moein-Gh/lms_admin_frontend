"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-current-user";
import { RoleAssignmentStatus } from "@/types/entities/role-assignment.type";

export default function UserDashboardPage() {
  const router = useRouter();
  const { data: user } = useAuth();

  const hasAdminRole = user?.roleAssignments?.some(
    (assignment) => assignment.role?.key === "admin" && assignment.status === RoleAssignmentStatus.ACTIVE
  );

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">داشبورد کاربری</h1>
        <p className="text-muted-foreground">به زودی...</p>

        {hasAdminRole && <Button onClick={() => router.push("/admin")}>رفتن به داشبورد مدیریت</Button>}
      </div>
    </div>
  );
}
