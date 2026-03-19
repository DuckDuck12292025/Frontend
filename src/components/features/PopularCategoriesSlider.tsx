'use client';

import React from 'react';
import Link from 'next/link';
import type { Category } from '@/types';

interface PopularCategoriesSliderProps {
  categories: Category[];
}

export const PopularCategoriesSlider: React.FC<PopularCategoriesSliderProps> = ({ categories }) => {
  if (categories.length === 0) return null;

  return (
    <div className="border-b border-neutral-100 py-3">
      <div className="flex gap-2 overflow-x-auto px-4 scrollbar-hide">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="shrink-0 px-4 py-1.5 rounded-full border border-neutral-200 text-sm text-neutral-700 hover:bg-neutral-100 hover:border-neutral-300 transition-colors"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
};
