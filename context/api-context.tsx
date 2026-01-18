import { createContext, createMemo, type JSX, useContext } from "solid-js";
import { ApiClient } from "@/lib/api-client";
import { useAuth } from "./auth-context";

const ApiContext = createContext<ApiClient>();

export function ApiProvider(props: { children: JSX.Element }) {
  const auth = useAuth();

  const api = createMemo(() => new ApiClient(() => auth.token));

  return (
    <ApiContext.Provider value={api()}>{props.children}</ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
}
