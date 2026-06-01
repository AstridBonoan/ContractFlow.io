"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { AppData } from "@/lib/demo-data";
import { getInitialAppData } from "@/lib/demo-data";
import { dataStore } from "@/lib/store";

interface DataContextValue {
  data: AppData;
  refresh: () => void;
  loading: boolean;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(getInitialAppData());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setData(dataStore.get());
  }, []);

  useEffect(() => {
    refresh();
    setLoading(false);
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
