"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import React, { useMemo } from "react";
import { Toaster } from "~/components/ui/sonner";
import { httpBatchLink } from "@repo/trpc/client";

import { trpc } from "~/trpc/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5000, retry: 1 },
  },
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      async headers() {
        try {
          const clerk = (window as any)?.Clerk;
          const token = await clerk?.session?.getToken();
          console.log("[tRPC] token:", token ? `${token.slice(0, 20)}...` : "null");
          return token ? { Authorization: `Bearer ${token}` } : {};
        } catch (e) {
          console.error("[tRPC] token error:", e);
          return {};
        }
      },
    }),
  ],
});

export const GlobalProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
        <trpc.Provider queryClient={queryClient} client={trpcClient}>
          {children}
          <Toaster />
        </trpc.Provider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
};
