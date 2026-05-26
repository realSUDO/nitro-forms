import { httpBatchLink } from "@repo/trpc/client";

export const createTRPCHttpBatchClientClient = () => {
  return httpBatchLink({
    url: "/api/trpc",
  });
};
