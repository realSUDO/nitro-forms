import { httpLink, httpBatchStreamLink } from "@repo/trpc/client";
import { env } from "~/env.js";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
  return c({
    url: env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001/trpc",
    async headers() {
      // Get Clerk token from the browser
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
