"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { AppData } from "@/lib/demo-data";
import { getInitialAppData } from "@/lib/demo-data";
import { STORAGE_KEY } from "@/lib/demo-data";
import { loadAppData } from "@/lib/data-service";
import { useAuth } from "@/components/providers/auth-provider";

interface DataContextValue {
  data: AppData;
  refresh: () => Promise<void>;
  loading: boolean;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [data, setData] = useState<AppData>(getInitialAppData());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = await loadAppData();
      setData(next);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh, user?.id]);

  // Sync when another tab submits a request or user returns to the dashboard tab
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) void refresh();
    };
    const onFocus = () => void refresh();
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  return (
    <DataContext.Provider value={{ data, refresh, loading }}>
      {children}
    </DataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useAppData must be used within DataProvider");
  return ctx;
}
