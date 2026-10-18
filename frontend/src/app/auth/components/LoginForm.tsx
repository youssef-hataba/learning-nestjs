'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store';
import { loginUser } from '../api';
import { User } from '../types';
import { notify } from '@/lib/notifications';

interface LoginFormProps {
  onSuccess: (user: User) => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();
  const {
    email,
    password,
    loading,
    setEmail,
    setPassword,
    setLoading,
    setActiveTab,
  } = useAuthStore();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser({ email: email.trim(), password });
      onSuccess(res.user);
      notify.success(
        res.message || 'Signed in successfully! Welcome back to Planto.',
        'Access Granted'
      );
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err: any) {
      notify.error(
        err.message || 'Invalid email or password. Please try again.',
        'Authentication Failed'
      );
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleAuth() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    window.location.href = `${backendUrl}/users/auth/google`;
  }

  return (
    <div className="relative z-10 flex flex-col">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#252c24] text-[#b9f479] mb-3 shadow-sm border border-white/5">
          <span className="text-sm">🌱</span>
          <span className="text-[11px] font-semibold tracking-wider uppercase">
            Sanctuary Member Access
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-[#f6ffe4] tracking-tight mb-2">
          Access Your Sanctuary
        </h1>

        <p className="text-xs sm:text-sm text-[#c2c9b5]/80 max-w-md mx-auto mb-6 leading-relaxed">
          Sign in to manage your architectural houseplant orders and care profiles.
        </p>
      </div>

      {/* Google Authentication */}
      <div className="w-full mb-5">
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="w-full py-3 px-4 rounded-full border border-white/10 bg-[#0e150e]/90 hover:bg-[#1a211a] hover:border-white/20 text-[#f6ffe4] text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-3 shadow-sm cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#161d16] px-3 text-[11px] text-[#c2c9b5]/60 absolute uppercase tracking-wider">
            or sign in with email
          </span>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#f6ffe4] mb-1.5">
            Botanical Email Address <span className="text-[#b6f076]">*</span>
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#c2c9b5]/50 group-focus-within:text-[#b6f076] transition-colors text-sm">
              @
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="curator@sanctuary.com"
              className="w-full pl-10 pr-4 py-3 bg-[#091009]/80 text-[#dde5d9] placeholder-[#c2c9b5]/30 text-sm rounded-2xl border border-white/10 outline-none shadow-inner transition-all duration-300 focus:bg-[#1a211a] focus:border-[#b6f076]/70 focus:shadow-[0_0_0_1px_rgba(182,240,118,0.3)]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#f6ffe4] mb-1.5">
            Password <span className="text-[#b6f076]">*</span>
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-[#091009]/80 text-[#dde5d9] placeholder-[#c2c9b5]/30 text-sm rounded-2xl border border-white/10 outline-none shadow-inner transition-all duration-300 focus:bg-[#1a211a] focus:border-[#b6f076]/70 focus:shadow-[0_0_0_1px_rgba(182,240,118,0.3)]"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full mt-2 py-3.5 px-6 bg-[#b6f076] text-[#121812] text-xs sm:text-sm font-bold rounded-full shadow-md shadow-[#b6f076]/20 hover:bg-[#c7f88f] hover:shadow-[#b6f076]/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-[#121812] border-t-transparent rounded-full animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In to Planto</span>
              <span className="text-base leading-none">→</span>
            </>
          )}
        </button>
      </form>

      {/* Card Footer */}
      <div className="relative z-10 mt-6 pt-4 text-center bg-[#1a211a]/40 rounded-2xl p-3 border border-white/5">
        <p className="text-xs text-[#c2c9b5]/70">
          New to Planto Sanctuary?{' '}
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className="text-[#b6f076] hover:underline font-semibold ml-1 inline-flex items-center gap-0.5 cursor-pointer"
          >
            <span>Cultivate your sanctuary</span>
            <span className="text-xs leading-none">↗</span>
          </button>
        </p>
      </div>
    </div>
  );
}
