import { httpLink, httpBatchStreamLink } from "@repo/trpc/client";

const API_URL = "/api/trpc";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

// Token getter set by the provider
let tokenGetter: (() => Promise<string | null>) | null = null;

export function setTokenGetter(fn: () => Promise<string | null>) {
  tokenGetter = fn;
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
  return c({
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
    fetch(url, options) {
      return fetch(url, {
        ...options,
        credentials: "include",
      });
    },
  });
};
