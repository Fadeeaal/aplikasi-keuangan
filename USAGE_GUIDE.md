# Panduan Penggunaan Aplikasi Keuangan Pribadi
## 📱 Navigasi Aplikasi

### Tab Navigation
- **Beranda**: Menampilkan ringkasan keuangan dan grafik
- **Transaksi**: Menampilkan daftar semua transaksi

## 🏠 Halaman Beranda

### Fitur Utama:
1. **Kartu Saldo**
   - Menampilkan saldo total (hijau jika positif, merah jika negatif)
   - Kartu pemasukan total (warna hijau)
   - Kartu pengeluaran total (warna merah)

2. **Grafik Bulanan**
   - Grafik batang pemasukan vs pengeluaran
   - Data 6 bulan terakhir
   - Legend untuk memudahkan pembacaan

3. **Aksi Cepat**
   - Tombol "Tambah Pemasukan" (hijau)
   - Tombol "Tambah Pengeluaran" (merah)

### Pull-to-Refresh
Tarik ke bawah untuk memperbarui data terbaru

## 📋 Halaman Transaksi

### Daftar Transaksi
- Setiap item menampilkan:
  - Keterangan transaksi
  - Tanggal (format Indonesia)
  - Nominal dengan tanda + (pemasukan) atau - (pengeluaran)
  - Indikator visual (panah naik/turun)

### Filter Transaksi
1. **Filter Jenis**
   - Semua
   - Pemasukan saja
   - Pengeluaran saja

2. **Filter Tanggal**
   - Tanggal mulai (format: YYYY-MM-DD)
   - Tanggal akhir (format: YYYY-MM-DD)

## ➕ Menambah Transaksi

### Akses Form
- Dari beranda / daftar transaksi: Tap tombol Add di header

### Mengisi Form

1. **Pilih Jenis Transaksi**
   - Tap "Pemasukan" (hijau dengan panah turun)
   - Tap "Pengeluaran" (merah dengan panah naik)

2. **Input Nominal** (Wajib)
   - Ketik angka (otomatis format ribuan)
   - Contoh: ketik "50000" → tampil "50.000"
   - Preview format rupiah muncul di bawah

3. **Keterangan** (Opsional)
   - Deskripsi singkat transaksi
   - Contoh: "Gaji bulan ini", "Beli groceries", dll.

4. **Tanggal**
   - Otomatis pada tanggal pembuatan catatan transaksi

### Menyimpan
- Tombol "Simpan Transaksi" aktif jika nominal > 0
- Loading state saat menyimpan
- Notifikasi berhasil dan kembali ke halaman sebelumnya

---

## 🔧 Dokumentasi API

### Overview
Aplikasi menggunakan arsitektur layered dengan Context API untuk state management dan service layer untuk data persistence. Mendukung dua platform:
- **Native**: SQLite database (iOS/Android)
- **Web**: AsyncStorage dengan fallback ke localStorage

### Core Services

#### `FinanceContext`
Context utama yang menyediakan state management untuk seluruh aplikasi.

**Hook**: `useFinance()`

**State**:
```typescript
interface FinanceContextType {
  transactions: Transaction[];      // Daftar semua transaksi
  summary: TransactionSummary;     // Ringkasan keuangan
  isLoading: boolean;              // Status loading
}
```

**Methods**:
```typescript
// Menambah transaksi baru
addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<void>

// Menghapus transaksi berdasarkan ID
deleteTransaction(id: number): Promise<void>

// Refresh semua data
refreshData(): Promise<void>

// Filter transaksi
getFilteredTransactions(
  type?: 'income' | 'expense',
  startDate?: string,
  endDate?: string
): Promise<Transaction[]>

// Data grafik bulanan
getMonthlyData(): Promise<{ month: string; income: number; expense: number }[]>
```

#### `UnifiedStorageService`
Service layer yang menangani penyimpanan data dengan platform detection.

**Core Methods**:
```typescript
// Inisialisasi database/storage
init(): Promise<void>

// CRUD Operations
addTransaction(transaction): Promise<number>
getAllTransactions(): Promise<Transaction[]>
deleteTransaction(id: number): Promise<void>

// Analytics
getTransactionSummary(): Promise<TransactionSummary>
getMonthlyData(): Promise<{ month: string; income: number; expense: number }[]>

// Utility
clearAllData(): Promise<void>
getPlatformInfo(): { platform: string; storageType: string }
```

### Data Types

#### `Transaction`
```typescript
interface Transaction {
  id: number;                    // Auto-generated ID
  type: 'income' | 'expense';    // Jenis transaksi
  amount: number;                // Nominal (dalam rupiah)
  description: string;           // Keterangan
  date: string;                  // Format: YYYY-MM-DD
  createdAt: string;            // Timestamp pembuatan
}
```

#### `TransactionSummary`
```typescript
interface TransactionSummary {
  totalIncome: number;    // Total pemasukan
  totalExpense: number;   // Total pengeluaran  
  balance: number;        // Saldo (income - expense)
}
```

### Usage Examples

#### Menambah Transaksi
```typescript
const { addTransaction } = useFinance();

await addTransaction({
  type: 'income',
  amount: 5000000,
  description: 'Gaji bulanan',
  date: '2025-07-29'
});
```

#### Filter Transaksi
```typescript
const { getFilteredTransactions } = useFinance();

// Hanya pemasukan bulan ini
const incomeThisMonth = await getFilteredTransactions(
  'income', 
  '2025-07-01', 
  '2025-07-31'
);
```

#### Data Grafik
```typescript
const { getMonthlyData } = useFinance();

const chartData = await getMonthlyData();
// Returns: [{ month: '2025-07', income: 5000000, expense: 2000000 }, ...]
```

### Error Handling
Semua method service menggunakan try-catch dan akan throw error jika operasi gagal. Context akan menangani error dan menampilkan alert kepada user.

### Performance
- Data di-cache dalam Context state
- Refresh otomatis setelah operasi CUD
- Pull-to-refresh untuk manual refresh
- Lazy loading untuk data grafik