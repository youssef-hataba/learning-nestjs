'use client';

import { create } from 'zustand';

export type AuthTab = 'login' | 'register';
export type RegisterStep = 'email' | 'otp' | 'details';

export interface AuthMessage {
  text: string;
  type: 'success' | 'error' | 'info';
}

interface AuthState {
  activeTab: AuthTab;
  regStep: RegisterStep;

  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  otpCode: string;
  verificationToken: string;

  resendCooldown: number;
  loading: boolean;
  message: AuthMessage | null;

  setActiveTab: (tab: AuthTab) => void;
  setRegStep: (step: RegisterStep) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setUsername: (username: string) => void;
  setOtpCode: (otpCode: string) => void;
  setVerificationToken: (token: string) => void;
  setResendCooldown: (seconds: number) => void;
  decrementCooldown: () => void;
  setLoading: (loading: boolean) => void;
  setMessage: (message: AuthMessage | null) => void;
  resetRegistration: () => void;
  resetForm: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  activeTab: 'login',
  regStep: 'email',

  email: '',
  password: '',
  confirmPassword: '',
  username: '',
  otpCode: '',
  verificationToken: '',

  resendCooldown: 0,
  loading: false,
  message: null,

  setActiveTab: (tab) => set({ activeTab: tab, message: null }),
  setRegStep: (step) => set({ regStep: step }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  setUsername: (username) => set({ username }),
  setOtpCode: (otpCode) => set({ otpCode }),
  setVerificationToken: (token) => set({ verificationToken: token }),
  setResendCooldown: (seconds) => set({ resendCooldown: seconds }),
  decrementCooldown: () =>
    set((state) => ({
      resendCooldown: state.resendCooldown > 0 ? state.resendCooldown - 1 : 0,
    })),
  setLoading: (loading) => set({ loading }),
  setMessage: (message) => set({ message }),

  resetRegistration: () =>
    set({
      regStep: 'email',
      otpCode: '',
      verificationToken: '',
      password: '',
      confirmPassword: '',
      username: '',
      resendCooldown: 0,
    }),

  resetForm: () =>
    set({
      email: '',
      password: '',
      confirmPassword: '',
      username: '',
      otpCode: '',
      verificationToken: '',
      regStep: 'email',
      resendCooldown: 0,
      loading: false,
      message: null,
    }),
}));
