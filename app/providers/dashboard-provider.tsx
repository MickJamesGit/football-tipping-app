"use client";

import { createContext, useContext } from "react";

const DashboardContext = createContext<any>(null);

export function DashboardProvider({
  user,
  children,
}: {
  user: any;
  children: React.ReactNode;
}) {
  return (
    <DashboardContext.Provider value={user}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardUser() {
  return useContext(DashboardContext);
}