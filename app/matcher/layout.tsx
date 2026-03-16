'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function MatcherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  function handleLogout() {
    document.cookie = 'matcher_token=; path=/; max-age=0';
    router.push('/matcher/login');
  }

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <header className="bg-[#142850] text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image src="/logo.svg" alt="Done1" width={36} height={36} />
          </Link>
          <h1 className="text-lg font-bold">מערכת התאמה</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          יציאה
        </button>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
