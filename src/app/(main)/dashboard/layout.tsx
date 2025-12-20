import { ReactNode } from "react";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { MobileNavbar } from "@/components/mobile-navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { getPreference } from "@/server/server-actions";
import {
  CONTENT_LAYOUT_VALUES,
  NAVBAR_STYLE_VALUES,
  SIDEBAR_COLLAPSIBLE_VALUES,
  SIDEBAR_VARIANT_VALUES,
  type ContentLayout,
  type NavbarStyle,
  type SidebarCollapsible,
  type SidebarVariant
} from "@/types/preferences/layout";
import { DashboardHeader } from "./_components/dashboard-header";
import { AppSidebar } from "./_components/sidebar/app-sidebar";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    redirect("/auth/login");
  }

  const [sidebarVariant, sidebarCollapsible, contentLayout, navbarStyle] = await Promise.all([
    getPreference<SidebarVariant>("sidebar_variant", SIDEBAR_VARIANT_VALUES, "floating"),
    getPreference<SidebarCollapsible>("sidebar_collapsible", SIDEBAR_COLLAPSIBLE_VALUES, "icon"),
    getPreference<ContentLayout>("content_layout", CONTENT_LAYOUT_VALUES, "centered"),
    getPreference<NavbarStyle>("navbar_style", NAVBAR_STYLE_VALUES, "sticky")
  ]);

  const layoutPreferences = {
    contentLayout,
    variant: sidebarVariant,
    collapsible: sidebarCollapsible,
    navbarStyle
  };

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar variant={sidebarVariant} collapsible={sidebarCollapsible} />
      <SidebarInset
        data-content-layout={contentLayout}
        className={cn(
          "data-[content-layout=centered]:mx-auto! data-[content-layout=centered]:max-w-screen-2xl",
          "max-[113rem]:peer-data-[variant=inset]:ms-2! min-[101rem]:peer-data-[variant=inset]:peer-data-[state=collapsed]:ms-auto!"
        )}
      >
        <DashboardHeader navbarStyle={navbarStyle} layoutPreferences={layoutPreferences} />
        <div className="flex flex-1 flex-col p-4 pb-24 md:p-6 md:pb-6">{children}</div>
      </SidebarInset>
      <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
        <div className="mx-4 pb-7">
          <MobileNavbar />
        </div>
      </div>
    </SidebarProvider>
  );
}
