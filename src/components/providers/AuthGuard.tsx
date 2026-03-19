'use client';
import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore, useIsAuthenticated, useAuthLoading, useUser } from '@/stores/auth';

const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password', '/about', '/terms', '/privacy-policy', '/community-guidelines', '/licenses'];

/**
 * AuthGuard - Protects routes requiring authentication.
 *
 * When the backend is unavailable, set DEMO_MODE to true to bypass
 * route protection. With a real backend, DEMO_MODE = false enables
 * proper authentication checks using JWT tokens.
 */
const DEMO_MODE = false;

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();
  const user = useUser();
  const tokens = useAuthStore((s) => s.tokens);

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isAdmin = pathname.startsWith('/admin');

  // Consider loading if auth store is loading or if we have tokens but user hasn't been fetched yet
  const authLoading = isLoading || (!!tokens?.accessToken && !user);

  useEffect(() => {
    // In demo mode, skip all redirects so the app is fully browseable
    if (DEMO_MODE) return;

    if (authLoading) return;
    if (!isPublic && !isAuthenticated) {
      router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
    if (isPublic && isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
      router.replace('/');
    }
    if (isAdmin && user?.role !== 'ADMIN') {
      router.replace('/');
    }
  }, [authLoading, isAuthenticated, isPublic, isAdmin, pathname, router, user]);

  // In demo mode, always render children immediately
  if (DEMO_MODE) return <>{children}</>;

  // Don't block rendering on public paths, allow content to show
  if (isPublic) return <>{children}</>;

  // On protected paths, show loading while auth is being determined
  if (authLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};
