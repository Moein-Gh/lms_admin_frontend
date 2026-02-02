import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  title: string;
  isActive: boolean;
  index: number;
  onClick: () => void;
}

export function NavItem({ href, icon: Icon, title, isActive, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group relative flex flex-1 min-w-0 items-center justify-center transition-opacity duration-200 hover:opacity-100"
      style={{ opacity: isActive ? 1 : 0.7 }}
    >
      <div className="relative flex w-full max-w-[3.5rem] md:max-w-none aspect-square md:aspect-auto items-center justify-center">
        {/* Icon and label container */}
        <div className="relative flex w-full h-full flex-col items-center justify-center gap-1">
          <Icon className="size-6" />

          {/* Label */}
          <span className="text-xs font-medium whitespace-nowrap">{title}</span>

          {/* Active indicator pill */}
          {isActive && (
            <motion.div
              layoutId="navbar-active-indicator"
              className="absolute -bottom-1.5 md:-bottom-2 h-0.5 w-8 rounded-full"
              style={{ backgroundColor: "currentColor" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          )}
        </div>
      </div>
    </Link>
  );
}
