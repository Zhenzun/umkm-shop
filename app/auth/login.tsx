import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { toast } from 'sonner-native';
import { useAuthStore } from '../../store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      toast.error("Isi semua data!");
      return;
    }
    setLoading(true);
    try {
      await login(phone, password);
      router.replace('/(tabs)'); // Masuk ke aplikasi utama
    } catch (e) {
      // Error sudah dihandle di store
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white justify-center p-6">
      <StatusBar style="dark" />
      
      <View className="items-center mb-10">
        <Image 
          source={require('../../assets/images/icon.png')} 
          className="w-24 h-24 mb-4" 
          resizeMode="contain" 
        />
        <Text className="text-2xl font-bold text-blue-600">Masuk UMKM Shop</Text>
        <Text className="text-gray-400">Silakan login untuk melanjutkan</Text>
      </View>

      <View className="gap-4">
        <View>
          <Text className="mb-2 font-medium text-gray-700">Nomor HP</Text>
          <TextInput 
            className="border border-gray-200 p-4 rounded-xl bg-gray-50 text-base"
            placeholder="0812xxx"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View>
          <Text className="mb-2 font-medium text-gray-700">Password</Text>
          <TextInput 
            className="border border-gray-200 p-4 rounded-xl bg-gray-50 text-base"
            placeholder="******"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity 
          className={`bg-blue-600 p-4 rounded-xl items-center mt-4 shadow-lg shadow-blue-200 ${loading ? 'opacity-70' : ''}`}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Masuk</Text>}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-500">Belum punya akun? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/register')}>
            <Text className="text-blue-600 font-bold">Daftar Sekarang</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}