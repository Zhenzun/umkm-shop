import React from 'react';
import { Tabs } from 'expo-router';
import { House, ShoppingCart, User } from 'lucide-react-native';
import { View, Text, Platform } from 'react-native';
import { useCartStore } from '../../store/cartStore';

export default function TabLayout() {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === 'android' ? 70 : 90,
          paddingBottom: Platform.OS === 'android' ? 12 : 30,
          paddingTop: 12,
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',
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
      
      {/* UPDATE: Tab Profil diaktifkan */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Akun Saya',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}