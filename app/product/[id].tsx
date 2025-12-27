import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react-native';
import { toast } from 'sonner-native';
import { StatusBar } from 'expo-status-bar';

import { useProductStore } from '../../store/productStore';
import { useCartStore } from '../../store/cartStore';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // Cari produk berdasarkan ID dari URL
  const product = useProductStore((state) => state.products.find((p) => p.id === id));
  const addToCart = useCartStore((state) => state.addToCart);

  // Jika produk tidak ditemukan (misal dihapus admin saat user melihat)
  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Produk tidak ditemukan.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
            <Text className="text-blue-500">Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBuy = () => {
    addToCart(product);
    toast.success("Berhasil masuk keranjang!");
    router.back(); // Opsional: Langsung tutup modal atau tetap di sini
  };

  return (
    <View className="flex-1 bg-white">
      {/* Karena ini Modal, kita bisa pakai StatusBar light jika gambar gelap, atau default */}
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Gambar Besar Full Width */}
        <Image 
            source={{ uri: product.image }} 
            className="w-full h-80 bg-gray-200"
            resizeMode="cover"
        />

        <View className="p-5 -mt-6 bg-white rounded-t-3xl shadow-lg h-full">
            {/* Garis Indikator Modal (Visual Cue) */}
            <View className="w-16 h-1 bg-gray-300 rounded-full self-center mb-6" />

            <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1 pr-4">
                    <Text className="text-2xl font-bold text-slate-800 mb-1">{product.name}</Text>
                    <Text className="text-gray-500 font-medium">{product.category}</Text>
                </View>
                <Text className="text-2xl font-bold text-accent">
                    Rp {product.price.toLocaleString()}
                </Text>
            </View>

            <View className="h-[1px] bg-gray-100 my-4" />

            <Text className="text-lg font-bold text-slate-800 mb-2">Deskripsi</Text>
            <Text className="text-gray-600 leading-6 text-base">
                {product.description || "Tidak ada deskripsi untuk produk ini. Hubungi penjual untuk detail lebih lanjut."}
            </Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View className="absolute bottom-0 w-full bg-white border-t border-gray-200 flex-row pb-6 pt-2 px-2 items-center">
        
        {/* Tombol Chat & Keranjang (Kecil) */}
        <View className="flex-row w-[35%] justify-around pr-2 border-r border-gray-200">
           <TouchableOpacity className="items-center justify-center">
              <MessageCircle size={20} color="#666" />
              <Text className="text-[10px] text-gray-500 mt-1">Chat</Text>
           </TouchableOpacity>
           <View className="h-8 w-[1px] bg-gray-200" />
           <TouchableOpacity className="items-center justify-center border-l-gray-200">
              <ShoppingCart size={20} color="#666" />
              <Text className="text-[10px] text-gray-500 mt-1">Toko</Text>
           </TouchableOpacity>
        </View>

        {/* Tombol Aksi (Besar) */}
        <View className="flex-1 flex-row gap-1 ml-2">
            <TouchableOpacity 
                className="flex-1 bg-primary/20 border border-primary py-2.5 rounded-md items-center justify-center"
                onPress={() => { addToCart(product); toast.success("Masuk Keranjang"); }}
            >
                <Text className="text-primary font-bold text-xs">Keranjang</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                className="flex-1 bg-primary py-2.5 rounded-md items-center justify-center shadow-sm"
                onPress={() => { addToCart(product); router.push('/(tabs)/cart'); }}
            >
                <Text className="text-white font-bold text-xs">Beli Sekarang</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}