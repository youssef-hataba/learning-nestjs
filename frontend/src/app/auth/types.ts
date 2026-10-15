export interface User {
  id: string;
  username: string;
  email: string;
  userType?: string;
  isAccountVerified: boolean;
  profileImage?: string | null;
  createdAt?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  verificationToken: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  message?: string;
  token: string;
  user: User;
}

export interface SendVerificationCodeResponse {
  message: string;
}

export interface VerifyCodeResponse {
  message: string;
  verificationToken: string;
}
