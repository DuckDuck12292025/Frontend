import { create } from 'zustand';
import type { UserWithProfile, UserProfile, AuthTokens } from '@/types';

interface AuthState {
  user: UserWithProfile | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: UserWithProfile | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: UserWithProfile, tokens: AuthTokens) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  hydrate: () => void;
}

type AuthStore = AuthState & AuthActions;

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

// Helper to check authentication status
const checkIsAuthenticated = (
  user: UserWithProfile | null,
  tokens: AuthTokens | null
): boolean => {
  return user !== null && tokens !== null;
};

export const useAuthStore = create<AuthStore>()((set, get) => ({
  // State
  user: null,
  tokens: null,
  isLoading: false,
  isAuthenticated: false,

  // Actions
  setUser: (user) => {
    const { tokens } = get();
    set({
      user,
      isAuthenticated: checkIsAuthenticated(user, tokens),
    });
  },

  setTokens: (tokens) => {
    const { user } = get();
    set({
      tokens,
      isAuthenticated: checkIsAuthenticated(user, tokens),
    });

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      if (tokens) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      }
    }
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  login: (user, tokens) => {
    set({
      user,
      tokens,
      isAuthenticated: true,
    });

    // Persist tokens to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    }
  },

  logout: () => {
    set({
      user: null,
      tokens: null,
      isAuthenticated: false,
    });

    // Clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
  },

  updateProfile: (profileUpdates) => {
    const { user } = get();
    if (!user || !user.profile) return;

    set({
      user: {
        ...user,
        profile: {
          ...user.profile,
          ...profileUpdates,
        } as UserProfile,
      },
    });
  },

  hydrate: () => {
    if (typeof window === 'undefined') return;

    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (accessToken && refreshToken) {
      set({
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 0, // Will be updated when user data is fetched
        },
      });
    }
  },
}));

// Selector hooks for optimized re-renders
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
