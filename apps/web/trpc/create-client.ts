import { httpBatchLink } from "@repo/trpc/client";

const API_URL = "/api/trpc";

// Token getter set by the provider
let tokenGetter: (() => Promise<string | null>) | null = null;

export function setTokenGetter(fn: () => Promise<string | null>) {
  tokenGetter = fn;
}

export const createTRPCHttpBatchClientClient = () => {
  return httpBatchLink({
    url: API_URL,
    async headers() {
      if (tokenGetter) {
        const token = await tokenGetter();
        if (token) {
          return { Authorization: `Bearer ${token}` };
        }
      }
      return {};
    },
  });
};
