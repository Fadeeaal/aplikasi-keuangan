import { Transaction } from '../types/Transaction';
import { databaseService } from './DatabaseService';

/**
 * Storage service for Native platforms using SQLite
 */
class NativeUnifiedStorageService {
  async init() {
    try {
      await databaseService.init();
      console.log('Initialized native database service');
    } catch (error) {
      console.error('Native database initialization error:', error);
      throw error;
    }
  }

  async addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<number> {
    return await databaseService.addTransaction(transaction);
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return await databaseService.getAllTransactions();
  }

  async getFilteredTransactions(
    type?: 'income' | 'expense',
    startDate?: string,
    endDate?: string
  ): Promise<Transaction[]> {
    return await databaseService.getFilteredTransactions(type, startDate, endDate);
  }

  async deleteTransaction(id: number): Promise<void> {
    return await databaseService.deleteTransaction(id);
  }

  async getTransactionSummary(): Promise<{
    totalIncome: number;
    totalExpense: number;
    balance: number;
  }> {
    return await databaseService.getTransactionSummary();
  }

  async getMonthlyData(): Promise<{ month: string; income: number; expense: number }[]> {
    return await databaseService.getMonthlyData();
  }

  getPlatformInfo(): { platform: string; storageType: string } {
    return {
      platform: 'native',
      storageType: 'SQLite'
    };
  }
}

export const storageService = new NativeUnifiedStorageService();
