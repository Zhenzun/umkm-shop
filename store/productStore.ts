import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'sonner-native';
import { ENDPOINTS } from '../constants/api'; // Pastikan file ini ada & IP benar

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,

  // 1. AMBIL DATA DARI SERVER
  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(ENDPOINTS.products);
      set({ products: response.data });
    } catch (error) {
      console.error("Fetch Error:", error);
      // Jangan spam toast error saat awal load, cukup log saja
    } finally {
      set({ isLoading: false });
    }
  },

  // 2. TAMBAH PRODUK KE DATABASE
  addProduct: async (newProductData) => {
    try {
      const response = await axios.post(ENDPOINTS.products, newProductData);
      // Update state lokal langsung agar terasa cepat
      set((state) => ({ products: [...state.products, response.data] }));
      toast.success("Produk tersimpan!");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan produk. Cek koneksi server.");
      throw error; // Lempar error agar komponen tahu
    }
  },

  // 3. UPDATE PRODUK
  updateProduct: async (id, updatedData) => {
    try {
      const response = await axios.put(`${ENDPOINTS.products}/${id}`, updatedData);
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? response.data : p)),
      }));
      toast.success("Produk diupdate!");
    } catch (error) {
      console.error(error);
      toast.error("Gagal update produk.");
    }
  },

  // 4. HAPUS PRODUK
  deleteProduct: async (id) => {
    try {
      await axios.delete(`${ENDPOINTS.products}/${id}`);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
      toast.success("Produk dihapus.");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus produk.");
    }
  },
}));