'use client';

import { useAuthStore } from '../store';

export default function RegisterStepIndicator() {
  const { regStep } = useAuthStore();

  return (
    <div className="flex items-center justify-between mb-6 px-1">
      <div className="flex items-center gap-2">
        <span
          className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center transition-colors ${
            regStep === 'email'
              ? 'bg-[#f5f0e6] text-[#0d0f11]'
              : 'bg-[#21262d] text-emerald-400 border border-emerald-500/40'
          }`}
        >
          {regStep !== 'email' ? '✓' : '1'}
        </span>
        <span
          className={`text-[11px] ${
            regStep === 'email' ? 'text-[#f5f0e6] font-medium' : 'text-[#736c62]'
          }`}
        >
          Email
        </span>
      </div>

      <div
        className={`h-[1px] flex-1 mx-3 transition-colors ${
          regStep === 'details' || regStep === 'otp' ? 'bg-[#323942]' : 'bg-[#21252b]'
        }`}
      />

      <div className="flex items-center gap-2">
        <span
          className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center transition-colors ${
            regStep === 'otp'
              ? 'bg-[#f5f0e6] text-[#0d0f11]'
              : regStep === 'details'
              ? 'bg-[#21262d] text-emerald-400 border border-emerald-500/40'
              : 'bg-[#181b1f] text-[#554f46]'
          }`}
        >
          {regStep === 'details' ? '✓' : '2'}
        </span>
        <span
          className={`text-[11px] ${
            regStep === 'otp' ? 'text-[#f5f0e6] font-medium' : 'text-[#736c62]'
          }`}
        >
          Verify OTP
        </span>
      </div>

      <div
        className={`h-[1px] flex-1 mx-3 transition-colors ${
          regStep === 'details' ? 'bg-[#323942]' : 'bg-[#21252b]'
        }`}
      />

      <div className="flex items-center gap-2">
        <span
          className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center transition-colors ${
            regStep === 'details'
              ? 'bg-[#f5f0e6] text-[#0d0f11]'
              : 'bg-[#181b1f] text-[#554f46]'
          }`}
        >
          3
        </span>
        <span
          className={`text-[11px] ${
            regStep === 'details' ? 'text-[#f5f0e6] font-medium' : 'text-[#736c62]'
          }`}
        >
          Details
        </span>
      </div>
    </div>
  );
}
