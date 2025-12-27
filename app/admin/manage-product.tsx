import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { toast } from 'sonner-native';
import { Ionicons } from '@expo/vector-icons'; // Kita pakai ikon kamera
import * as ImagePicker from 'expo-image-picker'; // Import Library
import { useProductStore } from '../../store/productStore';

export default function ManageProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEditMode = !!params.id;
  const { addProduct, updateProduct, products } = useProductStore();

  // State Form
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Makanan'); // Default kategori
  const [image, setImage] = useState<string | null>(null);

  // Load data jika Edit Mode
  useEffect(() => {
    if (isEditMode) {
      const product = products.find(p => p.id === params.id);
      if (product) {
        setName(product.name);
        setPrice(product.price.toString());
        setImage(product.image);
        setDescription(product.description);
        setCategory(product.category);
      }
    }
  }, [params.id]);

  // --- LOGIKA PICK IMAGE ---
  const pickImage = async () => {
    // 1. Minta Izin Akses Galeri
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      toast.error("Izin galeri dibutuhkan untuk upload foto!");
      return;
    }

    // 2. Buka Galeri
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // Hanya gambar, bukan video
      allowsEditing: true,    // Bisa crop/potong
      aspect: [1, 1],         // Rasio kotak (Instagram style)
      quality: 0.5,           // Kompresi kualitas agar tidak berat (0 - 1)
    });

    // 3. Simpan URI Gambar jika tidak dibatalkan
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      toast.success("Foto berhasil dipilih!");
    }
  };

  const handleSave = () => {
    if (!name || !price || !image) {
      toast.error("Nama, Harga, dan Foto wajib diisi!");
      return;
    }

    const payload = {
      name,
      price: parseInt(price),
      image, // Ini sekarang berisi path lokal file (file:///...)
      description: description || "Deskripsi standar UMKM",
      category
    };

    if (isEditMode) {
      updateProduct(params.id as string, payload);
      toast.success("Produk diperbarui!");
    } else {
      addProduct({
        id: Date.now().toString(),
        ...payload
      });
      toast.success("Produk ditambahkan!");
    }
    router.back();
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        {/* Header */}
        <Text className="text-2xl font-bold text-primary mb-6">
          {isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}
        </Text>

        {/* --- AREA UPLOAD FOTO --- */}
        <View className="items-center mb-6">
          <TouchableOpacity 
            onPress={pickImage}
            className="w-40 h-40 bg-gray-200 rounded-2xl items-center justify-center border-2 border-dashed border-gray-400 overflow-hidden shadow-sm active:opacity-80"
          >
            {image ? (
              <>
                <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
                {/* Tombol ganti kecil di pojok */}
                <View className="absolute bottom-0 w-full bg-black/50 py-1 items-center">
                  <Text className="text-white text-xs font-bold">Ganti Foto</Text>
                </View>
              </>
            ) : (
              <View className="items-center">
                <Ionicons name="camera" size={40} color="#94A3B8" />
                <Text className="text-gray-500 text-xs mt-2 font-medium">Ketuk untuk Upload</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Form Inputs */}
        <View className="gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <View>
            <Text className="mb-2 font-medium text-gray-700">Nama Produk</Text>
            <TextInput 
              className="border border-gray-300 p-3 rounded-lg bg-gray-50 focus:border-primary focus:bg-white"
              value={name}
              onChangeText={setName}
              placeholder="Contoh: Pisang Nugget"
            />
          </View>

          <View>
             <Text className="mb-2 font-medium text-gray-700">Kategori</Text>
             {/* Simple Dropdown simulation using multiple buttons for UX */}
             <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                {['Makanan', 'Minuman', 'Bumbu', 'Kerajinan'].map((cat) => (
                  <TouchableOpacity 
                    key={cat}
                    onPress={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-full border ${category === cat ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}
                  >
                    <Text className={category === cat ? 'text-white font-bold' : 'text-gray-600'}>{cat}</Text>
                  </TouchableOpacity>
                ))}
             </ScrollView>
          </View>

          <View>
            <Text className="mb-2 font-medium text-gray-700">Harga (Rp)</Text>
            <TextInput 
              className="border border-gray-300 p-3 rounded-lg bg-gray-50 focus:border-primary focus:bg-white"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>

          <View>
            <Text className="mb-2 font-medium text-gray-700">Deskripsi</Text>
            <TextInput 
              className="border border-gray-300 p-3 rounded-lg bg-gray-50 h-24 focus:border-primary focus:bg-white"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              placeholder="Jelaskan detail produk..."
            />
          </View>
        </View>

        {/* Tombol Simpan */}
        <TouchableOpacity 
          className="bg-primary p-4 rounded-xl items-center mt-6 shadow-lg active:scale-95 transition-all"
          onPress={handleSave}
        >
          <Text className="text-white font-bold text-lg">
            {isEditMode ? 'Simpan Perubahan' : 'Upload Produk'}
          </Text>
        </TouchableOpacity>

        {/* Spacer agar tidak tertutup keyboard/navigasi */}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}