import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { toast } from 'sonner-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react-native';
import { ENDPOINTS } from '../../constants/api';

export default function AdminOrderScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi Fetch Orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(ENDPOINTS.orders);
      setOrders(res.data);
    } catch (error) {
      toast.error("Gagal mengambil data pesanan. Cek server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update Status Pesanan
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await axios.patch(`${ENDPOINTS.orders}/${id}`, { status: newStatus });
      toast.success(`Status diubah: ${newStatus}`);
      fetchOrders(); // Refresh data agar tampilan update
    } catch (error) {
      toast.error("Gagal update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Baru': return 'bg-blue-100 text-blue-800';
      case 'Proses': return 'bg-yellow-100 text-yellow-800';
      case 'Selesai': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <View className="flex-1 bg-gray-50 pt-12">
      <StatusBar style="dark" />
      
      {/* Header Simple */}
      <View className="px-4 pb-4 flex-row items-center gap-4 bg-white border-b border-gray-200 pt-2">
        <TouchableOpacity onPress={() => router.back()} className="p-2 bg-gray-100 rounded-full">
          <ArrowLeft size={20} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Daftar Pesanan Masuk</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item: any) => item._id || item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchOrders} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
        ListEmptyComponent={
          !loading && (
            <View className="items-center mt-20">
              <Text className="text-gray-400">Belum ada pesanan masuk.</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-xl mb-4 border border-gray-100 shadow-sm">
            {/* Header Card */}
            <View className="flex-row justify-between mb-3 border-b border-gray-50 pb-2">
              <View>
                 <Text className="font-bold text-gray-800 text-base">Order #{item._id ? item._id.substring(item._id.length - 5).toUpperCase() : '???'}</Text>
                 <Text className="text-gray-400 text-xs">{new Date(item.createdAt).toLocaleString('id-ID')}</Text>
              </View>
              <View className={`px-3 py-1 rounded-full self-start ${getStatusColor(item.status).split(' ')[0]}`}>
                <Text className={`text-xs font-bold ${getStatusColor(item.status).split(' ')[1]}`}>{item.status}</Text>
              </View>
            </View>

            {/* List Barang */}
            <View className="mb-3">
              {item.items.map((prod: any, idx: number) => (
                <View key={idx} className="flex-row justify-between mb-1">
                  <Text className="text-gray-600 text-sm flex-1">• {prod.name} x{prod.qty}</Text>
                  <Text className="text-gray-500 text-sm font-medium">Rp {(prod.price * prod.qty).toLocaleString()}</Text>
                </View>
              ))}
            </View>

            {/* Footer Total & Action */}
            <View className="flex-row justify-between items-center mt-2 pt-3 border-t border-gray-100">
              <View>
                 <Text className="text-xs text-gray-400">Total Harga</Text>
                 <Text className="font-bold text-lg text-blue-600">Rp {item.totalPrice.toLocaleString()}</Text>
              </View>
              
              {/* Tombol Aksi Admin */}
              {item.status !== 'Selesai' && (
                <View className="flex-row gap-2">
                  <TouchableOpacity 
                    onPress={() => updateStatus(item._id || item.id, 'Proses')}
                    className="bg-yellow-100 p-2 rounded-lg border border-yellow-200"
                  >
                    <Clock size={20} color="#CA8A04" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => updateStatus(item._id || item.id, 'Selesai')}
                    className="bg-green-100 p-2 rounded-lg border border-green-200"
                  >
                    <CheckCircle size={20} color="#16A34A" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}