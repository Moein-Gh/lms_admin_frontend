"use client";

import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { users } from "@/data/users";
import { cn } from "@/lib/utils";
import type { ContentLayout, NavbarStyle, SidebarCollapsible, SidebarVariant } from "@/types/preferences/layout";

import { AccountSwitcher } from "./sidebar/account-switcher";
import { LayoutControls } from "./sidebar/layout-controls";
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

export function DashboardHeader({ navbarStyle, layoutPreferences }: DashboardHeaderProps) {
  const router = useRouter();
  // Now you can use hooks here if needed
  // const someHook = useSomeHook();

  return (
    <header
      data-navbar-style={navbarStyle}
      className={cn(
        "flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
        "data-[navbar-style=sticky]:bg-background/50 data-[navbar-style=sticky]:sticky data-[navbar-style=sticky]:top-0 data-[navbar-style=sticky]:z-50 data-[navbar-style=sticky]:overflow-hidden data-[navbar-style=sticky]:rounded-t-[inherit] data-[navbar-style=sticky]:backdrop-blur-md"
      )}
    >
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-me-1" />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center justify-center rounded-md px-2 py-1 text-sm font-medium text-muted-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="بازگشت"
            data-slot="back-button"
          >
            {/* You can use an icon here if you want, e.g. lucide-react ArrowLeft */}
            <span className="hidden sm:inline">بازگشت</span>
            <svg
              className="sm:ms-1 ms-0.5 h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <LayoutControls {...layoutPreferences} />
          <ThemeSwitcher />
          <AccountSwitcher users={users} />
        </div>
      </div>
    </header>
  );
}
