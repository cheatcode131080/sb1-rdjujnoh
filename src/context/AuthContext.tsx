import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserWithoutPassword, AuthContextType } from '../types/auth';
import { hashPassword, verifyPassword } from '../lib/auth';
import { generateId } from '../lib/utils';

const AuthContext = createContext<AuthContextType | null>(null);

// In a real app, this would be in a database
let users: User[] = [
  {
    id: '1',
    username: 'admin',
    password: await hashPassword('admin123'),
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    const user = users.find((u) => u.username === username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    setUser(user);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Admin-only functions
export function useAdminAuth() {
  const { user } = useAuth();
  
  const addUser = useCallback(async (username: string, password: string, role: User['role']) => {
    if (user?.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    if (users.some((u) => u.username === username)) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await hashPassword(password);
    const newUser: User = {
      id: generateId(),
      username,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString(),
    };

    users = [...users, newUser];
    return newUser;
  }, [user]);

  const updateUser = useCallback(async (
    id: string,
    updates: { username?: string; password?: string; role?: User['role'] }
  ) => {
    if (user?.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    if (updates.username && users.some((u) => u.username === updates.username && u.id !== id)) {
      throw new Error('Username already exists');
    }

    users = await Promise.all(users.map(async (u) => {
      if (u.id === id) {
        const updatedUser = { ...u };
        if (updates.username) updatedUser.username = updates.username;
        if (updates.password) updatedUser.password = await hashPassword(updates.password);
        if (updates.role) updatedUser.role = updates.role;
        return updatedUser;
      }
      return u;
    }));

    return users.find((u) => u.id === id)!;
  }, [user]);

  const getUsers = useCallback((): UserWithoutPassword[] => {
    if (user?.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    return users.map(({ password, ...rest }) => rest);
  }, [user]);

  const deleteUser = useCallback((id: string) => {
    if (user?.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    if (id === '1') {
      throw new Error('Cannot delete main admin account');
    }
    users = users.filter((u) => u.id !== id);
  }, [user]);

  return { addUser, updateUser, getUsers, deleteUser };
}