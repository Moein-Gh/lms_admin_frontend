"use client";

import * as React from "react";
import { Loader2, Search, UserRound, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import type { AllocationFormData } from "@/components/journal/allocate-journal-panel.types";
import { useUsers } from "@/hooks/admin/use-user";
import type { User } from "@/types/entities/user.type";
import { Input } from "../ui/input";

const MIN_CHARS = 3;
const DEBOUNCE_MS = 500;

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function UserSearchInput({
  selectedUser,
  onSelect,
  onClear
}: {
  selectedUser: User | undefined;
  onSelect: (user: User) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, DEBOUNCE_MS);

  const shouldSearch = debouncedQuery.trim().length >= MIN_CHARS;
  const { data, isFetching } = useUsers({ search: debouncedQuery.trim(), pageSize: 10 }, { enabled: shouldSearch });
  const results = data?.data ?? [];

  const handleSelect = (user: User) => {
    onSelect(user);
    setQuery("");
  };

  if (selectedUser) {
    const label = selectedUser.identity.name ?? String(selectedUser.identity.phone);
    return (
      <div className="flex items-center gap-3 rounded-md border border-primary bg-primary/5 px-3 py-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <UserRound className="size-4 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{label}</p>
          <p className="font-mono text-xs text-muted-foreground">#{selectedUser.code}</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label="حذف انتخاب"
        >
          <X className="size-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Input with inline icon */}
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="نام یا شماره تلفن کاربر را وارد کنید."
          className="ps-9"
          autoComplete="on"
        />
        <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-muted-foreground">
          {isFetching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
        </span>
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="پاک کردن جستجو"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Hint */}
      {query.length > 0 && query.length < MIN_CHARS && (
        <p className="mt-1.5 px-1 text-xs text-muted-foreground">برای جستجو حداقل {MIN_CHARS} کاراکتر وارد کنید</p>
      )}

      {/* Results list */}
      <AnimatePresence>
        {shouldSearch && !isFetching && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="mt-2 overflow-hidden rounded-md border bg-card shadow-xs"
          >
            {results.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <UserRound className="size-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">کاربری یافت نشد</p>
              </div>
            ) : (
              <ul className="max-h-56 divide-y overflow-y-auto">
                {results.map((user) => {
                  const name = user.identity.name;
                  const phone = String(user.identity.phone);
                  return (
                    <li key={user.id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(user)}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-start transition-colors hover:bg-accent active:bg-accent/70"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                          <UserRound className="size-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">{name ?? phone}</p>
                          {name && <p className="text-xs text-muted-foreground">{phone}</p>}
                        </div>
                        <span className="shrink-0 font-mono text-xs text-muted-foreground/50">#{user.code}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function StepSelectUser({
  formData,
  setFormData,
  onNext
}: {
  formData: Partial<AllocationFormData>;
  setFormData: (data: Partial<AllocationFormData>) => void;
  onNext: () => void;
}) {
  const [selectedUser, setSelectedUser] = React.useState<User | undefined>(undefined);

  const handleSelect = (user: User) => {
    setSelectedUser(user);
    setFormData({ ...formData, userId: user.id, accountId: undefined, accountIds: undefined, items: [] });
    onNext();
  };

  const handleClear = () => {
    setSelectedUser(undefined);
    setFormData({ ...formData, userId: undefined, accountId: undefined, accountIds: undefined, items: [] });
  };

  return (
    <div className="space-y-3">
      <UserSearchInput selectedUser={selectedUser} onSelect={handleSelect} onClear={handleClear} />
    </div>
  );
}
