import { create } from 'zustand';

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
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updatedData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

// Data awal dummy
const INITIAL_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'Kopi Arabika Gayo', 
    price: 75000, 
    image: 'https://via.placeholder.com/300', 
    description: 'Kopi nikmat asli dataran tinggi Gayo.', 
    category: 'Minuman' 
  },
  { 
    id: '2', 
    name: 'Keripik Pisang Coklat', 
    price: 15000, 
    image: 'https://via.placeholder.com/300', 
    description: 'Camilan renyah dengan lumeran coklat premium.', 
    category: 'Makanan' 
  },
  { 
    id: '3', 
    name: 'Sambal Roa Botol', 
    price: 35000, 
    image: 'https://via.placeholder.com/300', 
    description: 'Pedas nendang cocok untuk teman nasi.', 
    category: 'Bumbu' 
  },
];

export const useProductStore = create<ProductState>((set) => ({
  products: INITIAL_PRODUCTS,
  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
  updateProduct: (id, data) => set((state) => ({
    products: state.products.map((p) => (p.id === id ? { ...p, ...data } : p)),
  })),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter((p) => p.id !== id),
  })),
}));