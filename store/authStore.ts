import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'sonner-native';
import { ENDPOINTS } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';

type UserRole = 'admin' | 'user';

interface UserData {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
}

interface AuthState {
  user: UserData | null;
  role: UserRole | 'guest'; // Helper untuk UI
  isAuthenticated: boolean;
  login: (phone: string, pass: string) => Promise<void>;
  register: (name: string, phone: string, pass: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: 'guest',
      isAuthenticated: false,

      login: async (phone, password) => {
        try {
          const res = await axios.post(ENDPOINTS.login, { phone, password });
          const userData = res.data;
          
          set({ 
            user: userData, 
            role: userData.role, 
            isAuthenticated: true 
          });
          toast.success(`Selamat datang, ${userData.name}!`);
        } catch (error: any) {
          console.error(error);
          const msg = error.response?.data?.error || "Gagal login";
          toast.error(msg);
          throw error; // Lempar error agar UI tahu
        }
      },

      register: async (name, phone, password) => {
        try {
          const res = await axios.post(ENDPOINTS.register, { name, phone, password });
          const userData = res.data;
          
          set({ 
            user: userData, 
            role: userData.role, 
            isAuthenticated: true 
          });
          toast.success("Akun berhasil dibuat!");
        } catch (error: any) {
          const msg = error.response?.data?.error || "Gagal daftar";
          toast.error(msg);
          throw error;
        }
      },

      logout: () => {
        set({ user: null, role: 'guest', isAuthenticated: false });
        toast.info("Anda telah keluar.");
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);