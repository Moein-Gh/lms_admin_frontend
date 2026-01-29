"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { ContentLayout, NavbarStyle, SidebarCollapsible, SidebarVariant } from "@/types/preferences/layout";

import { AccountSwitcher } from "./sidebar/account-switcher";
import { ThemeSwitcher } from "./sidebar/theme-switcher";

interface DashboardHeaderProps {
  navbarStyle: NavbarStyle;
  layoutPreferences: {
    contentLayout: ContentLayout;
    variant: SidebarVariant;
    collapsible: SidebarCollapsible;
    navbarStyle: NavbarStyle;
  };
}

export function DashboardHeader({ navbarStyle }: DashboardHeaderProps) {
  const router = useRouter();
  // Now you can use hooks here if needed
  // const someHook = useSomeHook();

  return (
    <header
      data-navbar-style={navbarStyle}
      className={cn(
        "hidden md:flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
        "data-[navbar-style=sticky]:bg-background/50 data-[navbar-style=sticky]:sticky data-[navbar-style=sticky]:top-0 data-[navbar-style=sticky]:z-50 data-[navbar-style=sticky]:overflow-hidden data-[navbar-style=sticky]:rounded-t-[inherit] data-[navbar-style=sticky]:backdrop-blur-md"
      )}
    >
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-me-1" />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />

          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={() => router.push("/dashboard")}
            aria-label="خانه"
            data-slot="home-button"
          >
            <Home className="size-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={() => router.back()}
            aria-label="بازگشت"
            data-slot="back-button"
            className="text-muted-foreground"
          >
            <div className="flex">
              <span className="">بازگشت</span>
              <ArrowLeft className="size-5 ms-1" />
            </div>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {/* <LayoutControls {...layoutPreferences} /> */}
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/messages")} aria-label="پیام‌ها">
            <Bell className="h-[1.2rem] w-[1.2rem]" />
          </Button>
          <ThemeSwitcher />
          <AccountSwitcher />
        </div>
      </div>
    </header>
  );
}
