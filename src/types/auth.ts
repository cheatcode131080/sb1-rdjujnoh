export type Role = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  password: string;
  role: Role;
  createdAt: string;
}

export interface UserWithoutPassword {
  id: string;
  username: string;
  role: Role;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}