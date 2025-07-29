import { Platform } from 'react-native';
import { Transaction } from '../types/Transaction';

// Interface untuk SQLite database (untuk type safety)
interface SQLiteDatabase {
  execAsync(sql: string): Promise<void>;
  runAsync(sql: string, params?: any[]): Promise<{ lastInsertRowId: number }>;
  getAllAsync(sql: string, params?: any[]): Promise<any[]>;
  getFirstAsync(sql: string, params?: any[]): Promise<any>;
}

class DatabaseService {
  private db: SQLiteDatabase | null = null;
  private SQLite: any = null;

  async init() {
    // Hanya inisialisasi SQLite untuk platform native
    if (Platform.OS === 'web') {
      throw new Error('SQLite is not supported on web platform. Use WebStorageService instead.');
    }

    try {
      // Dynamic import untuk expo-sqlite hanya di platform native
      this.SQLite = await import('expo-sqlite');
      this.db = await this.SQLite.openDatabaseAsync('finance.db');
      await this.createTables();
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  private async createTables() {
    if (!this.db) return;

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
        amount REAL NOT NULL CHECK (amount > 0),
        description TEXT,
        date TEXT NOT NULL,
        createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      await this.db.execAsync(createTableQuery);
    } catch (error) {
      console.error('Error creating tables:', error);
    }
  }

  async addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const query = `
      INSERT INTO transactions (type, amount, description, date)
      VALUES (?, ?, ?, ?)
    `;

    try {
      const result = await this.db.runAsync(query, [
        transaction.type,
        transaction.amount,
        transaction.description || '',
        transaction.date
      ]);
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  async getAllTransactions(): Promise<Transaction[]> {
    if (!this.db) throw new Error('Database not initialized');

    const query = `
      SELECT * FROM transactions 
      ORDER BY date DESC, createdAt DESC
    `;

    try {
      const result = await this.db.getAllAsync(query);
      return result as Transaction[];
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
    if (!this.db) throw new Error('Database not initialized');

    let query = 'SELECT * FROM transactions WHERE 1=1';
    const params: any[] = [];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY date DESC, createdAt DESC';

    try {
      const result = await this.db.getAllAsync(query, params);
      return result as Transaction[];
    } catch (error) {
      console.error('Error getting filtered transactions:', error);
      return [];
    }
  }

  async deleteTransaction(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const query = 'DELETE FROM transactions WHERE id = ?';

    try {
      await this.db.runAsync(query, [id]);
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
    if (!this.db) throw new Error('Database not initialized');

    const query = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as totalIncome,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as totalExpense
      FROM transactions
    `;

    try {
      const result = await this.db.getFirstAsync(query) as any;
      const totalIncome = result?.totalIncome || 0;
      const totalExpense = result?.totalExpense || 0;
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
    if (!this.db) throw new Error('Database not initialized');

    const query = `
      SELECT 
        strftime('%Y-%m', date) as month,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense
      FROM transactions
      GROUP BY strftime('%Y-%m', date)
      ORDER BY month DESC
      LIMIT 6
    `;

    try {
      const result = await this.db.getAllAsync(query) as any[];
      return result.reverse(); // Show oldest to newest for chart
    } catch (error) {
      console.error('Error getting monthly data:', error);
      return [];
    }
  }
}

export const databaseService = new DatabaseService();
