import React from 'react';
import { Tabs } from 'expo-router';
import { House, ShoppingCart, User } from 'lucide-react-native';
import { View, Text, Platform } from 'react-native';
import { useCartStore } from '../../store/cartStore';

export default function TabLayout() {
  // Mengambil jumlah item untuk badge notifikasi keranjang
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0, // Hilangkan garis border
          elevation: 0, // Hilangkan shadow default Android
          shadowOpacity: 0, // Hilangkan shadow iOS
          height: Platform.OS === 'android' ? 70 : 90,
          paddingBottom: Platform.OS === 'android' ? 12 : 30,
          paddingTop: 12,
        },
        tabBarActiveTintColor: '#2563EB', // Biru Primary
        tabBarInactiveTintColor: '#94A3B8', // Abu-abu
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color }) => <House size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Keranjang',
          tabBarIcon: ({ color }) => (
            <View className="relative">
              <ShoppingCart size={24} color={color} />
              
              {itemCount > 0 && (
                // PERBAIKAN DI SINI:
                // Langsung Text di dalam View Badge, jangan di-nesting lagi.
                <View className="absolute -top-2 -right-2 bg-red-500 min-w-[18px] h-[18px] rounded-full items-center justify-center border border-white z-10">
                  <Text className="text-white text-[10px] font-bold leading-3">
                    {itemCount > 99 ? '99+' : itemCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      
      {/* Tambahkan Screen Profile jika ada, atau biarkan null tapi jangan dihapus jika file belum ada */}
      {/* <Tabs.Screen name="profile" ... /> */}
    </Tabs>
  );
}