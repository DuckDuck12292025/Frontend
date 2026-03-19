'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button, Input } from '@/components/ui';
import { useLogin } from '@/hooks/queries';

const oauthProviders = [
  { name: '카카오', bg: 'bg-[#FEE500]', text: 'text-[#191919]', hoverBg: 'hover:bg-[#F5DC00]' },
  { name: '네이버', bg: 'bg-[#03C75A]', text: 'text-white', hoverBg: 'hover:bg-[#02b351]' },
  { name: '구글', bg: 'bg-white', text: 'text-neutral-700', hoverBg: 'hover:bg-neutral-50', border: 'border border-neutral-300' },
  { name: 'Apple', bg: 'bg-black', text: 'text-white', hoverBg: 'hover:bg-neutral-800' },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';
  const loginMutation = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          router.push(returnUrl);
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
        },
      }
    );
  };

  const handleOAuthClick = (provider: string) => {
    // Mock: OAuth is placeholder only
    alert(`${provider} 로그인은 준비 중입니다.`);
  };

  return (
    <AuthLayout title="로그인하여 시작하세요">
      {/* OAuth Buttons */}
      <div className="space-y-2.5">
        {oauthProviders.map((provider) => (
          <button
            key={provider.name}
            type="button"
            onClick={() => handleOAuthClick(provider.name)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${provider.bg} ${provider.text} ${provider.hoverBg} ${provider.border || ''}`}
          >
            {provider.name}로 계속하기
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-neutral-200" />
        <span className="text-xs text-neutral-400">또는</span>
        <div className="flex-1 h-px bg-neutral-200" />
      </div>

      {/* Email Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="이메일"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          required
        />
        <Input
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          error={error}
          required
        />
        <Button type="submit" fullWidth disabled={loginMutation.isPending}>
          {loginMutation.isPending ? '로그인 중...' : '로그인'}
        </Button>
      </form>

      <div className="mt-6 text-center space-y-2">
        <Link href="/forgot-password" className="text-sm text-neutral-500 hover:text-neutral-900">
          비밀번호를 잊으셨나요?
        </Link>
        <p className="text-sm text-neutral-500">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="text-neutral-900 font-medium hover:underline">
            회원가입
          </Link>
        </p>
      </div>

      {/* Demo Account Info */}
      <div className="mt-8 p-3 rounded-lg bg-neutral-50 border border-neutral-200">
        <p className="text-xs text-neutral-500 text-center">
          테스트 계정: <span className="font-mono text-neutral-700">abcd123@abc.com</span> / <span className="font-mono text-neutral-700">test1234</span>
        </p>
      </div>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
