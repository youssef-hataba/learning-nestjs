export interface User {
  id: string;
  username: string;
  email: string;
  isAccountVerified: boolean;
  profileImage?: string | null;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
