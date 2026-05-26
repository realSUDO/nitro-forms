import { httpLink, httpBatchStreamLink } from "@repo/trpc/client";

const API_URL = "/api/trpc";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
  return c({
    url: API_URL,
    async headers() {
      if (typeof window !== "undefined") {
        const token = await window.Clerk?.session?.getToken();
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
