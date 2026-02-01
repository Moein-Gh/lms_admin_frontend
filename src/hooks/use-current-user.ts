import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/user-api";
import { userKeys } from "./use-user";

export function useAuth() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}
