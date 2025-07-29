export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface FilterOptions {
  type?: 'income' | 'expense' | 'all';
  startDate?: string;
  endDate?: string;
}
