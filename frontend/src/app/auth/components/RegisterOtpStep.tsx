'use client';

import { useRef, useEffect } from 'react';
import { useAuthStore } from '../store';
import { verifyEmailCode, sendVerificationCode } from '../api';
import { notify } from '@/lib/notifications';

export default function RegisterOtpStep() {
  const {
    email,
    otpCode,
    loading,
    resendCooldown,
    setOtpCode,
    setVerificationToken,
    setLoading,
    setRegStep,
    setResendCooldown,
  } = useAuthStore();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Array of 6 digits from otpCode
  const digits = Array.from({ length: 6 }, (_, i) => otpCode[i] || '');

  // Handle typing inside individual digit boxes
  function handleDigitChange(index: number, value: string) {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal) {
      // Clear current digit
      const newOtp = otpCode.substring(0, index) + '' + otpCode.substring(index + 1);
      setOtpCode(newOtp);
      return;
    }

    // If pasted multiple digits
    if (cleanVal.length > 1) {
      const pasted = cleanVal.slice(0, 6);
      setOtpCode(pasted);
      const focusTarget = Math.min(pasted.length, 5);
      inputRefs.current[focusTarget]?.focus();
      return;
    }

    // Single digit input
    const char = cleanVal.slice(-1);
    const newChars = digits.slice();
    newChars[index] = char;
    const newOtp = newChars.join('').slice(0, 6);
    setOtpCode(newOtp);

    // Auto advance focus to next input box
    if (index < 5 && char) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  // Handle backspace navigation between boxes
  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  // Handle paste anywhere
  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      setOtpCode(pastedData);
      const focusTarget = Math.min(pastedData.length, 5);
      inputRefs.current[focusTarget]?.focus();
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      notify.error('Please enter the complete 6-digit verification code.', 'Incomplete Code');
      return;
    }

    setLoading(true);

    try {
      const res = await verifyEmailCode(email.trim(), otpCode.trim());
      setVerificationToken(res.verificationToken);
      notify.success(
        'Email verified successfully! Complete your botanical profile details.',
        'Identity Confirmed'
      );
      setRegStep('details');
    } catch (err: any) {
      notify.error(
        err.message || 'Invalid or expired verification code.',
        'Verification Failed'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    if (resendCooldown > 0 || loading) return;
    setLoading(true);

    try {
      const res = await sendVerificationCode(email.trim());
      notify.success(
        res.message || 'A new 6-digit code was sent to your email.',
        'Code Dispatched'
      );
      setResendCooldown(60);
    } catch (err: any) {
      notify.error(
        err.message || 'Failed to resend code. Please try again.',
        'Resend Failed'
      );
    } finally {
      setLoading(false);
    }
  }

  const formatCooldown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col">
      {/* Title & Badge */}
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b2f1f] border border-[#4e7349]/40 text-[#a8c3a0] text-[11px] font-semibold uppercase tracking-wider mb-3">
          🌱 Verification Code
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f5f1e8] tracking-tight">
          Enter Verification Code
        </h2>
        <p className="text-xs sm:text-sm text-[#b2c7b5] mt-2 max-w-sm mx-auto leading-relaxed">
          Enter the 6-digit code sent to your email address.
        </p>
      </div>

      <form onSubmit={handleVerifyOtp} className="space-y-5">
        {/* Email Pill with inline change button */}
        <div className="rounded-xl bg-[#0f1b11] border border-[#3d5a3c]/60 px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="text-[#a8c3a0]">✉</span>
            <span className="font-mono text-[#f5f1e8] font-semibold truncate">{email}</span>
          </div>
          <button
            type="button"
            onClick={() => setRegStep('email')}
            className="text-xs text-[#a8c3a0] hover:text-[#f5f1e8] font-semibold flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Change</span>
            <span>✏</span>
          </button>
        </div>

        {/* 6 Segmented Digit Input Boxes */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <label className="text-xs font-semibold text-[#e3ebe0]">
              6-Digit Code
            </label>
            <span className="text-[11px] text-[#8ca090]">
              {otpCode.length}/6 digits
            </span>
          </div>

          <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
            {digits.map((digit, idx) => {
              const isFilled = Boolean(digit);
              return (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  autoFocus={idx === 0}
                  className={`w-full h-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-bold rounded-xl border transition-all focus:outline-none ${
                    isFilled
                      ? 'border-[#6c9966] bg-[#1e3422] text-[#f5f1e8] ring-2 ring-[#6c9966]/30 shadow-xs'
                      : 'border-[#3d5a3c] bg-[#0f1b11] text-[#f5f1e8] focus:border-[#6c9966] focus:bg-[#152718]'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Resend Code / Timer Row */}
        <div className="flex items-center justify-between text-xs text-[#b2c7b5] pt-1">
          <div className="flex items-center gap-1.5">
            <span>⏱</span>
            <span>
              {resendCooldown > 0 ? (
                <>Resend Code in <strong className="text-[#f5f1e8] font-mono">{formatCooldown(resendCooldown)}</strong></>
              ) : (
                'Code ready to resend'
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={handleResendOtp}
            disabled={loading || resendCooldown > 0}
            className="text-xs font-semibold text-[#a8c3a0] hover:text-[#f5f1e8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            ↻ Resend Code
          </button>
        </div>

        {/* CTA Verify Button */}
        <button
          type="submit"
          disabled={loading || otpCode.length !== 6}
          className="w-full rounded-full bg-[#4e7349] py-3 text-xs sm:text-sm font-semibold text-white hover:bg-[#3d5c38] hover:shadow-lg transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2 mt-2 shadow-md shadow-[#4e7349]/30"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Verifying Code...</span>
            </>
          ) : (
            <>
              <span>Verify & Continue</span>
              <span>→</span>
            </>
          )}
        </button>

        {/* Reassurance Footer */}
        <p className="text-center text-[11px] text-[#8ca090] pt-1">
          Code expires in 10 minutes. Check your spam folder if not received.
        </p>
      </form>
    </div>
  );
}
