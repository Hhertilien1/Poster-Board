"use client";

import { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [mswReady, setMswReady] = useState(() => {
    const isDev = process.env.NODE_ENV === "development";
    const enableFlag = process.env.NEXT_PUBLIC_ENABLE_MSW !== "false";
    const hasExternalApiBase = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL);
    return !isDev || !enableFlag || hasExternalApiBase;
  });

  useEffect(() => {
    const isDev = process.env.NODE_ENV === "development";
    const enableFlag = process.env.NEXT_PUBLIC_ENABLE_MSW !== "false";
    const hasExternalApiBase = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL);

    if (!isDev || !enableFlag || hasExternalApiBase) {
      return;
    }

    let active = true;

    async function startMocking() {
      const { worker } = await import("@/mocks/browser");
      await worker.start({ onUnhandledRequest: "bypass" });
      if (active) setMswReady(true);
    }

    startMocking();

    return () => {
      active = false;
    };
  }, []);

  if (!mswReady) return null;

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}