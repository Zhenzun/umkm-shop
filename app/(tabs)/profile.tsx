import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Settings, Shield, User, Package, ChevronRight, LogOut, Box, ListOrdered } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';

import { useAuthStore } from '../../store/authStore';
import { ENDPOINTS } from '../../constants/api';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Ambil user dan logout dari store baru
  const { user, role, logout, isAuthenticated } = useAuthStore();
  
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cek Auth: Jika belum login, lempar ke halaman Login
  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) {
        router.replace('/auth/login');
      } else {
        fetchMyOrders();
      }
    }, [isAuthenticated])
  );

  const fetchMyOrders = async () => {
    if (role === 'admin') return;
    setLoading(true);
    try {
      const res = await axios.get(ENDPOINTS.orders);
      setMyOrders(res.data); 
    } catch (error) {
      console.log("Error history");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Baru': return 'text-blue-600 bg-blue-100';
      case 'Proses': return 'text-yellow-600 bg-yellow-100';
      case 'Selesai': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!user) return null; // Cegah render jika redirecting

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      
      {/* Header Profil Dinamis */}
      <View className="bg-white p-6 pb-8 rounded-b-3xl shadow-sm mb-4">
        <View className="flex-row items-center gap-4">
          <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center border-2 border-white shadow-sm">
            {role === 'admin' ? <Shield size={40} color="#2563EB" /> : <User size={40} color="#2563EB" />}
          </View>
          <View>
            <Text className="text-xl font-bold text-gray-800">{user.name}</Text>
            <Text className="text-gray-500 text-sm">{user.phone}</Text>
            <View className="mt-1 bg-blue-50 px-2 py-0.5 self-start rounded-md border border-blue-100">
               <Text className="text-xs font-bold text-blue-600 uppercase">{role}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchMyOrders} />}
      >
        
        {/* --- MENU ADMIN --- */}
        {role === 'admin' ? (
          <View>
            <Text className="font-bold text-gray-500 mb-3 uppercase text-xs tracking-wider">Menu Admin</Text>
            <TouchableOpacity 
                className="bg-white p-4 rounded-xl mb-3 flex-row items-center shadow-sm border border-gray-100"
                onPress={() => router.push('/admin/orders')}
            >
                <View className="bg-green-100 p-3 rounded-full mr-4"><ListOrdered size={24} color="#16A34A" /></View>
                <View className="flex-1"><Text className="font-bold text-gray-800">Pesanan Masuk</Text></View>
                <ChevronRight size={20} color="#CCC" />
            </TouchableOpacity>
            <TouchableOpacity 
                className="bg-white p-4 rounded-xl mb-3 flex-row items-center shadow-sm border border-gray-100"
                onPress={() => router.push('/admin/manage-product')}
            >
                <View className="bg-blue-100 p-3 rounded-full mr-4"><Box size={24} color="#2563EB" /></View>
                <View className="flex-1"><Text className="font-bold text-gray-800">Kelola Produk</Text></View>
                <ChevronRight size={20} color="#CCC" />
            </TouchableOpacity>
          </View>
        ) : (
          /* --- MENU USER --- */
          <View>
            <Text className="font-bold text-gray-500 mb-3 uppercase text-xs tracking-wider">Riwayat Pesanan</Text>
            {myOrders.length === 0 ? (
                <View className="items-center py-8 bg-white rounded-xl border-dashed border border-gray-300">
                    <Text className="text-gray-400">Belum ada pesanan.</Text>
                </View>
            ) : (
                myOrders.map((order: any) => (
                    <View key={order._id || order.id} className="bg-white p-4 rounded-xl mb-3 border border-gray-100">
                        <View className="flex-row justify-between mb-2">
                             <Text className="font-bold text-gray-800">#{order._id?.substring(order._id.length-5).toUpperCase()}</Text>
                             <Text className={`text-[10px] font-bold px-2 py-1 rounded-md ${getStatusColor(order.status)}`}>{order.status}</Text>
                        </View>
                        <Text className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</Text>
                        <Text className="font-bold text-blue-600 mt-1">Rp {order.totalPrice.toLocaleString()}</Text>
                    </View>
                ))
            )}
          </View>
        )}

        {/* LOGOUT */}
        <View className="mt-6">
            <TouchableOpacity 
                className="bg-white p-4 rounded-xl flex-row items-center shadow-sm border border-gray-100"
                onPress={handleLogout}
            >
                <LogOut size={20} color="#EF4444" className="mr-3" />
                <Text className="flex-1 font-medium text-red-500">Keluar Aplikasi</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}