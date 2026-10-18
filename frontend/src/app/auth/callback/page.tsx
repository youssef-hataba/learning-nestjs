'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { notify } from '@/lib/notifications';
import { useCurrentUser } from '@/app/auth/hooks';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { triggerRefetch } = useCurrentUser();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (token) {
      localStorage.setItem('token', token);
      triggerRefetch();
      notify.success(
        'Signed in with Google successfully! Welcome to your Planto sanctuary.',
        'Access Granted'
      );
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } else if (error) {
      notify.error(
        decodeURIComponent(error) || 'Google sign-in was cancelled or failed. Please try again.',
        'Google Auth Failed'
      );
      setTimeout(() => {
        router.replace('/');
      }, 800);
    } else {
      router.replace('/');
    }
  }, [searchParams, router, triggerRefetch]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      {/* Background Ambient Glow */}
      <div className="absolute w-96 h-96 bg-[#b6f076]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Sanctuary Loading Card */}
      <div className="relative z-10 bg-[#161d16]/90 border border-white/10 rounded-3xl p-8 sm:p-10 max-w-md w-full text-center shadow-2xl backdrop-blur-2xl">
        <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-[#b6f076]/20 border-t-[#b6f076] animate-spin" />
          <div className="absolute w-8 h-8 rounded-full bg-[#1a211a] flex items-center justify-center text-[#b6f076]">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C8 2 4 6 4 11c0 4.5 3.5 8 8 9 4.5-1 8-4.5 8-9 0-5-4-9-8-9zm0 16c-3.3 0-6-2.7-6-6 0-3 2.2-5.4 5-5.9V13h2V6.1c2.8.5 5 2.9 5 5.9 0 3.3-2.7 6-6 6z" />
            </svg>
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-[#f6ffe4] tracking-tight mb-2">
          Verifying Google Sanctuary Pass
        </h2>
        <p className="text-xs sm:text-sm text-[#c2c9b5]/70 leading-relaxed">
          Connecting to your botanical profile and establishing secure session tokens...
        </p>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-[#b6f076]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#b6f076] animate-ping" />
          <span>NestJS Guarded Auth Gateway</span>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center text-xs text-[#c2c9b5]">
          Loading sanctuary gateway...
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
