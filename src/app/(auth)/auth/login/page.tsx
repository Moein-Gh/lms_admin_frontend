"use client";

import { useEffect, useState } from "react";

import { BankIcon, Moon, Sun } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { updateThemeMode } from "@/lib/theme-utils";
import { setValueToCookie } from "@/server/server-actions";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { LoginForm } from "../_components/login-form";

export default function LoginPage() {
  const [title, setTitle] = useState("ورود");
  const [description, setDescription] = useState("شماره موبایل خود را وارد کنید");

  const themeMode = usePreferencesStore((s) => s.themeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);

  const toggleTheme = async () => {
    const next = themeMode === "dark" ? "light" : "dark";
    updateThemeMode(next);
    setThemeMode(next);
    await setValueToCookie("theme_mode", next);
  };

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="fixed inset-0 box-border overflow-hidden flex items-center justify-center p-4 md:static md:min-h-dvh md:h-auto md:overflow-y-auto md:p-4 md:py-12 bg-background">
      {/* ── Background canvas ─────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 md:absolute" aria-hidden="true">
        {/* Two-tone gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-background to-muted/60" />
        {/* SVG grain/noise overlay */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.35]" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
        {/* Soft vignette */}
        <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent to-background/50" />
      </div>
      <div className="relative z-10 w-full max-w-md max-h-full overflow-hidden rounded-3xl border border-border bg-card  md:max-w-4xl flex flex-col md:flex-row">
        {/* Theme toggle — inside card, top-left corner */}
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleTheme}
          className="absolute top-3 left-3 z-20 size-8 rounded-full text-muted-foreground hover:text-foreground"
        >
          {themeMode === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>

        {/* Branding Side (Right in RTL) */}
        <div className="hidden md:flex shrink-0 md:w-2/5 bg-muted/30 p-12 flex-col justify-between items-start text-right">
          <div className="flex flex-col items-center md:items-start w-full">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-6">
              <BankIcon className="size-6" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">سیستم مدیریت وام</h2>
            <p className="text-sm text-muted-foreground leading-relaxed text-start">
              دسترسی سریع و امن به پنل مدیریت یکپارچه تسهیلات و امور مالی.
            </p>
          </div>
        </div>

        {/* Form Side */}
        <div className="min-h-0 flex-1 md:w-3/5 px-5 py-6 md:p-12 flex flex-col justify-center bg-background md:bg-transparent overflow-y-auto overscroll-contain">
          <div className="max-w-sm w-full mx-auto">
            <div className="mb-6 md:hidden text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BankIcon className="size-6" />
              </div>
              <p className="text-sm text-muted-foreground">سیستم مدیریت وام</p>
            </div>

            <div className="mb-6 md:mb-8 text-center md:text-right">
              <p className="mt-1 text-md text-center text-muted-foreground">{description}</p>
            </div>

            <Separator className="my-4" />
            <div className="rounded-2xl bg-background p-4 md:rounded-none md:border-0 md:bg-transparent md:p-0">
              <LoginForm
                onTitleChange={(t, d) => {
                  setTitle(t);
                  setDescription(d);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
