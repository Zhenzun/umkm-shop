import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { toast } from 'sonner-native';
import { useAuthStore } from '../../store/authStore';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuthStore();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !phone || !password) {
      toast.error("Lengkapi semua data!");
      return;
    }
    setLoading(true);
    try {
      await register(name, phone, password);
      router.replace('/(tabs)');
    } catch (e) {
      // Error handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white justify-center p-6">
      <StatusBar style="dark" />
      
      <Text className="text-3xl font-bold text-blue-600 mb-2">Buat Akun</Text>
      <Text className="text-gray-400 mb-8">Bergabung dengan komunitas UMKM kami.</Text>

      <View className="gap-4">
        <View>
          <Text className="mb-2 font-medium text-gray-700">Nama Lengkap</Text>
          <TextInput 
            className="border border-gray-200 p-4 rounded-xl bg-gray-50"
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View>
          <Text className="mb-2 font-medium text-gray-700">Nomor HP</Text>
          <TextInput 
            className="border border-gray-200 p-4 rounded-xl bg-gray-50"
            placeholder="0812xxx"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View>
          <Text className="mb-2 font-medium text-gray-700">Password</Text>
          <TextInput 
            className="border border-gray-200 p-4 rounded-xl bg-gray-50"
            placeholder="******"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity 
          className={`bg-blue-600 p-4 rounded-xl items-center mt-4 ${loading ? 'opacity-70' : ''}`}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Daftar</Text>}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-500">Sudah punya akun? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-blue-600 font-bold">Masuk</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}