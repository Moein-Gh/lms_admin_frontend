"use client";

import * as React from "react";

import { ChevronDown } from "lucide-react";
import { animate } from "motion";
import { AnimatePresence, motion, useMotionValue } from "motion/react";

import { cn } from "@/lib/utils";

import { Button } from "./button";
import { Skeleton } from "./skeleton";

/* -------------
 * Types
 * -------------*/

type DataCardAction = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive";
  side?: "left" | "right";
  renderCustom?: () => React.ReactNode;
};

type DataCardField<T> = {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
};

type DataCardConfig<T> = {
  primaryField: keyof T;
  secondaryField?: keyof T;
  badge?: {
    field: keyof T;
    render: (value: T[keyof T], item: T) => React.ReactNode;
  };
  statusColor?: (item: T) => string;
  detailFields: DataCardField<T>[];
  actions?: DataCardAction[] | ((item: T) => DataCardAction[]);
  renderPrimary?: (value: T[keyof T], item: T) => React.ReactNode;
  renderSecondary?: (value: T[keyof T], item: T) => React.ReactNode;
};

/* -------------
 * Context
 * -------------*/

type DataCardContextValue = {
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  focusedId: string | null;
  setFocusedId: (id: string | null) => void;
  swipedId: string | null;
  setSwipedId: (id: string | null) => void;
};

const DataCardContext = React.createContext<DataCardContextValue | null>(null);

function useDataCardContext() {
  const context = React.useContext(DataCardContext);
  if (!context) {
    throw new Error("DataCard components must be used within DataCardList");
  }
  return context;
}

/* -------------
 * DataCardList
 * -------------*/

type DataCardListProps<T> = {
  data: T[];
  config: DataCardConfig<T>;
  keyExtractor: (item: T) => string;
  className?: string;
};

function DataCardList<T>({ data, config, keyExtractor, className }: DataCardListProps<T>) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [focusedId, setFocusedId] = React.useState<string | null>(null);
  const [swipedId, setSwipedId] = React.useState<string | null>(null);

  const handleDismissFocus = React.useCallback(() => {
    setFocusedId(null);
  }, []);

  const contextValue = React.useMemo(
    () => ({ expandedId, setExpandedId, focusedId, setFocusedId, swipedId, setSwipedId }),
    [expandedId, focusedId, swipedId]
  );

  return (
    <DataCardContext.Provider value={contextValue}>
      <div data-slot="data-card-list" className={cn("flex flex-col gap-3", className)}>
        {data.map((item) => (
          <DataCardItem key={keyExtractor(item)} item={item} id={keyExtractor(item)} config={config} />
        ))}
      </div>

      {/* Focus mode backdrop */}
      <AnimatePresence>
        {focusedId && (
          <motion.div
            data-slot="data-card-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={handleDismissFocus}
          />
        )}
      </AnimatePresence>
    </DataCardContext.Provider>
  );
}

/* -------------
 * DataCardItem
 * -------------*/

type DataCardItemProps<T> = {
  item: T;
  id: string;
  config: DataCardConfig<T>;
};

function DataCardItem<T>({ item, id, config }: DataCardItemProps<T>) {
  const { expandedId, setExpandedId, focusedId, swipedId, setSwipedId } = useDataCardContext();
  const [isDragging, setIsDragging] = React.useState(false);
  const [isSwipeActive, setIsSwipeActive] = React.useState(false);
  const [cardWidth, setCardWidth] = React.useState(0);
  const x = useMotionValue(0);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const isExpanded = expandedId === id;
  const isFocused = focusedId === id;
  const isSwiped = swipedId === id;
  const actions = typeof config.actions === "function" ? config.actions(item) : config.actions;
  const isRtl = typeof document !== "undefined" && document.documentElement.dir === "rtl";

  const definedLeftActions = actions?.filter((a) => a.side === "left") ?? [];
  const definedRightActions = actions?.filter((a) => a.side === "right") ?? [];

  // In RTL, users often swipe in the opposite direction compared to LTR habits.
  // If a card only defines actions on one side, mirror them so either swipe direction reveals an action.
  const leftActions =
    isRtl && definedLeftActions.length === 0 && definedRightActions.length > 0
      ? definedRightActions
      : definedLeftActions;
  const rightActions =
    isRtl && definedRightActions.length === 0 && definedLeftActions.length > 0
      ? definedLeftActions
      : definedRightActions;

  const hasActions = leftActions.length + rightActions.length > 0;

  const handleTap = () => {
    // Only toggle expand if not dragging
    if (!isDragging) {
      setExpandedId(isExpanded ? null : id);
    }
  };

  const handleDragStart = () => {
    // close other swiped rows when starting to drag this one
    if (swipedId && swipedId !== id) setSwipedId(null);
    setIsDragging(true);
  };

  const handleDrag = () => {
    const currentX = x.get();
    const leftThreshold = cardWidth ? -cardWidth * 0.2 : -50;
    const rightThreshold = cardWidth ? cardWidth * 0.2 : 50;
    setIsSwipeActive(currentX < leftThreshold || currentX > rightThreshold);
    // if user drags back past threshold, close the revealed state
    if (isSwiped && currentX > leftThreshold + 8 && currentX < rightThreshold - 8) {
      setSwipedId(null);
    }
  };

  const handleDragEnd = () => {
    const currentX = x.get();
    const leftRevealThreshold = cardWidth ? -cardWidth * 0.2 : -80;
    const rightRevealThreshold = cardWidth ? cardWidth * 0.2 : 80;

    // If user swiped left past 20% and there are right actions
    if (currentX < leftRevealThreshold && rightActions.length > 0) {
      setSwipedId(id);
      const target = Math.round(leftRevealThreshold);
      animate(x, target, { duration: 0.15 });
    }
    // If user swiped right past 20% and there are left actions
    else if (currentX > rightRevealThreshold && leftActions.length > 0) {
      setSwipedId(id);
      const target = Math.round(rightRevealThreshold);
      animate(x, target, { duration: 0.15 });
    } else {
      // snap back
      setSwipedId(isSwiped ? null : swipedId);
      animate(x, 0, { duration: 0.15 });
    }

    // Delay resetting isDragging to prevent tap from firing
    setTimeout(() => setIsDragging(false), 50);
    setIsSwipeActive(false);
  };

  // Measure card width (responsive)
  React.useEffect(() => {
    if (!cardRef.current) return;
    const el = cardRef.current;
    const ro = new ResizeObserver(() => {
      setCardWidth(el.getBoundingClientRect().width || 0);
    });
    ro.observe(el);
    setCardWidth(el.getBoundingClientRect().width || 0);
    return () => ro.disconnect();
  }, []);

  // Keep motion value in sync when swipedId changes elsewhere
  React.useEffect(() => {
    const leftRevealX = cardWidth ? -Math.round(cardWidth * 0.2) : -80;
    const rightRevealX = cardWidth ? Math.round(cardWidth * 0.2) : 80;
    const currentX = x.get();

    if (isSwiped) {
      // Determine which direction was swiped based on current position
      if (currentX < 0 && rightActions.length > 0) {
        animate(x, leftRevealX, { duration: 0.15 });
      } else if (currentX > 0 && leftActions.length > 0) {
        animate(x, rightRevealX, { duration: 0.15 });
      }
    } else {
      animate(x, 0, { duration: 0.15 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSwiped, cardWidth]);

  return (
    <motion.div
      ref={cardRef}
      data-slot="data-card-item"
      data-expanded={isExpanded}
      data-focused={isFocused}
      layout
      className={cn(
        "relative overflow-hidden rounded-xl bg-card text-card-foreground",
        "border border-border transition-shadow",
        "data-[focused=true]:z-50 data-[focused=true]:shadow-xl"
      )}
    >
      {/* Swipe actions background */}
      {rightActions.length > 0 && (
        <DataCardSwipeActions
          actions={rightActions}
          isActive={isSwipeActive || isSwiped}
          side="right"
          onActionClick={() => {
            rightActions[0].onClick();
            setSwipedId(null);
            animate(x, 0, { duration: 0.15 });
          }}
        />
      )}
      {leftActions.length > 0 && (
        <DataCardSwipeActions
          actions={leftActions}
          isActive={isSwipeActive || isSwiped}
          side="left"
          onActionClick={() => {
            leftActions[0].onClick();
            setSwipedId(null);
            animate(x, 0, { duration: 0.15 });
          }}
        />
      )}

      {/* Card content */}
      <motion.div
        drag={hasActions ? "x" : false}
        dragConstraints={{
          left: rightActions.length > 0 ? Math.round(-Math.max(cardWidth * 0.6, 100)) : 0,
          right: leftActions.length > 0 ? Math.round(Math.max(cardWidth * 0.6, 100)) : 0
        }}
        dragElastic={{ left: rightActions.length > 0 ? 0.1 : 0, right: leftActions.length > 0 ? 0.1 : 0 }}
        dragSnapToOrigin
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onClick={handleTap}
        style={{ x }}
        className="relative z-10 bg-card cursor-pointer touch-pan-y"
      >
        <DataCardHeader item={item} config={config} isExpanded={isExpanded} actions={actions} />

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <DataCardDetails item={item} config={config} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* -------------
 * DataCardHeader
 * -------------*/

type DataCardHeaderProps<T> = {
  item: T;
  config: DataCardConfig<T>;
  isExpanded: boolean;
  actions?: DataCardAction[];
};

function DataCardHeader<T>({ item, config, isExpanded, actions }: DataCardHeaderProps<T>) {
  const primaryValue = item[config.primaryField];
  const secondaryValue = config.secondaryField ? item[config.secondaryField] : null;
  const customActions = actions?.filter((a) => a.renderCustom) ?? [];

  return (
    <div data-slot="data-card-header" className="flex items-center gap-3 p-4">
      <div className="min-w-0 flex-1 flex items-center gap-2">
        {config.statusColor && <div className={cn("size-2 rounded-full shrink-0", config.statusColor(item))} />}

        {secondaryValue !== null && (
          <p className="truncate text-sm text-muted-foreground">
            {config.renderSecondary ? config.renderSecondary(secondaryValue, item) : String(secondaryValue ?? "")}
          </p>
        )}

        <p className="truncate font-medium">
          {config.renderPrimary ? config.renderPrimary(primaryValue, item) : String(primaryValue ?? "")}
        </p>
      </div>

      {/* Badge */}
      {config.badge && <div className="shrink-0">{config.badge.render(item[config.badge.field], item)}</div>}

      {/* Expand indicator */}
      <motion.div
        animate={{ rotate: isExpanded ? -180 : 0 }}
        transition={{ duration: 0.2 }}
        className="text-muted-foreground"
      >
        <ChevronDown className="size-5" />
      </motion.div>

      {/* Custom action buttons */}
      {customActions.length > 0 && (
        <div className="flex items-center gap-1 shrink-0">
          {customActions.map((action, idx) => (
            <div key={idx} onClick={(e) => e.stopPropagation()}>
              {action.renderCustom?.()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------
 * DataCardDetails
 * -------------*/

type DataCardDetailsProps<T> = {
  item: T;
  config: DataCardConfig<T>;
};

function DataCardDetails<T>({ item, config }: DataCardDetailsProps<T>) {
  return (
    <div data-slot="data-card-details" className="border-t border-border px-4 py-3">
      <dl className="grid gap-2">
        {config.detailFields.map((field) => (
          <DataCardField key={`${String(field.key)}-${field.label}`} field={field} item={item} />
        ))}
      </dl>
    </div>
  );
}

/* -------------
 * DataCardField
 * -------------*/

type DataCardFieldProps<T> = {
  field: DataCardField<T>;
  item: T;
};

function DataCardField<T>({ field, item }: DataCardFieldProps<T>) {
  const value = item[field.key];

  return (
    <div data-slot="data-card-field" className="flex items-center justify-between gap-4">
      <dt className="text-sm text-muted-foreground">{field.label}</dt>
      <dd className="text-sm font-medium">{field.render ? field.render(value, item) : String(value ?? "-")}</dd>
    </div>
  );
}

/* -------------
 * DataCardSwipeActions
 * -------------*/

type DataCardSwipeActionsProps = {
  actions: DataCardAction[];
  isActive: boolean;
  side: "left" | "right";
  onActionClick?: () => void;
};

function DataCardSwipeActions({ actions, isActive, side, onActionClick }: DataCardSwipeActionsProps) {
  const primaryAction = actions[0];
  const backgroundColor = primaryAction.variant === "destructive" ? "#ef4444" : "#3b82f6";

  return (
    <div
      data-slot="data-card-swipe-actions"
      data-active={isActive}
      data-side={side}
      className={cn(
        "absolute inset-y-0 flex items-center justify-center",
        "w-24 transition-opacity z-0",
        side === "left" ? "left-0" : "right-0",
        isActive ? "opacity-100" : "opacity-70"
      )}
      style={{ backgroundColor }}
    >
      <Button
        aria-label={primaryAction.label}
        type="button"
        onClick={onActionClick}
        variant="ghost"
        size="icon"
        className="h-full w-full rounded-none text-white hover:bg-transparent hover:text-white"
      >
        {primaryAction.icon}
      </Button>
    </div>
  );
}

/* -------------
 * DataCardSkeleton
 * -------------*/

type DataCardSkeletonProps = {
  count?: number;
  className?: string;
};

function DataCardSkeleton({ count = 5, className }: DataCardSkeletonProps) {
  return (
    <div data-slot="data-card-skeleton" className={cn("flex flex-col gap-3", className)}>
      {Array.from({ length: count }, (_, i) => (
        <div key={`skeleton-${i}`} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-5 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* -------------
 * DataCardEmpty
 * -------------*/

type DataCardEmptyProps = {
  message?: string;
  className?: string;
};

function DataCardEmpty({ message = "موردی یافت نشد", className }: DataCardEmptyProps) {
  return (
    <div
      data-slot="data-card-empty"
      className={cn("rounded-xl border border-border bg-card p-8 text-center", className)}
    >
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

/* -------------
 * DataCardError
 * -------------*/

type DataCardErrorProps = {
  message?: string;
  className?: string;
};

function DataCardError({ message = "خطا در بارگذاری داده‌ها", className }: DataCardErrorProps) {
  return (
    <div
      data-slot="data-card-error"
      className={cn("rounded-xl border border-border bg-card p-8 text-center", className)}
    >
      <p className="text-destructive">{message}</p>
    </div>
  );
}

/* -------------
 * Exports
 * -------------*/

export {
  DataCardList,
  DataCardSkeleton,
  DataCardEmpty,
  DataCardError,
  type DataCardConfig,
  type DataCardField,
  type DataCardAction
};
