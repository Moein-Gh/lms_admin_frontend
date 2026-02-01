import { ReactNode } from "react";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { UserNavbar } from "./_components/user-navbar";

export default async function UserDashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-28">
      {children}
      <UserNavbar />
    </div>
  );
}
