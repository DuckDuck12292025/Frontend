'use client';

import React, { useEffect } from 'react';
import { QueryProvider } from '@/lib/providers/QueryProvider';
import { useAuthStore } from '@/stores/auth';
import { setAuthToken } from '@/lib/api/client';
import { useMe } from '@/hooks/queries';
import { ToastProvider } from '@/components/ui/Toast';
import { AuthGuard } from './AuthGuard';

const AuthHydration: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const hydrate = useAuthStore((s) => s.hydrate);
  const tokens = useAuthStore((s) => s.tokens);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Set axios header when tokens are hydrated from localStorage
  useEffect(() => {
    if (tokens?.accessToken) {
      setAuthToken(tokens.accessToken);
    }
  }, [tokens?.accessToken]);

  // Fetch user data if we have tokens
  useMe();

  return <>{children}</>;
};

export const Providers: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <QueryProvider>
      <ToastProvider>
        <AuthHydration>
          <AuthGuard>{children}</AuthGuard>
        </AuthHydration>
      </ToastProvider>
    </QueryProvider>
  );
};
