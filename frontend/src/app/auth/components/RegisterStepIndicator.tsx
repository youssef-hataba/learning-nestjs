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
                    ? 'bg-[#4e7349] text-white font-bold shadow-sm'
                    : isDone
                    ? 'bg-[#eaf1e8] text-[#3c5a38] border border-[#A8C3A0]/60 font-semibold'
                    : 'bg-[#f4f7f3] text-[#8ca090] border border-[#A8C3A0]/30 font-medium'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                    isCurrent
                      ? 'bg-white text-[#4e7349]'
                      : isDone
                      ? 'bg-[#4e7349] text-white'
                      : 'bg-white/80 text-[#8ca090]'
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
                  className={`flex-1 h-[2px] mx-2 transition-colors ${
                    idx < currentIdx ? 'bg-[#4e7349]' : 'bg-[#A8C3A0]/30'
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
