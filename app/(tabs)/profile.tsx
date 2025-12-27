import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Settings, Shield, User, Package, ChevronRight, LogOut, Box, ListOrdered } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';
import axios from 'axios';

import { useAuthStore } from '../../store/authStore';
import { ENDPOINTS } from '../../constants/api';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { role, setRole } = useAuthStore();
  
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ambil data order setiap kali halaman dibuka
  const fetchMyOrders = async () => {
    // Hanya fetch jika user biasa (Admin punya halaman sendiri)
    if (role === 'admin') return;

    setLoading(true);
    try {
      const res = await axios.get(ENDPOINTS.orders);
      // Di aplikasi nyata, filter by User ID. Di sini kita ambil semua untuk demo.
      setMyOrders(res.data); 
    } catch (error) {
      console.log("Gagal load history");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMyOrders();
    }, [role])
  );

  const toggleRole = () => {
    const newRole = role === 'admin' ? 'user' : 'admin';
    setRole(newRole);
    toast.success(`Berhasil login sebagai ${newRole.toUpperCase()}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Baru': return 'text-blue-600 bg-blue-100';
      case 'Proses': return 'text-yellow-600 bg-yellow-100';
      case 'Selesai': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      
      {/* Header Profil */}
      <View className="bg-white p-6 pb-8 rounded-b-3xl shadow-sm mb-4">
        <View className="flex-row items-center gap-4">
          <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center border-2 border-white shadow-sm">
            {role === 'admin' ? (
                <Shield size={40} color="#2563EB" />
            ) : (
                <User size={40} color="#2563EB" />
            )}
          </View>
          <View>
            <Text className="text-xl font-bold text-gray-800">
                {role === 'admin' ? 'Administrator' : 'Pelanggan Setia'}
            </Text>
            <Text className="text-gray-500 text-sm">0812-3456-7890</Text>
            <TouchableOpacity 
                onPress={toggleRole}
                className="mt-2 bg-gray-100 px-3 py-1 rounded-full self-start border border-gray-200"
            >
                <Text className="text-xs font-bold text-gray-600">
                    Switch ke {role === 'admin' ? 'USER' : 'ADMIN'} ⇄
                </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchMyOrders} />}
      >
        
        {/* --- MENU KHUSUS ADMIN --- */}
        {role === 'admin' ? (
          <View>
            <Text className="font-bold text-gray-500 mb-3 uppercase text-xs tracking-wider">Menu Admin</Text>
            
            <TouchableOpacity 
                className="bg-white p-4 rounded-xl mb-3 flex-row items-center shadow-sm border border-gray-100"
                onPress={() => router.push('/admin/orders')}
            >
                <View className="bg-green-100 p-3 rounded-full mr-4"><ListOrdered size={24} color="#16A34A" /></View>
                <View className="flex-1">
                    <Text className="font-bold text-gray-800 text-base">Pesanan Masuk</Text>
                    <Text className="text-gray-400 text-xs">Cek orderan pelanggan</Text>
                </View>
                <ChevronRight size={20} color="#CCC" />
            </TouchableOpacity>

            <TouchableOpacity 
                className="bg-white p-4 rounded-xl mb-3 flex-row items-center shadow-sm border border-gray-100"
                onPress={() => router.push('/admin/manage-product')}
            >
                <View className="bg-blue-100 p-3 rounded-full mr-4"><Box size={24} color="#2563EB" /></View>
                <View className="flex-1">
                    <Text className="font-bold text-gray-800 text-base">Kelola Produk</Text>
                    <Text className="text-gray-400 text-xs">Tambah atau edit barang</Text>
                </View>
                <ChevronRight size={20} color="#CCC" />
            </TouchableOpacity>
          </View>
        ) : (
          /* --- MENU KHUSUS USER (RIWAYAT) --- */
          <View>
            <Text className="font-bold text-gray-500 mb-3 uppercase text-xs tracking-wider">Riwayat Pesanan Saya</Text>
            
            {myOrders.length === 0 ? (
                <View className="items-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                    <Package size={40} color="#CCC" />
                    <Text className="text-gray-400 mt-2">Belum ada pesanan.</Text>
                </View>
            ) : (
                myOrders.map((order: any) => (
                    <View key={order._id || order.id} className="bg-white p-4 rounded-xl mb-3 border border-gray-100 shadow-sm">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="font-bold text-gray-800">
                                #{order._id ? order._id.substring(order._id.length - 5).toUpperCase() : 'ID'}
                            </Text>
                            <View className={`px-2 py-1 rounded-md ${getStatusColor(order.status).split(' ')[1]}`}>
                                <Text className={`text-[10px] font-bold ${getStatusColor(order.status).split(' ')[0]}`}>
                                    {order.status}
                                </Text>
                            </View>
                        </View>
                        <Text className="text-gray-500 text-xs mb-2">
                            {new Date(order.createdAt).toLocaleString('id-ID')}
                        </Text>
                        <View className="border-t border-gray-50 pt-2 flex-row justify-between items-center">
                            <Text className="text-gray-500 text-xs">{order.items.length} Barang</Text>
                            <Text className="font-bold text-blue-600">Rp {order.totalPrice.toLocaleString()}</Text>
                        </View>
                    </View>
                ))
            )}
          </View>
        )}

        {/* Menu Umum */}
        <View className="mt-6">
            <Text className="font-bold text-gray-500 mb-3 uppercase text-xs tracking-wider">Pengaturan</Text>
            <TouchableOpacity className="bg-white p-4 rounded-xl mb-3 flex-row items-center shadow-sm border border-gray-100">
                <Settings size={20} color="#64748B" className="mr-3" />
                <Text className="flex-1 font-medium text-gray-700">Pengaturan Aplikasi</Text>
                <ChevronRight size={20} color="#CCC" />
            </TouchableOpacity>
            
            <TouchableOpacity className="bg-white p-4 rounded-xl flex-row items-center shadow-sm border border-gray-100">
                <LogOut size={20} color="#EF4444" className="mr-3" />
                <Text className="flex-1 font-medium text-red-500">Keluar</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}