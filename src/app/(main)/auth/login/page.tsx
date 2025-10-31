"use client";

import { useState } from "react";

import { LoginForm } from "../_components/login-form";

export default function LoginV1() {
  const [title, setTitle] = useState("ورود");
  const [description, setDescription] = useState(
    "برای ورود به سیستم، شماره موبایل خود را وارد کنید",
  );

  return (
    <div className="relative flex min-h-dvh overflow-hidden">
      {/* Diagonal split background */}
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute inset-0 bg-primary/5 dark:bg-primary/10"
        style={{
          clipPath: "polygon(0 0, 60% 0, 40% 100%, 0 100%)",
        }}
      />

      {/* Floating geometric shapes */}
      <div className="absolute right-[15%] top-[10%] size-32 rotate-45 rounded-3xl border-4 border-primary/20 dark:border-primary/30 md:size-40" />
      <div className="absolute bottom-[20%] right-[25%] size-20 rounded-full border-4 border-secondary/30 dark:border-secondary/40" />
      <div className="absolute left-[10%] top-[30%] size-16 rotate-12 border-4 border-primary/10 dark:border-primary/20 md:size-24" />

      {/* Content */}
      <div className="relative z-10 flex w-full items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {/* Card with angled corner */}
          <div className="relative">
            <div
              className="absolute left-0 top-0 size-20 bg-primary/10 dark:bg-primary/20"
              style={{
                clipPath: "polygon(0 0, 100% 0, 0 100%)",
              }}
            />
            <div className="space-y-8 rounded-2xl border border-border/50 bg-background/80 p-8 shadow-2xl backdrop-blur-xl dark:bg-background/90 md:p-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="size-1.5 rounded-full bg-primary" />
                  <div className="h-px flex-1 bg-linear-to-l from-primary/50 to-transparent dark:from-primary/60" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  {title}
                </h1>
                <p className="text-muted-foreground">{description}</p>
              </div>

              <LoginForm
                onTitleChange={(newTitle: string, newDescription: string) => {
                  setTitle(newTitle);
                  setDescription(newDescription);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
