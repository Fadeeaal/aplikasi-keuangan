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