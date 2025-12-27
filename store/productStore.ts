import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'sonner-native';
import { ENDPOINTS } from '../constants/api';

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

  // 1. Ambil Data dari MongoDB
  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(ENDPOINTS.products);
      set({ products: response.data });
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil data produk");
    } finally {
      set({ isLoading: false });
    }
  },

  // 2. Tambah Data ke MongoDB
  addProduct: async (newProductData) => {
    try {
      const response = await axios.post(ENDPOINTS.products, newProductData);
      // Update state lokal agar tidak perlu refresh
      set((state) => ({ products: [...state.products, response.data] }));
      toast.success("Produk tersimpan di Database!");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan produk");
    }
  },

  // 3. Update Data
  updateProduct: async (id, updatedData) => {
    try {
      const response = await axios.put(`${ENDPOINTS.products}/${id}`, updatedData);
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? response.data : p)),
      }));
      toast.success("Update berhasil!");
    } catch (error) {
      console.error(error);
      toast.error("Gagal update produk");
    }
  },

  // 4. Hapus Data
  deleteProduct: async (id) => {
    try {
      await axios.delete(`${ENDPOINTS.products}/${id}`);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
      toast.success("Produk dihapus permanen.");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus produk");
    }
  },
}));