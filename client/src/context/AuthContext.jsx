import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import api, { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../api/axios.js";

const AuthContext = createContext(null);

const loadStoredUser = () => {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [user, setUser] = useState(loadStoredUser);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(AUTH_TOKEN_KEY)));

  const persistUser = useCallback((nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const applySession = useCallback(
    ({ token: nextToken, user: nextUser }) => {
      localStorage.setItem(AUTH_TOKEN_KEY, nextToken);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
      setToken(nextToken);
      setUser(nextUser);
    },
    []
  );

  const refreshUser = useCallback(async () => {
    const { data } = await api.get("/auth/me");
    persistUser(data.user);
    return data.user;
  }, [persistUser]);

  useEffect(() => {
    let isMounted = true;

    const syncAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const nextUser = await refreshUser();
        if (isMounted) {
          persistUser(nextUser);
        }
      } catch (error) {
        if (isMounted) {
          clearSession();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    syncAuth();

    return () => {
      isMounted = false;
    };
  }, [clearSession, persistUser, refreshUser, token]);

  const login = useCallback(
    async (payload) => {
      const { data } = await api.post("/auth/login", payload);
      applySession(data);
      return data.user;
    },
    [applySession]
  );

  const signup = useCallback(
    async (payload) => {
      const { data } = await api.post("/auth/signup", payload);
      applySession(data);
      return data.user;
    },
    [applySession]
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      signup,
      logout,
      refreshUser,
      updateUser: persistUser
    }),
    [loading, login, logout, persistUser, refreshUser, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
};
