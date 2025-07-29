/**
 * Application Configuration Constants
 */

export const APP_CONFIG = {
  // Database
  DATABASE_NAME: 'finance.db',
  DATABASE_VERSION: 1,

  // Currency
  CURRENCY: 'IDR',
  CURRENCY_LOCALE: 'id-ID',
  
  // Date Format
  DATE_FORMAT: 'YYYY-MM-DD',
  DISPLAY_DATE_FORMAT: 'DD MMM YYYY',
  
  // Chart
  CHART_MONTHS_COUNT: 6,
  
  // Validation
  MIN_AMOUNT: 1,
  MAX_AMOUNT: 999999999999, // 1 Trillion
  MAX_DESCRIPTION_LENGTH: 255,
  
  // UI
  ANIMATION_DURATION: 200,
  REFRESH_THRESHOLD: 50,
  
  // Colors
  INCOME_COLOR: '#2ECC71',
  EXPENSE_COLOR: '#E74C3C',
  SUCCESS_COLOR: '#27AE60',
  WARNING_COLOR: '#F39C12',
  ERROR_COLOR: '#E74C3C',
  INFO_COLOR: '#3498DB',
};

export const TRANSACTION_TYPES = {
  INCOME: 'income' as const,
  EXPENSE: 'expense' as const,
};

export const FILTER_TYPES = {
  ALL: 'all' as const,
  INCOME: 'income' as const,
  EXPENSE: 'expense' as const,
};

export const DATE_RANGES = {
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year',
  CUSTOM: 'custom',
} as const;

export const SORT_OPTIONS = {
  DATE_DESC: 'date_desc',
  DATE_ASC: 'date_asc',
  AMOUNT_DESC: 'amount_desc',
  AMOUNT_ASC: 'amount_asc',
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Tidak dapat terhubung ke server',
  DATABASE_ERROR: 'Terjadi kesalahan pada database',
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid',
  AMOUNT_REQUIRED: 'Nominal wajib diisi',
  AMOUNT_MIN: `Nominal minimal Rp ${APP_CONFIG.MIN_AMOUNT.toLocaleString('id-ID')}`,
  AMOUNT_MAX: `Nominal maksimal Rp ${APP_CONFIG.MAX_AMOUNT.toLocaleString('id-ID')}`,
  DESCRIPTION_TOO_LONG: `Keterangan maksimal ${APP_CONFIG.MAX_DESCRIPTION_LENGTH} karakter`,
  DATE_INVALID: 'Format tanggal tidak valid',
  GENERIC_ERROR: 'Terjadi kesalahan yang tidak terduga',
};

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  TRANSACTION_ADDED: 'Transaksi berhasil ditambahkan',
  TRANSACTION_UPDATED: 'Transaksi berhasil diperbarui',
  TRANSACTION_DELETED: 'Transaksi berhasil dihapus',
  DATA_REFRESHED: 'Data berhasil diperbarui',
};

/**
 * Labels and Text
 */
export const LABELS = {
  // Transaction Types
  INCOME: 'Pemasukan',
  EXPENSE: 'Pengeluaran',
  
  // Navigation
  HOME: 'Beranda',
  TRANSACTIONS: 'Transaksi',
  ADD_TRANSACTION: 'Tambah Transaksi',
  
  // Form Fields
  AMOUNT: 'Nominal',
  DESCRIPTION: 'Keterangan',
  DATE: 'Tanggal',
  TYPE: 'Jenis Transaksi',
  
  // Actions
  SAVE: 'Simpan',
  CANCEL: 'Batal',
  DELETE: 'Hapus',
  EDIT: 'Edit',
  FILTER: 'Filter',
  RESET: 'Reset',
  APPLY: 'Terapkan',
  
  // Status
  LOADING: 'Memuat...',
  SAVING: 'Menyimpan...',
  EMPTY: 'Belum ada data',
  NO_TRANSACTIONS: 'Belum ada transaksi',
  
  // Confirmation
  CONFIRM_DELETE: 'Apakah Anda yakin ingin menghapus transaksi ini?',
  CONFIRM_CANCEL: 'Batalkan perubahan yang belum disimpan?',
};

/**
 * Chart Configuration
 */
export const CHART_CONFIG = {
  BACKGROUND_GRADIENT: {
    FROM: '#ffffff',
    TO: '#ffffff',
  },
  GRID_COLOR: '#e0e0e0',
  LABEL_COLOR: '#666666',
  BAR_RADIUS: 4,
  CHART_PADDING: 16,
};

/**
 * Screen Dimensions
 */
export const SCREEN_CONFIG = {
  HEADER_HEIGHT: 60,
  TAB_BAR_HEIGHT: 80,
  CARD_MARGIN: 16,
  SECTION_SPACING: 24,
};

/**
 * Input Validation Rules
 */
export const VALIDATION_RULES = {
  AMOUNT: {
    min: APP_CONFIG.MIN_AMOUNT,
    max: APP_CONFIG.MAX_AMOUNT,
    required: true,
  },
  DESCRIPTION: {
    maxLength: APP_CONFIG.MAX_DESCRIPTION_LENGTH,
    required: false,
  },
  DATE: {
    format: APP_CONFIG.DATE_FORMAT,
    required: true,
  },
};

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  FIRST_LAUNCH: 'first_launch',
  LAST_BACKUP: 'last_backup',
};
