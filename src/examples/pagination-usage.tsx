/**
 * PAGINATION SYSTEM USAGE EXAMPLES
 *
 * This file demonstrates how to use the integrated pagination system
 * that matches the backend PaginatedResponseDto structure.
 */
import React from "react";

import { PaginationControls } from "@/components/pagination-controls";
import { usePagination } from "@/hooks/use-pagination";
import { useUsers } from "@/hooks/use-user";
import { UserStatus } from "@/types/entities/user.type";

// ============================================================================
// Example 1: Basic Usage with User List
// ============================================================================

export function UserListExample() {
  // Initialize pagination state
  const pagination = usePagination({
    initialPage: 1,
    initialPageSize: 10
  });

  // Fetch users with pagination
  const { data, isLoading, error } = useUsers({
    page: pagination.page,
    pageSize: pagination.pageSize,
    // Additional filters
    status: UserStatus.ACTIVE,
    search: ""
  });

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>خطا در بارگذاری داده‌ها</div>;
  if (!data) return null;

  return (
    <div className="space-y-4">
      {/* User List */}
      <div className="space-y-2">
        {data.data.map((user) => (
          <div key={user.id} className="rounded-lg border p-4">
            <h3>{user.identity.name}</h3>
            <p>{user.identity.phone}</p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <PaginationControls
        meta={data.meta}
        page={pagination.page}
        pageSize={pagination.pageSize}
        onPageChange={pagination.setPage}
        onPageSizeChange={pagination.setPageSize}
      />
    </div>
  );
}

// ============================================================================
// Example 2: With Manual Navigation Buttons
// ============================================================================

export function UserListWithManualNavigation() {
  const pagination = usePagination({ initialPage: 1, initialPageSize: 20 });
  const { data } = useUsers({
    page: pagination.page,
    pageSize: pagination.pageSize
  });

  return (
    <div>
      {/* Custom navigation using pagination helpers */}
      <div className="flex gap-2">
        <button onClick={pagination.goToFirstPage} disabled={!pagination.canGoPrev()}>
          اولین صفحه
        </button>
        <button onClick={pagination.goToPrevPage} disabled={!pagination.canGoPrev()}>
          قبلی
        </button>
        <button onClick={() => pagination.goToNextPage(data?.meta)} disabled={!pagination.canGoNext(data?.meta)}>
          بعدی
        </button>
        <button onClick={() => pagination.goToLastPage(data?.meta)} disabled={!pagination.canGoNext(data?.meta)}>
          آخرین صفحه
        </button>
      </div>

      {/* Display meta information */}
      {data?.meta && (
        <div>
          <p>
            صفحه {data.meta.page} از {data.meta.totalPages}
          </p>
          <p>مجموع: {data.meta.totalItems} مورد</p>
          <p>در این صفحه: {data.meta.itemCount} مورد</p>
        </div>
      )}

      {/* User list */}
      <div>
        {data?.data.map((user) => (
          <div key={user.id}>{user.identity.name}</div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Example 3: With Search and Filters
// ============================================================================

export function UserListWithFilters() {
  const pagination = usePagination();
  const [search, setSearch] = React.useState("");
  const [isActive, setIsActive] = React.useState<boolean | undefined>();

  const { data, isLoading } = useUsers({
    page: pagination.page,
    pageSize: pagination.pageSize,
    search,
    status: isActive === undefined ? undefined : isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE
  });

  // Reset to first page when filters change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    pagination.goToFirstPage();
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2">
        <input type="text" placeholder="جستجو..." value={search} onChange={(e) => handleSearchChange(e.target.value)} />
        <select
          value={isActive === undefined ? "" : String(isActive)}
          onChange={(e) => {
            setIsActive(e.target.value === "" ? undefined : e.target.value === "true");
            pagination.goToFirstPage();
          }}
        >
          <option value="">همه</option>
          <option value="true">فعال</option>
          <option value="false">غیرفعال</option>
        </select>
      </div>

      {/* Results */}
      {isLoading ? (
        <div>در حال بارگذاری...</div>
      ) : (
        <>
          <div>
            {data?.data.map((user) => (
              <div key={user.id}>{user.identity.name}</div>
            ))}
          </div>

          <PaginationControls
            meta={data?.meta}
            page={pagination.page}
            pageSize={pagination.pageSize}
            onPageChange={pagination.setPage}
            onPageSizeChange={pagination.setPageSize}
          />
        </>
      )}
    </div>
  );
}

// ============================================================================
// Example 4: Accessing Pagination Links (if backend provides them)
// ============================================================================

export function UserListWithLinks() {
  const pagination = usePagination();
  const { data } = useUsers({
    page: pagination.page,
    pageSize: pagination.pageSize
  });

  // If your backend provides links, you can access them
  if (data?.links) {
    console.log("Self:", data.links.self);
    console.log("First:", data.links.first);
    console.log("Last:", data.links.last);
    console.log("Next:", data.links.next);
    console.log("Prev:", data.links.prev);
  }

  return <div>{/* Your component */}</div>;
}

// ============================================================================
// Type Usage Examples
// ============================================================================

/*
// The response from useUsers() now has this structure:
{
  data: User[],           // Array of users
  meta: {
    totalItems: number,   // Total number of items
    itemCount: number,    // Items in current page
    page: number,         // Current page (1-based)
    pageSize: number,     // Items per page
    totalPages: number,   // Total number of pages
    hasNextPage: boolean, // Can go to next page
    hasPrevPage: boolean  // Can go to previous page
  },
  links?: {              // Optional navigation links
    self: string,
    first: string,
    last: string,
    prev?: string,
    next?: string
  }
}
*/
