import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react-native';
import { toast } from 'sonner-native';
import { useCartStore } from '../../store/cartStore';

export default function CartScreen() {
  const { items, removeFromCart, addToCart, totalPrice, clearCart } = useCartStore();

  // Fungsi Logika Checkout WhatsApp
  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Keranjang kosong!");
      return;
    }

    const phoneNumber = "6281234567890"; // Ganti dengan Nomor WA Penjual
    
    // Format Pesan Rapi
    let message = `Halo Admin, saya ingin memesan:\n\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} x${item.quantity} - Rp ${(item.price * item.quantity).toLocaleString()}\n`;
    });
    message += `\n*Total: Rp ${totalPrice().toLocaleString()}*`;
    message += `\n\nMohon diproses, Terima kasih.`;

    const url = `whatsapp://send?text=${encodeURIComponent(message)}&phone=${phoneNumber}`;

    Linking.openURL(url).catch(() => {
      toast.error("WhatsApp tidak terinstall di HP ini.");
    });
    
    // Opsional: Kosongkan keranjang setelah checkout
    // clearCart(); 
  };

  // Kurangi quantity (Logic lokal untuk UI minus)
  const decreaseQuantity = (id: string) => {
    // Logika pengurangan bisa ditambahkan di store jika ingin lebih kompleks
    // Di sini kita pakai remove jika sisa 1, atau kurangi logic manual (PR untuk state management)
    removeFromCart(id); 
    toast.info("Item dihapus (Implementasi minus qty perlu update store)");
  };

  return (
    // Gunakan SafeAreaView agar Header Keranjang tidak tertutup Notch/Poni HP
    <SafeAreaView className="flex-1 bg-white pt-8"> 
      <View className="p-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-primary">Keranjang Belanja</Text>
      </View>

      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8">
          <ShoppingBag size={64} color="#CBD5E1" />
          <Text className="text-gray-400 mt-4 text-center">Keranjang Anda masih kosong.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }} // Padding bawah besar agar tidak tertutup tombol checkout
            renderItem={({ item }) => (
              <View className="flex-row bg-white p-3 mb-3 rounded-xl border border-gray-100 shadow-sm items-center">
                <Image source={{ uri: item.image }} className="w-16 h-16 rounded-lg bg-gray-200" />
                
                <View className="flex-1 ml-3">
                  <Text className="font-semibold text-gray-800">{item.name}</Text>
                  <Text className="text-accent font-bold">Rp {item.price.toLocaleString()}</Text>
                </View>

                <View className="flex-row items-center gap-3">
                  <View className="flex-row items-center bg-gray-50 rounded-lg">
                    {/* Logika plus minus sederhana */}
                    <TouchableOpacity onPress={() => addToCart(item)} className="p-2">
                      <Plus size={16} color="#0F172A" />
                    </TouchableOpacity>
                    <Text className="font-bold w-4 text-center">{item.quantity}</Text>
                    <TouchableOpacity onPress={() => removeFromCart(item.id)} className="p-2">
                       {/* Sebaiknya buat fungsi decrease di store, saat ini remove */}
                      <Minus size={16} color="#0F172A" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />

          {/* Footer Checkout Melayang */}
          <View className="absolute bottom-0 w-full bg-white p-4 border-t border-gray-100 pb-8 shadow-2xl">
            <View className="flex-row justify-between mb-4">
              <Text className="text-gray-500 font-medium">Total Pembayaran</Text>
              <Text className="text-xl font-bold text-primary">Rp {totalPrice().toLocaleString()}</Text>
            </View>
            
            <TouchableOpacity 
              className="bg-green-600 py-4 rounded-xl items-center flex-row justify-center gap-2 active:bg-green-700"
              onPress={handleCheckout}
            >
              <Text className="text-white font-bold text-lg">Pesan via WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}