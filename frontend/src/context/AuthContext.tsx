import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { API_URL, authFetch } from '../utils/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      // Check if URL has ?token= from OAuth redirect
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      if (urlToken) {
        localStorage.setItem('tripzy_token', urlToken);
        // Clean URL query cleanly without reloading page
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const storedToken = localStorage.getItem('tripzy_token');
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await authFetch(`${API_URL}/auth/me`);

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          localStorage.removeItem('tripzy_token');
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Redirect to Google OAuth on backend
  const login = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const loginWithEmail = async (email: string, password: string) => {
    const res = await authFetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to log in');
    }

    if (data.token) {
      localStorage.setItem('tripzy_token', data.token);
    }
    setUser(data.user);
  };

  const signupWithEmail = async (name: string, email: string, password: string) => {
    const res = await authFetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to sign up');
    }

    if (data.token) {
      localStorage.setItem('tripzy_token', data.token);
    }
    setUser(data.user);
  };

  // Clear session
  const logout = async () => {
    try {
      await authFetch(`${API_URL}/auth/logout`, {
        method: 'POST',
      });
    } catch {
      // Even if the request fails, clear local state
    } finally {
      localStorage.removeItem('tripzy_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithEmail, signupWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
