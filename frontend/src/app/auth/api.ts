import { apiFetch } from '@/lib/api';
import {
  LoginDto,
  RegisterDto,
  AuthResponse,
  User,
  SendVerificationCodeResponse,
  VerifyCodeResponse,
} from './types';

export async function loginUser(dto: LoginDto): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>('/users/auth/login', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
  if (data?.token && typeof window !== 'undefined') {
    localStorage.setItem('token', data.token);
  }
  return data;
}

export async function registerUser(dto: RegisterDto): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>('/users/auth/register', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
  if (data?.token && typeof window !== 'undefined') {
    localStorage.setItem('token', data.token);
  }
  return data;
}

export async function sendVerificationCode(email: string): Promise<SendVerificationCodeResponse> {
  return await apiFetch<SendVerificationCodeResponse>('/users/auth/send-verification-code', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function verifyEmailCode(email: string, code: string): Promise<VerifyCodeResponse> {
  return await apiFetch<VerifyCodeResponse>('/users/auth/verify-code', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
}

export async function getMe(): Promise<User> {
  return await apiFetch<User>('/users/auth/me');
}

export function logoutUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
}
