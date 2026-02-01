import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";

import {
  createUser,
  deleteUser,
  getMe,
  getUserById,
  getUserPaymentSummary,
  getUserUpcomingPayments,
  listUsers,
  registerUser,
  updateUser,
  type CreateUserRequest,
  type ListUsersParams,
  type RegisterUserInput,
  type UpdateUserRequest
} from "@/lib/user-api";
import type { GetUpcomingPaymentsQueryDto } from "@/types/entities/payment.type";
import { User, UserStatus } from "@/types/entities/user.type";

// Query keys for user-related queries
export const userKeys = {
  all: ["users"] as const,
  me: () => [...userKeys.all, "me"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params?: ListUsersParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  upcomingPayments: (id: string, params?: GetUpcomingPaymentsQueryDto) =>
    [...userKeys.details(), id, "upcoming-payments", params] as const,
  paymentSummary: (id: string) => [...userKeys.details(), id, "payment-summary"] as const
};

/**
 * Hook to fetch the current logged in user
 */
export function useMe(
  options?: Omit<UseQueryOptions<User, Error, User, ReturnType<typeof userKeys.me>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: getMe,
    staleTime: Infinity,
    ...options
  });
}

/**
 * Hook to fetch a paginated list of users
 */
export function useUsers(
  params?: ListUsersParams,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof listUsers>>,
      Error,
      Awaited<ReturnType<typeof listUsers>>,
      ReturnType<typeof userKeys.list>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => listUsers(params),
    staleTime: 0,
    ...options
  });
}

/**
 * Hook to fetch a single user by ID
 */
export function useUser(
  userId: string,
  options?: Omit<UseQueryOptions<User, Error, User, ReturnType<typeof userKeys.detail>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => getUserById(userId),
    enabled: !!userId,
    ...options
  });
}

/**
 * Hook to create a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => createUser(data),
    onSuccess: () => {
      // Invalidate and refetch user lists
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    }
  });
}

/**
 * Hook to register a new user (with full identity)
 */
export function useRegisterUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterUserInput) => registerUser(data),
    onSuccess: () => {
      // Invalidate and refetch user lists
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    }
  });
}

/**
 * Hook to update an existing user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserRequest }) => updateUser(userId, data),
    onSuccess: (updatedUser) => {
      // Invalidate the specific user detail query
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(updatedUser.id)
      });
      // Invalidate user lists to reflect changes
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      // If the updated user is the current logged-in user, invalidate/refetch the `me` query
      try {
        const me = queryClient.getQueryData(userKeys.me());
        // me may be undefined or partial; compare by id
        if ((me as any)?.id === updatedUser.id) {
          queryClient.invalidateQueries({ queryKey: userKeys.me() });
        }
      } catch (e) {
        // ignore errors in non-browser or unexpected cache shapes
      }
    }
  });
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: (_data, userId) => {
      // Remove the deleted user from cache
      queryClient.removeQueries({ queryKey: userKeys.detail(userId) });
      // Invalidate user lists
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    }
  });
}

/**
 * Hook to toggle user active status
 */
export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: UserStatus }) => updateUser(userId, { status }),
    onSuccess: (updatedUser) => {
      // Update cache optimistically
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      // Invalidate lists to reflect the change
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    }
  });
}

/**
 * Hook to fetch user's upcoming payments
 */
export function useUserUpcomingPayments(
  userId: string,
  params?: GetUpcomingPaymentsQueryDto,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getUserUpcomingPayments>>,
      Error,
      Awaited<ReturnType<typeof getUserUpcomingPayments>>,
      ReturnType<typeof userKeys.upcomingPayments>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: userKeys.upcomingPayments(userId, params),
    queryFn: () => getUserUpcomingPayments(userId, params),
    enabled: !!userId,
    ...options
  });
}

/**
 * Hook to fetch user's payment summary
 */
export function useUserPaymentSummary(
  userId: string,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getUserPaymentSummary>>,
      Error,
      Awaited<ReturnType<typeof getUserPaymentSummary>>,
      ReturnType<typeof userKeys.paymentSummary>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: userKeys.paymentSummary(userId),
    queryFn: () => getUserPaymentSummary(userId),
    enabled: !!userId,
    ...options
  });
}
