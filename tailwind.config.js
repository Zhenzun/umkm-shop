/** @type {import('tailwindcss').Config} */
module.exports = {
  // Pastikan path ini mencakup folder app dan components Anda
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB', // Royal Blue (Warna Utama: Elegan & Terpercaya)
        secondary: '#DBEAFE', // Biru Muda (untuk background item aktif)
        accent: '#F59E0B', // Kuning Emas (Hanya untuk bintang/diskon)
        background: '#F8FAFC', // Putih Kebiruan (Sangat bersih)
        dark: '#1E293B',
      }
    },
  },
  plugins: [],
}