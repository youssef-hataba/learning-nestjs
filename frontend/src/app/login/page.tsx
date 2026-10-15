'use client';

import { useState } from 'react';
import Link from 'next/link';
import { loginUser, registerUser, sendVerificationCode, verifyEmailCode } from '@/features/auth/api';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register' | 'verify'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await loginUser({ email, password });
      setMessage({ text: 'Logged in successfully! Token saved.', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message || 'Login failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await registerUser({ username, email, password });
      setMessage({ text: 'Account created! Verification code sent to your email.', type: 'success' });
      setMode('verify');
    } catch (err: any) {
      setMessage({ text: err.message || 'Registration failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await verifyEmailCode(email, code);
      setMessage({ text: 'Email verified successfully! You can now log in.', type: 'success' });
      setMode('login');
    } catch (err: any) {
      setMessage({ text: err.message || 'Invalid or expired code', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function handleResendCode() {
    if (!email) {
      setMessage({ text: 'Please enter your email first.', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await sendVerificationCode(email);
      setMessage({ text: 'A new code has been sent to your email.', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to resend code', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="rounded-lg border border-[#21252b] bg-[#121518] p-6 shadow-sm">
        {/* Header Tabs */}
        <div className="flex border-b border-[#21252b] pb-3 mb-5 justify-between items-center">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setMessage(null);
              }}
              className={`text-xs font-semibold pb-1 cursor-pointer transition-colors ${
                mode === 'login'
                  ? 'text-[#f5f0e6] border-b-2 border-[#f5f0e6]'
                  : 'text-[#878075] hover:text-[#d8d0c2]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setMessage(null);
              }}
              className={`text-xs font-semibold pb-1 cursor-pointer transition-colors ${
                mode === 'register'
                  ? 'text-[#f5f0e6] border-b-2 border-[#f5f0e6]'
                  : 'text-[#878075] hover:text-[#d8d0c2]'
              }`}
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('verify');
                setMessage(null);
              }}
              className={`text-xs font-semibold pb-1 cursor-pointer transition-colors ${
                mode === 'verify'
                  ? 'text-[#f5f0e6] border-b-2 border-[#f5f0e6]'
                  : 'text-[#878075] hover:text-[#d8d0c2]'
              }`}
            >
              Verify Code
            </button>
          </div>
          <Link href="/" className="text-[11px] text-[#736c62] hover:text-[#f5f0e6]">
            Back to store
          </Link>
        </div>

        {/* Message banner */}
        {message && (
          <div
            className={`mb-4 rounded p-2.5 text-xs ${
              message.type === 'success'
                ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-200'
                : 'bg-rose-950/40 border border-rose-800 text-rose-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Mode: Login */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-medium text-[#c4bcae] mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full rounded-md border border-[#21252b] bg-[#0d0f11] px-3 py-1.5 text-xs text-[#f5f0e6] placeholder-[#575249] focus:border-[#d8d0c2] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#c4bcae] mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-[#21252b] bg-[#0d0f11] px-3 py-1.5 text-xs text-[#f5f0e6] placeholder-[#575249] focus:border-[#d8d0c2] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[#f5f0e6] py-2 text-xs font-medium text-[#0d0f11] hover:bg-[#e4dbce] transition-colors disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? 'Processing...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Mode: Register */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-medium text-[#c4bcae] mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                className="w-full rounded-md border border-[#21252b] bg-[#0d0f11] px-3 py-1.5 text-xs text-[#f5f0e6] placeholder-[#575249] focus:border-[#d8d0c2] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#c4bcae] mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full rounded-md border border-[#21252b] bg-[#0d0f11] px-3 py-1.5 text-xs text-[#f5f0e6] placeholder-[#575249] focus:border-[#d8d0c2] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#c4bcae] mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-md border border-[#21252b] bg-[#0d0f11] px-3 py-1.5 text-xs text-[#f5f0e6] placeholder-[#575249] focus:border-[#d8d0c2] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[#f5f0e6] py-2 text-xs font-medium text-[#0d0f11] hover:bg-[#e4dbce] transition-colors disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
        )}

        {/* Mode: Verify Code */}
        {mode === 'verify' && (
          <form onSubmit={handleVerify} className="space-y-3.5">
            <p className="text-[11px] text-[#9c9487]">
              Enter the 6-digit verification code sent to your email.
            </p>
            <div>
              <label className="block text-[11px] font-medium text-[#c4bcae] mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full rounded-md border border-[#21252b] bg-[#0d0f11] px-3 py-1.5 text-xs text-[#f5f0e6] placeholder-[#575249] focus:border-[#d8d0c2] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#c4bcae] mb-1">Verification Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="w-full tracking-widest text-center font-mono rounded-md border border-[#21252b] bg-[#0d0f11] px-3 py-2 text-sm text-[#f5f0e6] placeholder-[#575249] focus:border-[#d8d0c2] focus:outline-none"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-md bg-[#f5f0e6] py-2 text-xs font-medium text-[#0d0f11] hover:bg-[#e4dbce] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="px-3 rounded-md border border-[#21252b] bg-[#14171a] text-xs text-[#c4bcae] hover:bg-[#1b1f24] transition-colors cursor-pointer"
              >
                Resend
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
