'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store';
import { loginUser } from '../api';
import { User } from '../types';

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
    setMessage,
    setActiveTab,
  } = useAuthStore();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await loginUser({ email: email.trim(), password });
      onSuccess(res.user);
      setMessage({
        text: res.message || 'Signed in successfully! Redirecting...',
        type: 'success',
      });
      setTimeout(() => {
        router.push('/');
      }, 1200);
    } catch (err: any) {
      setMessage({
        text: err.message || 'Invalid email or password. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block text-[11px] font-medium text-[#c4bcae] mb-1.5">
          Email Address
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          className="w-full rounded-lg border border-[#21252b] bg-[#0d0f11] px-3.5 py-2 text-xs text-[#f5f0e6] placeholder-[#575249] focus:border-[#d8d0c2] focus:outline-none transition-colors"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-[11px] font-medium text-[#c4bcae]">
            Password
          </label>
        </div>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-lg border border-[#21252b] bg-[#0d0f11] px-3.5 py-2 text-xs text-[#f5f0e6] placeholder-[#575249] focus:border-[#d8d0c2] focus:outline-none transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#f5f0e6] py-2.5 text-xs font-semibold text-[#0d0f11] hover:bg-[#e4dbce] transition-all disabled:opacity-50 cursor-pointer shadow-sm mt-3"
      >
        {loading ? 'Authenticating...' : 'Sign In'}
      </button>

      <p className="text-center text-[11px] text-[#736c62] pt-2">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={() => setActiveTab('register')}
          className="text-[#f5f0e6] underline cursor-pointer hover:text-white"
        >
          Create one now
        </button>
      </p>
    </form>
  );
}
