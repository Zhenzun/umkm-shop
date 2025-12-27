import { create } from 'zustand';

type UserRole = 'admin' | 'user' | 'guest';

interface AuthState {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: 'user', // Default role (bisa diubah nanti lewat login)
  setRole: (role) => set({ role }),
}));