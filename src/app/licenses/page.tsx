'use client';
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';

interface License {
  name: string;
  version: string;
  license: string;
  description: string;
  url: string;
}

const licenses: License[] = [
  {
    name: 'Next.js',
    version: '16.1.6',
    license: 'MIT',
    description: 'The React Framework for the Web',
    url: 'https://nextjs.org',
  },
  {
    name: 'React',
    version: '19.2.3',
    license: 'MIT',
    description: 'A JavaScript library for building user interfaces',
    url: 'https://react.dev',
  },
  {
    name: 'Tailwind CSS',
    version: '4.x',
    license: 'MIT',
    description: 'A utility-first CSS framework',
    url: 'https://tailwindcss.com',
  },
  {
    name: 'Zustand',
    version: '5.0.10',
    license: 'MIT',
    description: 'Bear necessities for state management in React',
    url: 'https://zustand-demo.pmnd.rs',
  },
  {
    name: 'TanStack Query',
    version: '5.90.20',
    license: 'MIT',
    description: 'Powerful asynchronous state management for React',
    url: 'https://tanstack.com/query',
  },
  {
    name: 'Axios',
    version: '1.13.2',
    license: 'MIT',
    description: 'Promise based HTTP client for the browser and Node.js',
    url: 'https://axios-http.com',
  },
];

export default function LicensesPage() {
  return (
    <MainLayout headerProps={{ title: '오픈소스 라이선스', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-neutral-900 mb-2">오픈소스 라이선스</h1>
          <p className="text-sm text-neutral-600 leading-relaxed">
            DuckDuck은 아래의 오픈소스 라이브러리를 사용하여 제작되었습니다.
            모든 라이브러리의 저작자에게 감사드립니다.
          </p>
        </div>

        {/* License List */}
        <div className="space-y-3">
          {licenses.map((lib) => (
            <div
              key={lib.name}
              className="border border-neutral-100 rounded-xl p-4 hover:border-neutral-200 transition-colors"
            >
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-neutral-900">{lib.name}</h3>
                  <span className="text-xs text-neutral-400">v{lib.version}</span>
                </div>
                <span className="text-xs font-medium text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-full">
                  {lib.license}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mb-2">{lib.description}</p>
              <a
                href={lib.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {lib.url}
              </a>
            </div>
          ))}
        </div>

        {/* MIT License Text */}
        <div className="mt-8 bg-neutral-50 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-neutral-900 mb-3">MIT License</h2>
          <p className="text-xs text-neutral-500 leading-relaxed font-mono">
            Permission is hereby granted, free of charge, to any person obtaining a copy
            of this software and associated documentation files (the &quot;Software&quot;), to deal
            in the Software without restriction, including without limitation the rights
            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
            copies of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions: The above copyright
            notice and this permission notice shall be included in all copies or
            substantial portions of the Software.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-neutral-400">
            이 프로젝트는 위 오픈소스 라이브러리를 사용합니다.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
