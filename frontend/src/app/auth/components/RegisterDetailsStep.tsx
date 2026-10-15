'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store';
import { registerUser } from '../api';
import { User } from '../types';
import { notify } from '@/lib/notifications';

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
    setRegStep,
  } = useAuthStore();

  async function handleCompleteRegistration(e: React.FormEvent) {
    e.preventDefault();

    if (!verificationToken) {
      notify.error(
        'Email verification token is missing or expired. Please verify your email again.',
        'Session Expired'
      );
      setRegStep('email');
      return;
    }

    if (password !== confirmPassword) {
      notify.error('Passwords do not match. Please verify both fields.', 'Validation Error');
      return;
    }

    if (password.length < 6) {
      notify.error('Password must be at least 6 characters long.', 'Password Too Short');
      return;
    }

    setLoading(true);

    try {
      const res = await registerUser({
        username: username.trim(),
        verificationToken,
        password,
        confirmPassword,
      });

      onSuccess(res.user);
      notify.success(
        'Account created and verified! Welcome to Planto.',
        'Registration Complete'
      );

      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err: any) {
      notify.error(
        err.message || 'Registration failed. The username may already be taken.',
        'Registration Error'
      );
    } finally {
      setLoading(false);
    }
  }

  const isPasswordMatch = password && confirmPassword && password === confirmPassword;

  return (
    <div className="flex flex-col">
      {/* Title & Badge */}
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#252c24] border border-[#b6f076]/30 text-[#b6f076] text-[11px] font-semibold uppercase tracking-wider mb-3">
          🌱 Final Step: Profile Creation
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#f6ffe4] tracking-tight">
          Complete Your Profile
        </h2>
        <p className="text-xs sm:text-sm text-[#c2c9b5]/80 mt-2 max-w-sm mx-auto leading-relaxed">
          Your email has been verified. Choose a unique username and strong password.
        </p>
      </div>

      <form onSubmit={handleCompleteRegistration} className="space-y-4">
        {/* Verified Email Chip */}
        <div className="rounded-2xl bg-[#252c24] border border-[#b6f076]/30 px-4 py-3 flex items-center justify-between text-xs text-[#b6f076]">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-bold">✓</span>
            <span className="text-[#c2c9b5]">
              Verified Email: <strong className="font-mono text-[#f6ffe4]">{email}</strong>
            </span>
          </div>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-[#b6f076] bg-[#1a211a] px-2 py-0.5 rounded-full border border-[#b6f076]/30">
            Confirmed
          </span>
        </div>

        {/* Username */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-[#f6ffe4]">
              Sanctuary Username <span className="text-[#b6f076]">*</span>
            </label>
            <span className="text-[10px] text-[#c2c9b5]/60">3-30 characters</span>
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-xs text-[#c2c9b5]/60">@</span>
            <input
              type="text"
              required
              minLength={3}
              maxLength={30}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="botanical_curator"
              className="w-full rounded-2xl border border-white/10 bg-[#0e150e]/90 pl-8 pr-4 py-2.5 text-xs text-[#dde5d9] placeholder-[#c2c9b5]/30 focus:border-[#b6f076] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-[#f6ffe4] mb-1.5">
            Password <span className="text-[#b6f076]">*</span>
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="w-full rounded-2xl border border-white/10 bg-[#0e150e]/90 px-4 py-2.5 text-xs text-[#dde5d9] placeholder-[#c2c9b5]/30 focus:border-[#b6f076] focus:outline-none transition-colors"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-[#f6ffe4]">
              Confirm Password <span className="text-[#b6f076]">*</span>
            </label>
            {confirmPassword && (
              <span className={`text-[10px] font-medium ${isPasswordMatch ? 'text-[#b6f076]' : 'text-rose-400'}`}>
                {isPasswordMatch ? '✓ Passwords match' : '✕ Passwords mismatch'}
              </span>
            )}
          </div>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            className={`w-full rounded-2xl border bg-[#0e150e]/90 px-4 py-2.5 text-xs text-[#dde5d9] placeholder-[#c2c9b5]/30 focus:outline-none transition-colors ${
              confirmPassword && !isPasswordMatch
                ? 'border-rose-700 focus:border-rose-600'
                : 'border-white/10 focus:border-[#b6f076]'
            }`}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !username || !password || password !== confirmPassword}
          className="w-full rounded-full bg-[#b6f076] py-3.5 text-xs sm:text-sm font-bold text-[#121812] hover:bg-[#c7f88f] hover:shadow-[0_0_24px_rgba(182,240,118,0.4)] transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-[#121812] border-t-transparent animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Complete Registration</span>
              <span>→</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
