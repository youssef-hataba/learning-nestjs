'use client';

import { useAuthStore } from '../store';
import { sendVerificationCode } from '../api';
import { notify } from '@/lib/notifications';

export default function RegisterEmailStep() {
  const {
    email,
    loading,
    setEmail,
    setLoading,
    setRegStep,
    setResendCooldown,
    setActiveTab,
  } = useAuthStore();

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      notify.error('Please enter a valid email address.', 'Input Required');
      return;
    }

    setLoading(true);

    try {
      const res = await sendVerificationCode(email.trim());
      notify.success(
        res.message || 'Verification code sent to your email! Please check your inbox.',
        'Code Dispatched'
      );
      setRegStep('otp');
      setResendCooldown(60);
    } catch (err: any) {
      notify.error(
        err.message || 'Failed to send verification code. Email might already exist.',
        'Delivery Failed'
      );
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleAuth() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    window.location.href = `${backendUrl}/users/auth/google`;
  }

  const isValidEmail = email.includes('@') && email.includes('.');

  return (
    <div className="relative z-10 flex flex-col">
      {/* Header Content */}
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaf1e8] text-[#3c5a38] mb-3 shadow-xs border border-[#A8C3A0]/40">
          <span className="text-sm">🌱</span>
          <span className="text-[11px] font-semibold tracking-wider uppercase">
            Sanctuary Access Onboarding
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#203123] tracking-tight mb-2">
          Cultivate Your Sanctuary
        </h1>

        <p className="text-xs sm:text-sm text-[#5e7362] max-w-sm mx-auto mb-5 leading-relaxed">
          Enter your primary email to receive an instant botanical access code before profile creation.
        </p>
      </div>

      {/* Google Authentication Button */}
      <div className="w-full mb-4">
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="w-full py-2.5 px-4 rounded-full border border-[#A8C3A0]/40 bg-white hover:bg-[#f4f7f3] text-[#203123] text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-3 shadow-xs hover:shadow-md cursor-pointer"
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
          <div className="border-t border-[#A8C3A0]/30 w-full" />
          <span className="bg-white px-3 text-[11px] text-[#5e7362] absolute uppercase tracking-wider font-medium">
            or continue with botanical email
          </span>
        </div>
      </div>

      {/* Email Form */}
      <form onSubmit={handleSendOtp} className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#203123] flex items-center gap-1">
              <span>Botanical Email Address</span>
              <span className="text-[#4e7349] text-xs">*</span>
            </label>
            <span className="text-[11px] text-[#5e7362] flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isValidEmail ? 'bg-[#4e7349]' : 'bg-[#8ca090]/40'
                }`}
              />
              {isValidEmail ? 'Valid format' : 'Awaiting input'}
            </span>
          </div>

          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8ca090] group-focus-within:text-[#4e7349] transition-colors text-sm">
              @
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="curator@sanctuary.com"
              className="w-full pl-9 pr-10 py-2.5 bg-[#f8faf7] text-[#203123] placeholder-[#8ca090] text-xs sm:text-sm rounded-xl border border-[#A8C3A0]/40 outline-none transition-all duration-300 focus:bg-white focus:border-[#4e7349] focus:ring-2 focus:ring-[#4e7349]/20"
            />
            {isValidEmail && (
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#4e7349] text-sm font-bold">
                ✓
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading || !isValidEmail}
          className="w-full mt-2 py-3 px-6 bg-[#4e7349] text-white text-xs sm:text-sm font-semibold rounded-full shadow-md shadow-[#4e7349]/20 hover:bg-[#3d5c38] hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Sending Verification Code...</span>
            </>
          ) : (
            <>
              <span>Send Verification Code</span>
              <span className="text-base leading-none">→</span>
            </>
          )}
        </button>

        {/* Technical Preview Info Pill from Stitch Design */}
        <div className="w-full bg-[#f2f6f1] border border-[#A8C3A0]/30 rounded-xl p-2.5 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-xs text-[#5e7362] mt-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4e7349] animate-pulse" />
            <span className="text-[11px]">Instant delivery &amp; encrypted token</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#5e7362]/70">
            <span>⏱</span>
            <span>10-minute token window</span>
          </div>
        </div>
      </form>

      {/* Card Footer from Stitch Design */}
      <div className="relative z-10 mt-5 pt-3 text-center bg-[#f2f6f1]/80 rounded-xl p-2.5 border border-[#A8C3A0]/30">
        <p className="text-xs text-[#5e7362]">
          Already have a curated collection?{' '}
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className="text-[#4e7349] hover:underline font-semibold ml-1 inline-flex items-center gap-0.5 cursor-pointer"
          >
            <span>Sign in here</span>
            <span className="text-xs leading-none">↗</span>
          </button>
        </p>
      </div>
    </div>
  );
}
