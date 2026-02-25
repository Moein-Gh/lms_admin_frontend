"use client";

// Design 2 — Wide Split Card
// A horizontal card layout with branding on one side and form on the other.
// Mobile uses a compact single-pane form; desktop keeps split layout.

import { useEffect, useState } from "react";

import { BankIcon } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { LoginForm } from "../../_components/login-form";

export function Design2() {
  const [title, setTitle] = useState("ورود");
  const [description, setDescription] = useState("شماره موبایل خود را وارد کنید");

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="fixed inset-0 box-border overflow-hidden bg-muted/20 flex items-center justify-center p-4 md:static md:min-h-dvh md:h-auto md:overflow-y-auto md:p-4 md:py-12">
      <div className="w-full max-w-md max-h-full overflow-hidden rounded-3xl border border-border bg-card shadow-lg md:max-w-4xl md:shadow-lg flex flex-col md:flex-row">
        {/* Branding Side (Right in RTL) */}
        <div className="hidden md:flex shrink-0 md:w-2/5 bg-muted/30 p-12 flex-col justify-between border-l border-border items-start text-right">
          <div className="flex flex-col items-center md:items-start w-full">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm mb-6">
              <BankIcon className="size-8 md:size-6" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">سیستم مدیریت وام</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              دسترسی سریع و امن به پنل مدیریت یکپارچه تسهیلات و امور مالی.
            </p>
          </div>

          <div className="mt-6 text-xs text-muted-foreground">© {new Date().getFullYear()} تمامی حقوق محفوظ است.</div>
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
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>

            <Separator className="my-4" />
            <div className="rounded-2xl  bg-background p-4 md:rounded-none md:border-0 md:bg-transparent md:p-0">
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
