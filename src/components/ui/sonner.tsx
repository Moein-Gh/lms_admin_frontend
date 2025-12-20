"use client";

import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      richColors={true}
      position="top-left"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />
      }}
      style={
        {
          "--normal-bg": "var(--color-toaster-normal-bg)",
          "--normal-text": "var(--color-toaster-normal-text)",
          "--success-bg": "var(--color-toaster-success-bg)",
          "--success-text": "var(--color-toaster-success-text)",
          "--error-bg": "var(--color-toaster-error-bg)",
          "--error-text": "var(--color-toaster-error-text)",
          "--warning-bg": "var(--color-toaster-warning-bg)",
          "--warning-text": "var(--color-toaster-warning-text)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--error-border": "var(--color-toaster-error-bg)"
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
