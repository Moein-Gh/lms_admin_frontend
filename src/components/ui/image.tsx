"use client";

import * as React from "react";
import ImageNext from "next/image";

import { cn } from "@/lib/utils";

type Props = React.ComponentProps<typeof ImageNext> & {
  rootClassName?: string;
};

export function Image({ className, rootClassName, alt, ...props }: Props) {
  return (
    <div data-slot="image-root" className={cn("relative", rootClassName)}>
      <ImageNext className={cn("object-cover", className)} alt={alt ?? "image"} {...props} />
    </div>
  );
}

export default Image;
