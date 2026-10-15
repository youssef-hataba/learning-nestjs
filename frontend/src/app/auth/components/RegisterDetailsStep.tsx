'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store';
import { registerUser } from '../api';
import { User } from '../types';

interface RegisterDetailsStepProps {
  onSuccess: (user: User) => void;
}

export default function RegisterDetailsStep({ onSuccess }: RegisterDetailsStepProps) {
  const router = useRouter();
  const {
    email,
    username,
    verificationToken,
    password,
    confirmPassword,
    loading,
    setUsername,
    setPassword,
    setConfirmPassword,
    setLoading,
    setMessage,
    setRegStep,
  } = useAuthStore();

  async function handleCompleteRegistration(e: React.FormEvent) {
    e.preventDefault();

    if (!verificationToken) {
      setMessage({
        text: 'Email verification token is missing or expired. Please verify your email again.',
        type: 'error',
      });
      setRegStep('email');
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match.', type: 'error' });
      return;
    }

    if (password.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters long.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await registerUser({
        username: username.trim(),
        verificationToken,
        password,
        confirmPassword,
      });

      onSuccess(res.user);
      setMessage({
        text: 'Account created and verified! Welcome to Atelier.',
        type: 'success',
      });

      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err: any) {
      setMessage({
        text: err.message || 'Registration failed. The username may already be taken.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleCompleteRegistration} className="space-y-4">
      <div className="rounded-lg bg-emerald-950/20 border border-emerald-800/40 p-2.5 flex items-center justify-between text-xs text-emerald-200">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold">✓</span>
          <span>
            Verified: <strong className="font-mono text-emerald-100">{email}</strong>
          </span>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-medium text-[#c4bcae] mb-1.5">
          Username
        </label>
        <input
          type="text"
          required
          minLength={3}
          maxLength={30}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="johndoe"
          className="w-full rounded-lg border border-[#21252b] bg-[#0d0f11] px-3.5 py-2 text-xs text-[#f5f0e6] placeholder-[#575249] focus:border-[#d8d0c2] focus:outline-none transition-colors"
        />
        <p className="text-[10px] text-[#736c62] mt-1">3 to 30 characters</p>
      </div>

      <div>
        <label className="block text-[11px] font-medium text-[#c4bcae] mb-1.5">
          Password
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          className="w-full rounded-lg border border-[#21252b] bg-[#0d0f11] px-3.5 py-2 text-xs text-[#f5f0e6] placeholder-[#575249] focus:border-[#d8d0c2] focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label className="block text-[11px] font-medium text-[#c4bcae] mb-1.5">
          Confirm Password
        </label>
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter password"
          className={`w-full rounded-lg border bg-[#0d0f11] px-3.5 py-2 text-xs text-[#f5f0e6] placeholder-[#575249] focus:outline-none transition-colors ${
            confirmPassword && password !== confirmPassword
              ? 'border-rose-700 focus:border-rose-600'
              : 'border-[#21252b] focus:border-[#d8d0c2]'
          }`}
        />
        {confirmPassword && password !== confirmPassword && (
          <p className="text-[10px] text-rose-400 mt-1">Passwords do not match</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || (confirmPassword !== '' && password !== confirmPassword)}
        className="w-full rounded-lg bg-[#f5f0e6] py-2.5 text-xs font-semibold text-[#0d0f11] hover:bg-[#e4dbce] transition-all disabled:opacity-50 cursor-pointer shadow-sm mt-3"
      >
        {loading ? 'Creating Account...' : 'Complete Registration'}
      </button>
    </form>
  );
}
