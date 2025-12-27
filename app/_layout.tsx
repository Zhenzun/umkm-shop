import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Toaster } from 'sonner-native';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // <--- WAJIB IMPORT INI
import "../global.css";

export default function RootLayout() {
  
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Setup navigasi transparan
      NavigationBar.setPositionAsync('absolute');
      NavigationBar.setBackgroundColorAsync('#ffffff00');
      NavigationBar.setButtonStyleAsync('dark'); 
    }
  }, []);

  return (
    // 1. GestureHandlerRootView HARUS jadi pembungkus paling luar
    // 2. Berikan style flex: 1 agar mengisi seluruh layar
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" translucent />
        
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          
          <Stack.Screen 
            name="product/[id]" 
            options={{ 
              presentation: 'modal', 
              headerShown: true, 
              title: 'Detail Produk',
              headerBackTitleVisible: false 
            }} 
          />
          
          <Stack.Screen 
            name="admin/manage-product" 
            options={{ presentation: 'modal', title: 'Kelola Produk' }} 
          />
        </Stack>
        
        {/* Toaster aman ditaruh di sini karena sudah di dalam GestureHandlerRootView */}
        <Toaster />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}