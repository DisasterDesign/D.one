'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function MatcherLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/matcher/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/matcher');
      } else {
        setError(data.error || 'סיסמה שגויה');
      }
    } catch {
      setError('שגיאת תקשורת, נסה שוב');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.svg" alt="Done1" width={80} height={80} className="mb-4" />
          <h1 className="text-xl font-bold text-[#142850]">מערכת התאמה</h1>
          <p className="text-sm text-[#888888] mt-1">הזן סיסמה כדי להיכנס</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="סיסמה"
              className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-[#0090D5] focus:border-transparent"
              autoFocus
              dir="rtl"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 bg-[#0090D5] hover:bg-[#007bb8] text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'כניסה'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
