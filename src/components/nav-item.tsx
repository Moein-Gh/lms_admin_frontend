import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  isActive: boolean;
  index: number;
  hoveredIndex: number | null;
  onClick: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

export function NavItem({
  href,
  icon: Icon,
  isActive,
  index,
  hoveredIndex,
  onClick,
  onHoverStart,
  onHoverEnd
}: NavItemProps) {
  const isHovered = hoveredIndex === index;
  const shouldScale = hoveredIndex === null || isHovered;

  return (
    <Link
      href={href}
      onClick={onClick}
      className="group relative flex flex-1 min-w-0 items-center justify-center"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <motion.div
        animate={{
          scale: isActive ? 1 : shouldScale ? 1 : 0.85
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative flex w-full max-w-[3.5rem] aspect-square items-center justify-center"
      >
        {/* Hover effect */}
        <motion.div
          animate={{
            scale: isHovered && !isActive ? 1 : 0,
            opacity: isHovered && !isActive ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 rounded-2xl bg-muted/50"
        />

        {/* Icon container */}
        <motion.div
          className="relative flex w-full h-full flex-col items-center justify-center gap-0.5"
          animate={{
            y: isActive ? -4 : 0
          }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Icon
            className={cn(
              "size-6 transition-colors duration-300",
              isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
            )}
          />

          {/* Active indicator dot */}
          {isActive && (
            <motion.div
              layoutId="navbar-active-indicator"
              className="absolute -bottom-1 size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </motion.div>

        {/* Ripple effect on tap */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl" />
      </motion.div>
    </Link>
  );
}
