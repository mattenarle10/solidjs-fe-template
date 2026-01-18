import type { JSX } from "solid-js";
import { ApiProvider } from "./api-context";
import { AuthProvider } from "./auth-context";
import { QueryProvider } from "./query-provider";

export function Providers(props: { children: JSX.Element }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ApiProvider>{props.children}</ApiProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
