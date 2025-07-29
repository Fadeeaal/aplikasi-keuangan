import { APP_CONFIG } from '@/constants/AppConfig';

/**
 * Format number to Indonesian Rupiah currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(APP_CONFIG.CURRENCY_LOCALE, {
    style: 'currency',
    currency: APP_CONFIG.CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format currency for input display (with thousands separator)
 */
export const formatCurrencyInput = (value: string): string => {
  // Remove all non-numeric characters
  const numericValue = value.replace(/\D/g, '');
  
  if (!numericValue) return '';
  
  // Convert to number and format with thousands separator
  const number = parseInt(numericValue);
  return number.toLocaleString(APP_CONFIG.CURRENCY_LOCALE);
};

/**
 * Parse currency input to number
 */
export const parseCurrencyInput = (value: string): number => {
  // Remove all non-numeric characters
  const numericValue = value.replace(/\D/g, '');
  return numericValue ? parseInt(numericValue) : 0;
};

/**
 * Format date to Indonesian locale
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(APP_CONFIG.CURRENCY_LOCALE, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Format date to full Indonesian format
 */
export const formatDateFull = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(APP_CONFIG.CURRENCY_LOCALE, {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Get current date in YYYY-MM-DD format
 */
export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get month name in Indonesian
 */
export const getMonthName = (monthIndex: number): string => {
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return monthNames[monthIndex] || '';
};

/**
 * Get short month name in Indonesian
 */
export const getShortMonthName = (monthIndex: number): string => {
  const shortMonthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  return shortMonthNames[monthIndex] || '';
};

/**
 * Validate date format (YYYY-MM-DD)
 */
export const isValidDate = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Get date range for filtering
 */
export const getDateRange = (type: string): { startDate: string; endDate: string } => {
  const today = new Date();
  const currentDate = getCurrentDate();
  
  switch (type) {
    case 'today':
      return { startDate: currentDate, endDate: currentDate };
      
    case 'week': {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return {
        startDate: startOfWeek.toISOString().split('T')[0],
        endDate: endOfWeek.toISOString().split('T')[0]
      };
    }
    
    case 'month': {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      return {
        startDate: startOfMonth.toISOString().split('T')[0],
        endDate: endOfMonth.toISOString().split('T')[0]
      };
    }
    
    case 'quarter': {
      const quarter = Math.floor(today.getMonth() / 3);
      const startOfQuarter = new Date(today.getFullYear(), quarter * 3, 1);
      const endOfQuarter = new Date(today.getFullYear(), quarter * 3 + 3, 0);
      
      return {
        startDate: startOfQuarter.toISOString().split('T')[0],
        endDate: endOfQuarter.toISOString().split('T')[0]
      };
    }
    
    case 'year': {
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const endOfYear = new Date(today.getFullYear(), 11, 31);
      
      return {
        startDate: startOfYear.toISOString().split('T')[0],
        endDate: endOfYear.toISOString().split('T')[0]
      };
    }
    
    default:
      return { startDate: '', endDate: '' };
  }
};

/**
 * Calculate percentage change
 */
export const calculatePercentageChange = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

/**
 * Format percentage with sign
 */
export const formatPercentage = (percentage: number): string => {
  const sign = percentage > 0 ? '+' : '';
  return `${sign}${percentage.toFixed(1)}%`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Capitalize first letter
 */
export const capitalizeFirst = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Validate amount
 */
export const validateAmount = (amount: number): { isValid: boolean; error?: string } => {
  if (amount < APP_CONFIG.MIN_AMOUNT) {
    return {
      isValid: false,
      error: `Nominal minimal Rp ${formatCurrency(APP_CONFIG.MIN_AMOUNT)}`
    };
  }
  
  if (amount > APP_CONFIG.MAX_AMOUNT) {
    return {
      isValid: false,
      error: `Nominal maksimal Rp ${formatCurrency(APP_CONFIG.MAX_AMOUNT)}`
    };
  }
  
  return { isValid: true };
};

/**
 * Validate description
 */
export const validateDescription = (description: string): { isValid: boolean; error?: string } => {
  if (description.length > APP_CONFIG.MAX_DESCRIPTION_LENGTH) {
    return {
      isValid: false,
      error: `Keterangan maksimal ${APP_CONFIG.MAX_DESCRIPTION_LENGTH} karakter`
    };
  }
  
  return { isValid: true };
};
