import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types/Transaction';

/**
 * Web-compatible storage service using AsyncStorage (localStorage on web)
 * This is a fallback for when SQLite is not available (web platform)
 */
class WebStorageService {
  private readonly STORAGE_KEY = 'finance_transactions';
  private readonly VERSION_KEY = 'finance_db_version';
  private readonly CURRENT_VERSION = 1;

  async init() {
    try {
      // Check if we need to migrate or initialize
      const version = await AsyncStorage.getItem(this.VERSION_KEY);
      if (!version || parseInt(version) < this.CURRENT_VERSION) {
        await this.initializeStorage();
      }
    } catch (error) {
      console.error('Web storage initialization error:', error);
    }
  }

  private async initializeStorage() {
    try {
      // Set version
      await AsyncStorage.setItem(this.VERSION_KEY, this.CURRENT_VERSION.toString());
      
      // Initialize empty transactions array if not exists
      const existingData = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (!existingData) {
        await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
      }
    } catch (error) {
      console.error('Error initializing web storage:', error);
    }
  }

  private async getAllTransactionsFromStorage(): Promise<Transaction[]> {
    try {
      const data = await AsyncStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from storage:', error);
      return [];
    }
  }

  private async saveTransactionsToStorage(transactions: Transaction[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving to storage:', error);
      throw error;
    }
  }

  private generateId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  async addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<number> {
    try {
      const transactions = await this.getAllTransactionsFromStorage();
      const newId = this.generateId();
      const newTransaction: Transaction = {
        ...transaction,
        id: newId,
        createdAt: new Date().toISOString(),
      };
      
      transactions.push(newTransaction);
      await this.saveTransactionsToStorage(transactions);
      return newId;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  async getAllTransactions(): Promise<Transaction[]> {
    try {
      const transactions = await this.getAllTransactionsFromStorage();
      // Sort by date DESC, then by createdAt DESC
      return transactions.sort((a, b) => {
        const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateCompare === 0) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return dateCompare;
      });
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  }

  async getFilteredTransactions(
    type?: 'income' | 'expense',
    startDate?: string,
    endDate?: string
  ): Promise<Transaction[]> {
    try {
      let transactions = await this.getAllTransactions();

      // Filter by type
      if (type) {
        transactions = transactions.filter(t => t.type === type);
      }

      // Filter by date range
      if (startDate) {
        transactions = transactions.filter(t => t.date >= startDate);
      }

      if (endDate) {
        transactions = transactions.filter(t => t.date <= endDate);
      }

      return transactions;
    } catch (error) {
      console.error('Error getting filtered transactions:', error);
      return [];
    }
  }

  async deleteTransaction(id: number): Promise<void> {
    try {
      const transactions = await this.getAllTransactionsFromStorage();
      const filteredTransactions = transactions.filter(t => t.id !== id);
      await this.saveTransactionsToStorage(filteredTransactions);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  async getTransactionSummary(): Promise<{
    totalIncome: number;
    totalExpense: number;
    balance: number;
  }> {
    try {
      const transactions = await this.getAllTransactionsFromStorage();
      
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const balance = totalIncome - totalExpense;

      return {
        totalIncome,
        totalExpense,
        balance
      };
    } catch (error) {
      console.error('Error getting transaction summary:', error);
      return {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0
      };
    }
  }

  async getMonthlyData(): Promise<{ month: string; income: number; expense: number }[]> {
    try {
      const transactions = await this.getAllTransactionsFromStorage();
      const monthlyData: { [key: string]: { income: number; expense: number } } = {};

      // Group transactions by month
      transactions.forEach(transaction => {
        const month = transaction.date.substring(0, 7); // YYYY-MM format
        
        if (!monthlyData[month]) {
          monthlyData[month] = { income: 0, expense: 0 };
        }

        if (transaction.type === 'income') {
          monthlyData[month].income += transaction.amount;
        } else {
          monthlyData[month].expense += transaction.amount;
        }
      });

      // Convert to array and sort by month (newest first, then reverse for chart)
      const result = Object.entries(monthlyData)
        .map(([month, data]) => ({
          month,
          income: data.income,
          expense: data.expense
        }))
        .sort((a, b) => b.month.localeCompare(a.month))
        .slice(0, 6) // Last 6 months
        .reverse(); // Oldest to newest for chart

      return result;
    } catch (error) {
      console.error('Error getting monthly data:', error);
      return [];
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}

export const webStorageService = new WebStorageService();
