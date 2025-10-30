import { useMutation } from "@tanstack/react-query";

import { requestSms, verifySms } from "@/lib/auth-api";

export function useRequestSms() {
  return useMutation({
    mutationFn: requestSms,
  });
}

export function useVerifySms() {
  return useMutation({
    mutationFn: verifySms,
  });
}
