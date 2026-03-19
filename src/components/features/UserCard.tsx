'use client';

import React from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import type { UserWithProfile } from '@/types';

interface UserCardProps {
  user: UserWithProfile;
  showFollowButton?: boolean;
  isFollowing?: boolean;
  onFollow?: (userId: number) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  showFollowButton = false,
  isFollowing = false,
  onFollow,
}) => {
  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors">
      <Link href={`/user/${user.nickname}`}>
        <Avatar src={user.profile?.profileImageUrl} alt={user.nickname} size="md" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/user/${user.nickname}`} className="text-sm font-semibold text-neutral-900 hover:underline block truncate">
          {user.nickname}
        </Link>
        {user.profile?.bio && (
          <p className="text-xs text-neutral-500 truncate">{user.profile?.bio}</p>
        )}
      </div>
      {showFollowButton && (
        <Button
          variant={isFollowing ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => onFollow?.(user.id)}
        >
          {isFollowing ? '팔로잉' : '팔로우'}
        </Button>
      )}
    </div>
  );
};
