import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Star, MessageCircle } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Ganti import component jadi hook
import { toast } from 'sonner-native';

import HomeHeader from '../../components/HomeHeader';
import { useProductStore } from '../../store/productStore';
import { useCartStore } from '../../store/cartStore';

const CATEGORIES = ["Semua", "Makanan", "Minuman", "Kerajinan", "Pakaian"];

export default function ModernHomeScreen() {
  const router = useRouter();
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);
  
  const addToCart = useCartStore((state) => state.addToCart);
  
  // Hook untuk menghitung jarak aman (Notch/Poni HP)
  const insets = useSafeAreaInsets();

  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const filteredProducts = products.filter(p => 
    selectedCategory === "Semua" || p.category === selectedCategory
  );

  return (
    // GANTI SafeAreaView dengan View biasa + style paddingTop
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <StatusBar style="dark" />
      <HomeHeader />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 100 }}
        columnWrapperStyle={{ paddingHorizontal: 12 }}
        showsVerticalScrollIndicator={false}
        
        ListHeaderComponent={() => (
          <View className="mb-4">
            {/* 1. Banner Promo */}
            <View className="px-4 mt-4">
              <View className="bg-primary rounded-2xl p-6 relative overflow-hidden h-40 justify-center shadow-lg shadow-blue-200">
                <View className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
                <View className="absolute -right-4 -bottom-10 w-32 h-32 bg-white/10 rounded-full" />
                
                <Text className="text-white font-bold text-xl mb-1">Promo Spesial!</Text>
                <Text className="text-blue-100 text-sm mb-3">Diskon 20% untuk pelanggan baru</Text>
                <TouchableOpacity className="bg-white self-start px-4 py-2 rounded-lg">
                  <Text className="text-primary font-bold text-xs">Cek Sekarang</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 2. Kategori Chips */}
            <View className="mt-6 mb-2">
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
              >
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-full border ${
                      selectedCategory === cat 
                        ? 'bg-primary border-primary' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <Text className={`font-medium ${selectedCategory === cat ? 'text-white' : 'text-gray-600'}`}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* 3. Judul Section */}
            <View className="px-5 mt-2 flex-row justify-between items-center">
              <Text className="text-lg font-bold text-dark">Produk Terlaris</Text>
              <TouchableOpacity>
                <Text className="text-primary text-xs font-bold">Lihat Semua</Text>
              </TouchableOpacity>
            </View>
            {role === 'admin' && (
              <View className="absolute bottom-6 right-6 items-end gap-3">
                {/* Tombol Lihat Pesanan */}
                <TouchableOpacity 
                  className="bg-green-600 w-12 h-12 rounded-full items-center justify-center shadow-lg"
                  onPress={() => router.push('/admin/orders')}
                >
                  <View>
                      {/* Gunakan Icon Clipboard/List */}
                      <Text className="text-white font-bold text-xs">ORD</Text> 
                  </View>
                </TouchableOpacity>

                {/* Tombol Tambah Produk (Existing) */}
                <TouchableOpacity 
                  className="bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg"
                  onPress={() => router.push('/admin/manage-product')}
                >
                  <Plus color="white" size={24} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        renderItem={({ item }) => (
          <TouchableOpacity 
            className="flex-1 bg-white m-2 rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            onPress={() => router.push(`/product/${item.id}`)}
          >
            <View className="bg-gray-50 relative">
              <Image 
                source={{ uri: item.image }} 
                className="w-full h-40 bg-gray-200" 
                resizeMode="cover" 
              />
              <View className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-md flex-row items-center gap-1 shadow-sm">
                <Star size={10} color="#F59E0B" fill="#F59E0B"/>
                <Text className="text-[10px] font-bold text-gray-700">4.8</Text>
              </View>
            </View>

            <View className="p-3">
              <Text className="text-gray-500 text-[10px] font-bold mb-1 uppercase tracking-wider">{item.category}</Text>
              <Text className="text-dark font-bold text-sm mb-1" numberOfLines={1}>{item.name}</Text>
              
              <View className="flex-row justify-between items-center mt-2">
                <Text className="text-primary font-bold text-base">Rp {item.price.toLocaleString()}</Text>
                
                <TouchableOpacity 
                  onPress={() => { addToCart(item); toast.success("Masuk Keranjang"); }}
                  className="bg-primary h-8 w-8 rounded-full items-center justify-center active:bg-blue-700"
                >
                  <Plus size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Floating WhatsApp Button */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-[#25D366] w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-green-200 z-50"
        onPress={() => Linking.openURL('whatsapp://send?phone=628123456789')}
      >
        <MessageCircle size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}