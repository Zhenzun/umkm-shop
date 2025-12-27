import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import axios from 'axios';
import { toast } from 'sonner-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle, Clock, XCircle } from 'lucide-react-native';
import { ENDPOINTS } from '../../constants/api';

export default function AdminOrderScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(ENDPOINTS.orders);
      setOrders(res.data);
    } catch (error) {
      toast.error("Gagal mengambil data pesanan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await axios.patch(`${ENDPOINTS.orders}/${id}`, { status: newStatus });
      toast.success(`Status diubah: ${newStatus}`);
      fetchOrders(); // Refresh data
    } catch (error) {
      toast.error("Gagal update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Baru': return 'bg-blue-100 text-blue-700';
      case 'Proses': return 'bg-yellow-100 text-yellow-700';
      case 'Selesai': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <View className="flex-1 bg-gray-50 pt-10">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="px-4 pb-4 flex-row items-center gap-3 bg-white border-b border-gray-200 pt-2">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Daftar Pesanan</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item: any) => item._id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchOrders} />}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text className="text-center text-gray-400 mt-10">Belum ada pesanan.</Text>}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-xl mb-3 border border-gray-200 shadow-sm">
            <View className="flex-row justify-between mb-2">
              <Text className="font-bold text-gray-800">#{item._id.substring(item._id.length - 5).toUpperCase()}</Text>
              <View className={`px-2 py-1 rounded-md ${getStatusColor(item.status).split(' ')[0]}`}>
                <Text className={`text-xs font-bold ${getStatusColor(item.status).split(' ')[1]}`}>{item.status}</Text>
              </View>
            </View>

            <Text className="text-gray-500 text-xs mb-2">
              {new Date(item.createdAt).toLocaleString('id-ID')}
            </Text>

            {/* List Item Singkat */}
            <View className="bg-gray-50 p-2 rounded-md mb-3">
              {item.items.map((prod: any, idx: number) => (
                <Text key={idx} className="text-gray-600 text-sm">
                  • {prod.name} x{prod.qty}
                </Text>
              ))}
            </View>

            <View className="flex-row justify-between items-center border-t border-gray-100 pt-3">
              <Text className="font-bold text-lg text-primary">Rp {item.totalPrice.toLocaleString()}</Text>
              
              {/* Action Buttons */}
              {item.status !== 'Selesai' && (
                <View className="flex-row gap-2">
                  <TouchableOpacity 
                    onPress={() => updateStatus(item._id, 'Proses')}
                    className="bg-yellow-500 p-2 rounded-lg"
                  >
                    <Clock size={16} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => updateStatus(item._id, 'Selesai')}
                    className="bg-green-600 p-2 rounded-lg"
                  >
                    <CheckCircle size={16} color="white" />
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