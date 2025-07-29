import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { storageService } from '../services/UnifiedStorageService';
import { Transaction, TransactionSummary } from '../types/Transaction';

interface FinanceContextType {
  transactions: Transaction[];
  summary: TransactionSummary;
  isLoading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  refreshData: () => Promise<void>;
  getFilteredTransactions: (
    type?: 'income' | 'expense',
    startDate?: string,
    endDate?: string
  ) => Promise<Transaction[]>;
  getMonthlyData: () => Promise<{ month: string; income: number; expense: number }[]>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

interface FinanceProviderProps {
  children: ReactNode;
}

export const FinanceProvider: React.FC<FinanceProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<TransactionSummary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const initializeDatabase = useCallback(async () => {
    try {
      await storageService.init();
      await refreshData();
    } catch (error) {
      console.error('Error initializing database:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeDatabase();
  }, [initializeDatabase]);

  const refreshData = async () => {
    try {
      const [transactionData, summaryData] = await Promise.all([
        storageService.getAllTransactions(),
        storageService.getTransactionSummary(),
      ]);

      setTransactions(transactionData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    try {
      await storageService.addTransaction(transaction);
      await refreshData();
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }, []);

  const deleteTransaction = useCallback(async (id: number) => {
    try {
      await storageService.deleteTransaction(id);
      await refreshData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }, []);

  const getFilteredTransactions = useCallback(async (
    type?: 'income' | 'expense',
    startDate?: string,
    endDate?: string
  ) => {
    try {
      return await storageService.getFilteredTransactions(type, startDate, endDate);
    } catch (error) {
      console.error('Error getting filtered transactions:', error);
      return [];
    }
  }, []);

  const getMonthlyData = useCallback(async () => {
    try {
      return await storageService.getMonthlyData();
    } catch (error) {
      console.error('Error getting monthly data:', error);
      return [];
    }
  }, []);

  const value: FinanceContextType = useMemo(() => ({
    transactions,
    summary,
    isLoading,
    addTransaction,
    deleteTransaction,
    refreshData,
    getFilteredTransactions,
    getMonthlyData,
  }), [transactions, summary, isLoading, addTransaction, deleteTransaction, getFilteredTransactions, getMonthlyData]);

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};
