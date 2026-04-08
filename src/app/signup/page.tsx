/**
 * 페이지: 회원가입
 * 경로: /signup
 * 설명: 이메일, 닉네임, 비밀번호를 입력받아 회원가입을 처리하는 화면.
 *       이용약관 동의 체크 후 가입이 가능하다.
 *
 * 사용하는 API:
 *   - POST /auth/signup — 회원가입
 *
 * Mock 상태: 실제 API 연동 가능
 */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button, Input } from '@/components/ui';
import { useSignup } from '@/hooks/queries';
import { getErrorMessage } from '@/lib/api/client';

export default function SignupPage() {
  const router = useRouter();
  const signupMutation = useSignup();
  const [form, setForm] = useState({ email: '', nickname: '', password: '', confirmPassword: '' });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreedToTerms) {
      setError('이용약관에 동의해주세요.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    signupMutation.mutate(
      { email: form.email, password: form.password, nickname: form.nickname },
      {
        onSuccess: () => {
          router.push('/');
        },
        onError: (err) => {
          setError(getErrorMessage(err));
        },
      }
    );
  };

  return (
    <AuthLayout title="DuckDuck에 가입하세요" showBackButton>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="이메일"
          type="email"
          value={form.email}
          onChange={handleChange('email')}
          placeholder="email@example.com"
          required
        />
        <Input
          label="닉네임"
          value={form.nickname}
          onChange={handleChange('nickname')}
          placeholder="닉네임"
          required
        />
        <Input
          label="비밀번호"
          type="password"
          value={form.password}
          onChange={handleChange('password')}
          placeholder="비밀번호"
          required
        />
        <Input
          label="비밀번호 확인"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange('confirmPassword')}
          placeholder="비밀번호 확인"
          error={error}
          required
        />

        {/* Terms Agreement */}
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500 accent-neutral-900"
          />
          <span className="text-sm text-neutral-600">
            <Link href="/terms" className="text-neutral-900 font-medium underline hover:text-neutral-700" target="_blank">
              이용약관
            </Link>
            {' '}및{' '}
            <Link href="/terms" className="text-neutral-900 font-medium underline hover:text-neutral-700" target="_blank">
              개인정보처리방침
            </Link>
            에 동의합니다.
          </span>
        </label>

        <Button type="submit" fullWidth disabled={signupMutation.isPending || !agreedToTerms}>
          {signupMutation.isPending ? '가입 중...' : '회원가입'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-neutral-500">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="text-neutral-900 font-medium hover:underline">로그인</Link>
      </p>
    </AuthLayout>
  );
}
