import {
  createContext,
  createSignal,
  type JSX,
  onMount,
  useContext,
} from "solid-js";
import { ApiClient } from "@/lib/api-client";
import {
  signIn as cognitoSignIn,
  signOut as cognitoSignOut,
  getCurrentSession,
  type LoginCredentials,
} from "@/lib/auth";
import type { User, UserRole } from "@/schemas";

// Configure which roles are allowed to access the admin portal
const ALLOWED_ROLES: UserRole[] = ["admin"];

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>();

export function AuthProvider(props: { children: JSX.Element }) {
  const [user, setUser] = createSignal<User | null>(null);
  const [token, setToken] = createSignal<string | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);

  onMount(async () => {
    try {
      const session = await getCurrentSession();
      if (session) {
        const idToken = session.getIdToken().getJwtToken();
        const api = new ApiClient(() => idToken);
        const userData = await api.getMe();

        if (!ALLOWED_ROLES.includes(userData.role)) {
          throw new Error("Unauthorized: Insufficient permissions");
        }

        setUser(userData);
        setToken(idToken);
      }
    } catch {
      // Session invalid or unauthorized
    } finally {
      setIsLoading(false);
    }
  });

  const signIn = async (credentials: LoginCredentials) => {
    const tokens = await cognitoSignIn(credentials);
    const api = new ApiClient(() => tokens.idToken);
    const userData = await api.getMe();

    if (!ALLOWED_ROLES.includes(userData.role)) {
      await cognitoSignOut();
      throw new Error("Unauthorized: Insufficient permissions");
    }

    setUser(userData);
    setToken(tokens.idToken);
  };

  const signOut = async () => {
    await cognitoSignOut();
    setUser(null);
    setToken(null);
  };

  const value: AuthContextValue = {
    get user() {
      return user();
    },
    get token() {
      return token();
    },
    get isLoading() {
      return isLoading();
    },
    get isAuthenticated() {
      return !!user();
    },
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
