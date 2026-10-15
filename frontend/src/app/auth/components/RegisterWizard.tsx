'use client';

import { useAuthStore } from '../store';
import RegisterEmailStep from './RegisterEmailStep';
import RegisterOtpStep from './RegisterOtpStep';
import RegisterDetailsStep from './RegisterDetailsStep';
import { User } from '../types';

interface RegisterWizardProps {
  onSuccess: (user: User) => void;
}

export default function RegisterWizard({ onSuccess }: RegisterWizardProps) {
  const { regStep } = useAuthStore();

  return (
    <div>
      {regStep === 'email' && <RegisterEmailStep />}
      {regStep === 'otp' && <RegisterOtpStep />}
      {regStep === 'details' && <RegisterDetailsStep onSuccess={onSuccess} />}
    </div>
  );
}
