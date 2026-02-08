"use client";

import { User2, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMe } from "@/hooks/admin/use-user";
import { EditUserDialog } from "../users/[userId]/_Components/edit-user-dialog";
import { RoleAssignmentDialog } from "../users/[userId]/_Components/role-assignment-dialog";
import { LogoutButton } from "./_components/logout-button";
import { ProfileHeader } from "./_components/profile-header";
import { ProfileInfo } from "./_components/profile-info";
import { UserRoles } from "./_components/user-roles";

export default function ProfilePage() {
  const { data: user, isLoading } = useMe();

  if (isLoading) {
    return <div>در حال بارگذاری...</div>;
  }

  if (!user) {
    return <div>کاربر یافت نشد.</div>;
  }

  // Map User entity to component props
  const profileData = {
    name: user.identity?.name ?? "نامشخص",
    email: user.identity?.email ?? "نامشخص",
    phone: user.identity?.phone ? `${user.identity.countryCode ?? ""}${user.identity.phone}` : undefined,
    role: user.roleAssignments?.[0]?.role?.name ?? "کاربر"
  };

  const roles = user.roleAssignments?.map((ra) => ra.role?.name).filter(Boolean) as string[];

  return (
    <div className="space-y-6">
      <ProfileHeader />

      <Tabs defaultValue="personal" className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="flex gap-2 w-full max-w-md overflow-x-auto px-2">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User2 className="size-4" />
              اطلاعات شخصی
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              نقش‌ها
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="personal" className="space-y-6 outline-none">
          <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-0">
            <ProfileInfo
              user={profileData}
              action={
                <div className="flex items-center gap-2">
                  <EditUserDialog user={user} />
                  <LogoutButton />
                </div>
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6 outline-none">
          <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-0">
            <UserRoles roles={roles} action={<RoleAssignmentDialog userId={user.id} />} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
