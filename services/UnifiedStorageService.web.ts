import { Transaction } from '../types/Transaction';
import { webStorageService } from './WebStorageService';

/**
 * Storage service for Web platform using AsyncStorage
 */
class WebUnifiedStorageService {
  async init() {
    try {
      await webStorageService.init();
      console.log('Initialized web storage service');
    } catch (error) {
      console.error('Web storage initialization error:', error);
      throw error;
    }
  }

  async addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<number> {
    return await webStorageService.addTransaction(transaction);
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return await webStorageService.getAllTransactions();
  }

  async getFilteredTransactions(
    type?: 'income' | 'expense',
    startDate?: string,
    endDate?: string
  ): Promise<Transaction[]> {
    return await webStorageService.getFilteredTransactions(type, startDate, endDate);
  }

  async deleteTransaction(id: number): Promise<void> {
    return await webStorageService.deleteTransaction(id);
  }

  async getTransactionSummary(): Promise<{
    totalIncome: number;
    totalExpense: number;
    balance: number;
  }> {
    return await webStorageService.getTransactionSummary();
  }

  async getMonthlyData(): Promise<{ month: string; income: number; expense: number }[]> {
    return await webStorageService.getMonthlyData();
  }

  getPlatformInfo(): { platform: string; storageType: string } {
    return {
      platform: 'web',
      storageType: 'AsyncStorage'
    };
  }
}

export const storageService = new WebUnifiedStorageService();
