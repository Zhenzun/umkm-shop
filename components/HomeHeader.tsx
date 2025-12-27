import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Bell, Search } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View 
      style={{ paddingTop: insets.top + 10 }} 
      className="bg-white px-5 pb-4 flex-row justify-between items-center shadow-sm border-b border-gray-100"
    >
      <View>
        <Text className="text-gray-500 text-xs font-medium">Selamat Datang 👋</Text>
        <Text className="text-dark text-xl font-bold mt-1">UMKM Berkah Jaya</Text>
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity className="bg-gray-50 p-2.5 rounded-full border border-gray-100">
          <Search size={20} color="#334155" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-50 p-2.5 rounded-full border border-gray-100 relative">
          <Bell size={20} color="#334155" />
          <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </TouchableOpacity>
      </View>
    </View>
  );
}