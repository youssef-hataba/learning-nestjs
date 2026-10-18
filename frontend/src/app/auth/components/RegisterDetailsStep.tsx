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
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaf1e8] border border-[#A8C3A0]/40 text-[#3c5a38] text-[11px] font-semibold uppercase tracking-wider mb-3">
          🌱 Final Step: Profile Creation
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#203123] tracking-tight">
          Complete Your Profile
        </h2>
        <p className="text-xs sm:text-sm text-[#5e7362] mt-2 max-w-sm mx-auto leading-relaxed">
          Your email has been verified. Choose a unique username and strong password.
        </p>
      </div>

      <form onSubmit={handleCompleteRegistration} className="space-y-3.5">
        {/* Verified Email Chip */}
        <div className="rounded-xl bg-[#eaf1e8] border border-[#A8C3A0]/40 px-4 py-2.5 flex items-center justify-between text-xs text-[#203123]">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-bold text-[#4e7349]">✓</span>
            <span className="text-[#5e7362]">
              Verified Email: <strong className="font-mono text-[#203123]">{email}</strong>
            </span>
          </div>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-[#3c5a38] bg-white px-2 py-0.5 rounded-full border border-[#A8C3A0]/40">
            Confirmed
          </span>
        </div>

        {/* Username */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-[#203123]">
              Sanctuary Username <span className="text-[#4e7349]">*</span>
            </label>
            <span className="text-[10px] text-[#8ca090]">3-30 characters</span>
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-xs text-[#8ca090]">@</span>
            <input
              type="text"
              required
              minLength={3}
              maxLength={30}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="botanical_curator"
              className="w-full rounded-xl border border-[#A8C3A0]/40 bg-[#f8faf7] pl-8 pr-4 py-2.5 text-xs text-[#203123] placeholder-[#8ca090] focus:border-[#4e7349] focus:bg-white focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-[#203123] mb-1.5">
            Password <span className="text-[#4e7349]">*</span>
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="w-full rounded-xl border border-[#A8C3A0]/40 bg-[#f8faf7] px-4 py-2.5 text-xs text-[#203123] placeholder-[#8ca090] focus:border-[#4e7349] focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-[#203123]">
              Confirm Password <span className="text-[#4e7349]">*</span>
            </label>
            {confirmPassword && (
              <span className={`text-[10px] font-medium ${isPasswordMatch ? 'text-[#4e7349]' : 'text-rose-500'}`}>
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
            className={`w-full rounded-xl border bg-[#f8faf7] px-4 py-2.5 text-xs text-[#203123] placeholder-[#8ca090] focus:bg-white focus:outline-none transition-colors ${
              confirmPassword && !isPasswordMatch
                ? 'border-rose-400 focus:border-rose-500'
                : 'border-[#A8C3A0]/40 focus:border-[#4e7349]'
            }`}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !username || !password || password !== confirmPassword}
          className="w-full rounded-full bg-[#4e7349] py-3 text-xs sm:text-sm font-semibold text-white hover:bg-[#3d5c38] hover:shadow-lg transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2 mt-2 shadow-md shadow-[#4e7349]/20"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
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
