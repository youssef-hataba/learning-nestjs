'use client';

import { useAuthStore } from '../store';
import { sendVerificationCode } from '../api';

export default function RegisterEmailStep() {
  const {
    email,
    loading,
    setEmail,
    setLoading,
    setMessage,
    setRegStep,
    setResendCooldown,
  } = useAuthStore();

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setMessage({ text: 'Please enter a valid email address.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await sendVerificationCode(email.trim());
      setMessage({
        text: res.message || 'Verification code sent to your email! Please check your inbox.',
        type: 'success',
      });
      setRegStep('otp');
      setResendCooldown(60);
    } catch (err: any) {
      setMessage({
        text: err.message || 'Failed to send verification code. Email might already exist.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSendOtp} className="space-y-4">
      <div>
        <label className="block text-[11px] font-medium text-[#c4bcae] mb-1.5">
          Your Email Address
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          className="w-full rounded-lg border border-[#21252b] bg-[#0d0f11] px-3.5 py-2 text-xs text-[#f5f0e6] placeholder-[#575249] focus:border-[#d8d0c2] focus:outline-none transition-colors"
        />
        <p className="text-[10px] text-[#736c62] mt-1.5">
          We will send a 6-digit verification code to confirm your email address.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#f5f0e6] py-2.5 text-xs font-semibold text-[#0d0f11] hover:bg-[#e4dbce] transition-all disabled:opacity-50 cursor-pointer shadow-sm mt-3"
      >
        {loading ? 'Sending Code...' : 'Send Verification Code'}
      </button>
    </form>
  );
}
