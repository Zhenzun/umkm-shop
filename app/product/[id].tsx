import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react-native';
import { toast } from 'sonner-native';
import { StatusBar } from 'expo-status-bar';

import { useProductStore } from '../../store/productStore';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore'; // Import Auth

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // Ambil produk dari store
  const { products, deleteProduct } = useProductStore();
  const product = products.find((p) => p.id === id);
  
  const addToCart = useCartStore((state) => state.addToCart);
  const { role } = useAuthStore(); // Cek Role

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500 mb-4">Produk tidak ditemukan atau dihapus.</Text>
        <TouchableOpacity onPress={() => router.back()} className="bg-blue-100 px-4 py-2 rounded-lg">
            <Text className="text-blue-600 font-bold">Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBuy = () => {
    addToCart(product);
    toast.success("Masuk keranjang!");
    router.back();
  };

  const handleDelete = () => {
    deleteProduct(product.id);
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Gambar Full */}
        <Image 
            source={{ uri: product.image }} 
            className="w-full h-80 bg-gray-100"
            resizeMode="cover"
        />

        {/* Content Sheet */}
        <View className="px-5 pt-6 bg-white -mt-6 rounded-t-3xl h-full shadow-md">
            <View className="w-12 h-1 bg-gray-200 rounded-full self-center mb-6" />

            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 pr-4">
                    <Text className="text-xs font-bold text-blue-600 mb-1 uppercase">{product.category}</Text>
                    <Text className="text-2xl font-bold text-gray-800">{product.name}</Text>
                </View>
                <Text className="text-xl font-bold text-green-600">
                    Rp {product.price.toLocaleString()}
                </Text>
            </View>

            <View className="h-[1px] bg-gray-100 my-4" />

            <Text className="text-lg font-bold text-gray-800 mb-2">Deskripsi</Text>
            <Text className="text-gray-600 leading-6">
                {product.description || "Tidak ada deskripsi tambahan."}
            </Text>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 w-full bg-white p-4 border-t border-gray-100 flex-row gap-3 pb-8">
        
        {role === 'admin' ? (
           // TAMPILAN ADMIN: Tombol Hapus & Edit
           <>
             <TouchableOpacity 
                className="bg-red-50 border border-red-200 flex-1 py-4 rounded-xl items-center flex-row justify-center gap-2"
                onPress={handleDelete}
             >
                <Trash2 color="#DC2626" size={20} />
                <Text className="text-red-700 font-bold">Hapus Produk</Text>
             </TouchableOpacity>
             
             <TouchableOpacity 
                className="bg-blue-600 flex-1 py-4 rounded-xl items-center justify-center"
                onPress={() => router.push({ pathname: '/admin/manage-product', params: { id: product.id } })}
             >
                <Text className="text-white font-bold">Edit Produk</Text>
             </TouchableOpacity>
           </>
        ) : (
           // TAMPILAN USER: Tombol Beli
           <TouchableOpacity 
                className="bg-blue-600 flex-1 py-4 rounded-xl items-center flex-row justify-center gap-2 shadow-lg shadow-blue-200"
                onPress={handleBuy}
            >
                <ShoppingBag color="white" size={20} />
                <Text className="text-white font-bold text-lg">Tambah ke Keranjang</Text>
            </TouchableOpacity>
        )}
      </View>
    </View>
  );
}