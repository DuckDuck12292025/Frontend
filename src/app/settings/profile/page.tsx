'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button, Input, Avatar } from '@/components/ui';
import { useAuthStore } from '@/stores/auth';
import { useUpdateProfile } from '@/hooks/queries';
import { mockUsers } from '@/mocks/data';

export default function ProfileSettingsPage() {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.user) ?? mockUsers[0];
  const updateProfile = useUpdateProfile();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    nickname: currentUser.nickname,
    handle: currentUser.handle || currentUser.nickname,
    bio: currentUser.profile?.bio || '',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSave = () => {
    updateProfile.mutate(form, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      },
    });
  };

  return (
    <MainLayout headerProps={{ title: '프로필 편집', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl p-4 space-y-6">
        {/* Background image */}
        <div className="relative w-full h-32 rounded-lg bg-neutral-100 overflow-hidden">
          {currentUser.profile?.backgroundImageUrl ? (
            <img src={currentUser.profile.backgroundImageUrl} alt="배경" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-neutral-200" />
          )}
          <button className="absolute bottom-2 right-2 bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-900 hover:bg-neutral-50 transition-colors shadow-sm">
            배경 이미지 변경
          </button>
        </div>

        {/* Profile image */}
        <div className="flex flex-col items-center gap-3 -mt-12 relative z-10">
          <Avatar src={currentUser.profile?.profileImageUrl} alt={currentUser.nickname} size="xl" />
          <button className="text-sm font-medium text-neutral-900 hover:underline">사진 변경</button>
        </div>

        {/* Nickname */}
        <Input label="닉네임" value={form.nickname} onChange={handleChange('nickname')} />

        {/* Handle */}
        <Input label="핸들" value={form.handle} onChange={handleChange('handle')} />

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">소개</label>
          <textarea
            value={form.bio}
            onChange={handleChange('bio')}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 resize-none"
          />
        </div>

        {saved && (
          <div className="text-sm text-green-600 font-medium text-center">저장되었습니다!</div>
        )}

        <Button fullWidth onClick={handleSave} disabled={updateProfile.isPending}>
          {updateProfile.isPending ? '저장 중...' : '저장'}
        </Button>
      </div>
    </MainLayout>
  );
}
