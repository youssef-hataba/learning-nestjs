'use client';

import { useAuthStore } from '../store';
import { verifyEmailCode, sendVerificationCode } from '../api';

export default function RegisterOtpStep() {
  const {
    email,
    otpCode,
    loading,
    resendCooldown,
    setOtpCode,
    setVerificationToken,
    setLoading,
    setMessage,
    setRegStep,
    setResendCooldown,
  } = useAuthStore();

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setMessage({ text: 'Please enter the complete 6-digit verification code.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await verifyEmailCode(email.trim(), otpCode.trim());
      setVerificationToken(res.verificationToken);
      setMessage({
        text: 'Email verified successfully! Complete your profile details below.',
        type: 'success',
      });
      setRegStep('details');
    } catch (err: any) {
      setMessage({
        text: err.message || 'Invalid or expired verification code.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    if (resendCooldown > 0 || loading) return;
    setLoading(true);
    setMessage(null);

    try {
      const res = await sendVerificationCode(email.trim());
      setMessage({
        text: res.message || 'A new 6-digit code was sent to your email.',
        type: 'success',
      });
      setResendCooldown(60);
    } catch (err: any) {
      setMessage({
        text: err.message || 'Failed to resend code. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleVerifyOtp} className="space-y-4">
      <div className="rounded-lg bg-[#15191e] border border-[#23282f] p-3 text-xs text-[#b8b0a2] flex justify-between items-center">
        <div>
          <span className="text-[10px] text-[#736c62] block">Verification code sent to:</span>
          <span className="font-mono text-[#f5f0e6]">{email}</span>
        </div>
        <button
          type="button"
          onClick={() => {
            setRegStep('email');
            setMessage(null);
          }}
          className="text-[11px] text-[#a89f91] hover:text-[#f5f0e6] underline cursor-pointer"
        >
          Change
        </button>
      </div>

      <div>
        <label className="block text-[11px] font-medium text-[#c4bcae] mb-1.5">
          6-Digit Verification Code
        </label>
        <input
          type="text"
          required
          maxLength={6}
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
          placeholder="123456"
          className="w-full tracking-[0.5em] text-center font-mono rounded-lg border border-[#21252b] bg-[#0d0f11] px-3.5 py-2.5 text-base font-semibold text-[#f5f0e6] placeholder-[#38332c] focus:border-[#d8d0c2] focus:outline-none transition-colors"
        />
        <p className="text-[10px] text-[#736c62] mt-1.5 text-center">
          The code expires in 10 minutes.
        </p>
      </div>

      <div className="flex gap-2.5 pt-1">
        <button
          type="submit"
          disabled={loading || otpCode.length !== 6}
          className="flex-1 rounded-lg bg-[#f5f0e6] py-2.5 text-xs font-semibold text-[#0d0f11] hover:bg-[#e4dbce] transition-all disabled:opacity-50 cursor-pointer shadow-sm"
        >
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </button>

        <button
          type="button"
          onClick={handleResendOtp}
          disabled={loading || resendCooldown > 0}
          className="px-3.5 py-2.5 rounded-lg border border-[#21252b] bg-[#161a1e] text-xs text-[#c4bcae] hover:bg-[#1f242b] transition-colors disabled:opacity-40 cursor-pointer whitespace-nowrap"
        >
          {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend Code'}
        </button>
      </div>
    </form>
  );
}
