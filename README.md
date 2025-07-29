# Aplikasi Keuangan Pribadi

Aplikasi mobile sederhana untuk manajemen keuangan pribadi yang dibangun dengan React Native dan Expo.

## Fitur Utama

### � Halaman Beranda
- Menampilkan total saldo saat ini dengan indikator warna (hijau untuk positif, merah untuk negatif)
- Ringkasan pemasukan dan pengeluaran dalam bentuk kartu yang mudah dibaca
- Grafik batang sederhana yang menampilkan tren pemasukan vs pengeluaran bulanan
- Tombol aksi cepat untuk menambah pemasukan atau pengeluaran

### 📝 Halaman Daftar Transaksi
- Daftar lengkap semua transaksi dengan informasi:
  - Tanggal transaksi
  - Keterangan/deskripsi
  - Jumlah dengan warna berbeda (hijau untuk pemasukan, merah untuk pengeluaran)
- Filter transaksi berdasarkan:
  - Jenis transaksi (semua/pemasukan/pengeluaran)
  - Rentang tanggal
- Fitur hapus transaksi dengan long press
- Pull-to-refresh untuk memperbarui data

### ➕ Halaman Tambah Transaksi
- Form untuk menambahkan transaksi baru dengan:
  - Pemilihan jenis transaksi (pemasukan atau pengeluaran)
  - Input nominal dengan format currency Indonesia
  - Input keterangan (opsional)
  - Tanggal otomatis menggunakan tanggal saat ini
- Validasi input untuk memastikan nominal lebih dari 0
- Interface yang responsif dan user-friendly

## Teknologi yang Digunakan

- **React Native** dengan **Expo** - Framework untuk pengembangan mobile
- **Expo Router** - Navigasi berbasis file system
- **Expo SQLite** - Database lokal untuk penyimpanan transaksi
- **React Native Chart Kit** - Library untuk grafik dan visualisasi data
- **TypeScript** - Type safety dan better development experience
- **React Context** - State management global
- **Async Storage** - Penyimpanan data lokal tambahan

## Arsitektur Aplikasi

```
app/
├── _layout.tsx              # Root layout dengan FinanceProvider
├── add-transaction.tsx      # Form tambah transaksi
└── (tabs)/
    ├── _layout.tsx         # Tab navigation layout
    ├── index.tsx           # Halaman beranda
    └── transactions.tsx    # Halaman daftar transaksi

components/
├── BalanceCard.tsx         # Komponen kartu saldo
├── MonthlyChart.tsx        # Komponen grafik bulanan
└── FilterModal.tsx         # Modal filter transaksi

contexts/
└── FinanceContext.tsx      # Context untuk state management

services/
└── DatabaseService.ts      # Service untuk operasi database

types/
└── Transaction.ts          # TypeScript interfaces
```

## Cara Menjalankan

1. **Instalasi Dependencies**
   ```bash
   npm install
   ```

2. **Menjalankan Development Server**
   ```bash
   npm start
   ```

3. **Menjalankan di Device/Emulator**
   - Android: `npm run android`
   - iOS: `npm run ios`
   - Web: `npm run web`

## Database Schema

Aplikasi menggunakan SQLite dengan skema tabel sebagai berikut:

```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount REAL NOT NULL CHECK (amount > 0),
  description TEXT,
  date TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Fitur Responsive Design

- Desain adaptif untuk berbagai ukuran layar (smartphone dan tablet)
- Layout yang optimal untuk perangkat Android
- Support untuk dark mode dan light mode
- Interface yang mengikuti Material Design principles

## State Management

Aplikasi menggunakan React Context untuk mengelola state global:
- **FinanceContext**: Mengelola data transaksi, summary, dan operasi database
- **Optimistic updates**: UI langsung terupdate saat ada perubahan data
- **Error handling**: Penanganan error yang comprehensive dengan user feedback

## Keamanan Data

- Data disimpan secara lokal menggunakan SQLite
- Tidak ada data yang dikirim ke server eksternal
- Validasi input untuk mencegah data yang tidak valid
- Transaction rollback pada kasus error

## Kontribusi

Aplikasi ini dibuat sebagai contoh implementasi aplikasi keuangan pribadi sederhana. Anda dapat:
- Fork repository ini
- Menambahkan fitur baru
- Melaporkan bug
- Memberikan saran perbaikan

## Lisensi

MIT License
