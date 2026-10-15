'use client';

import { useAuthStore } from '../store';

export default function RegisterStepIndicator() {
  const { regStep } = useAuthStore();

  const steps = [
    { id: 'email', num: 1, label: 'Verify Email', desc: 'Email Verification' },
    { id: 'otp', num: 2, label: '6-Digit Code', desc: 'OTP Verification' },
    { id: 'details', num: 3, label: 'Complete Profile', desc: 'Profile Credentials' },
  ];

  const currentIdx = steps.findIndex((s) => s.id === regStep);

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between gap-2">
        {steps.map((step, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div key={step.id} className="flex-1 flex items-center">
              {/* Step Pill / Capsule */}
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-xs ${
                  isCurrent
                    ? 'bg-[#b6f076] text-[#121812] font-bold shadow-[0_0_16px_rgba(182,240,118,0.35)]'
                    : isDone
                    ? 'bg-[#252c24] text-[#b6f076] border border-[#b6f076]/40 font-semibold'
                    : 'bg-[#1a211a] text-[#c2c9b5]/40 border border-white/5 font-medium'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center ${
                    isCurrent
                      ? 'bg-[#121812] text-[#b6f076]'
                      : isDone
                      ? 'bg-[#b6f076] text-[#121812]'
                      : 'bg-white/5 text-[#c2c9b5]/40'
                  }`}
                >
                  {isDone ? '✓' : step.num}
                </span>
                <span className="hidden sm:inline whitespace-nowrap text-[11px]">
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-[1px] mx-2 transition-colors ${
                    idx < currentIdx ? 'bg-[#b6f076]/60' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
