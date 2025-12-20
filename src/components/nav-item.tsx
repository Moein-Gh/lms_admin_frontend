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
        {/* Hover effect removed: keep UI minimal, dot indicates active state */}

        {/* Icon container */}
        <motion.div
          className="relative flex w-full h-full flex-col items-center justify-center gap-0.5"
          animate={{
            y: isActive ? -4 : 0
          }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Icon className={cn("size-6 transition-colors duration-300 text-current")} />

          {/* Active indicator dot */}
          {isActive && (
            <motion.div
              layoutId="navbar-active-indicator"
              className="absolute -bottom-1 size-1.5 rounded-full"
              style={{ backgroundColor: "currentColor", boxShadow: "0 0 8px currentColor" }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </motion.div>

        {/* Removed tap/background overlays (dot indicator is sufficient) */}
      </motion.div>
    </Link>
  );
}
