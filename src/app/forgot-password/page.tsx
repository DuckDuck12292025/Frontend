'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button, Input } from '@/components/ui';

type Step = 1 | 2 | 3 | 'success';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setStep(2);
      setLoading(false);
    }, 500);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('6자리 인증 코드를 입력하세요');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setStep(3);
      setLoading(false);
    }, 500);
  };

  const handleStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다');
      return;
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setStep('success');
      setLoading(false);
    }, 500);
  };

  const subtitles: Record<Step, string> = {
    1: '가입한 이메일을 입력하세요',
    2: '이메일로 전송된 인증 코드를 입력하세요',
    3: '새 비밀번호를 설정하세요',
    success: '비밀번호가 변경되었습니다',
  };

  return (
    <AuthLayout title={subtitles[step]} showBackButton>
      {step === 1 && (
        <form onSubmit={handleStep1} className="space-y-4">
          <Input
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
          />
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? '전송 중...' : '인증 코드 전송'}
          </Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleStep2} className="space-y-4">
          <Input
            label="인증 코드"
            value={code}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 6);
              setCode(val);
              setError('');
            }}
            placeholder="6자리 코드"
            error={error}
            required
          />
          <p className="text-xs text-neutral-400">
            {email}로 전송된 6자리 코드를 입력하세요
          </p>
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? '확인 중...' : '확인'}
          </Button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleStep3} className="space-y-4">
          <Input
            label="새 비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6자 이상"
            required
          />
          <Input
            label="비밀번호 확인"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호 확인"
            error={error}
            required
          />
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? '변경 중...' : '비밀번호 변경'}
          </Button>
        </form>
      )}

      {step === 'success' && (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-neutral-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-neutral-600 text-sm">
            비밀번호가 성공적으로 변경되었습니다.<br />
            새 비밀번호로 로그인하세요.
          </p>
          <Link
            href="/login"
            className="inline-block w-full py-2.5 text-center text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            로그인으로 이동
          </Link>
        </div>
      )}

      {step !== 'success' && (
        <p className="mt-6 text-center">
          <Link href="/login" className="text-sm text-neutral-500 hover:text-neutral-900">
            로그인으로 돌아가기
          </Link>
        </p>
      )}
    </AuthLayout>
  );
}
