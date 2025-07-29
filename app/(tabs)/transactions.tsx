import FilterModal from '@/components/FilterModal';
import IncomeExpenseSummary from '@/components/IncomeExpenseSummary';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useFinance } from '@/contexts/FinanceContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Transaction } from '@/types/Transaction';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function TransactionsScreen() {
  const { transactions, summary, isLoading, refreshData, deleteTransaction, getFilteredTransactions } = useFinance();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [displayTransactions, setDisplayTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all' as 'all' | 'income' | 'expense',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    setDisplayTransactions(transactions);
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } catch (error) {
      console.error('Error refreshing data:', error);
      Alert.alert('Error', 'Gagal memperbarui data');
    } finally {
      setRefreshing(false);
    }
  }, [refreshData]);

  const handleDeleteTransaction = async (id: number) => {
    Alert.alert(
      'Hapus Transaksi',
      'Apakah Anda yakin ingin menghapus transaksi ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(id);
              Alert.alert('Berhasil', 'Transaksi berhasil dihapus');
            } catch (error) {
              console.error('Error deleting transaction:', error);
              Alert.alert('Error', 'Gagal menghapus transaksi');
            }
          }
        }
      ]
    );
  };

  const applyFilters = async () => {
    try {
      const filteredData = await getFilteredTransactions(
        filters.type === 'all' ? undefined : filters.type,
        filters.startDate || undefined,
        filters.endDate || undefined
      );
      setDisplayTransactions(filteredData);
      setFilterModalVisible(false);
    } catch (error) {
      console.error('Error applying filters:', error);
      Alert.alert('Error', 'Gagal menerapkan filter');
    }
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      startDate: '',
      endDate: ''
    });
    setDisplayTransactions(transactions);
    setFilterModalVisible(false);
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity 
      style={[styles.transactionItem, { backgroundColor: colors.card, borderColor: colors.border }]}
      onLongPress={() => handleDeleteTransaction(item.id)}
    >
      <View style={styles.transactionContent}>
        <View style={styles.transactionHeader}>
          <View style={styles.transactionInfo}>
            <Text style={[styles.transactionDescription, { color: colors.text }]}>
              {item.description || 'Tidak ada keterangan'}
            </Text>
            <Text style={[styles.transactionDate, { color: colors.icon }]}>
              {formatDate(item.date)}
            </Text>
          </View>
          <View style={styles.transactionAmountContainer}>
            <Text style={[
              styles.transactionAmount,
              { color: item.type === 'income' ? '#2ECC71' : '#E74C3C' }
            ]}>
              {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
            </Text>
            <View style={[
              styles.typeIndicator,
              { backgroundColor: item.type === 'income' ? '#2ECC71' : '#E74C3C' }
            ]}>
              <IconSymbol 
                name={item.type === 'income' ? "arrow.down" : "arrow.up"} 
                size={12} 
                color="white" 
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );



  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Memuat transaksi...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}> 
          Daftar Transaksi
        </Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={[styles.filterButton, { backgroundColor: colors.card, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }]} 
            onPress={() => setFilterModalVisible(true)}
          >
            <IconSymbol name="line.horizontal.3.decrease" size={20} color={filterModalVisible ? '#888' : colors.text} />
            <Text style={[styles.filterButtonText, { color: filterModalVisible ? '#888' : colors.text }]}>Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: '#2ECC71', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }]} 
            onPress={() => router.push('/add-transaction' as any)}
          >
            <IconSymbol name="plus" size={20} color="white" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Income Expense Summary */}
      <View style={styles.balanceCardContainer}>
        <IncomeExpenseSummary 
          totalIncome={summary.totalIncome}
          totalExpense={summary.totalExpense}
        />
      </View>

      {/* Transaction List */}
      {displayTransactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <IconSymbol name="tray" size={64} color={colors.icon} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Belum Ada Transaksi
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.icon }]}>
            Tap tombol + untuk menambah transaksi pertama Anda
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayTransactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTransactionItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onApply={applyFilters}
        onClear={clearFilters}
        colors={colors}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  balanceCardContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    minWidth: 80,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  addButton: {
    minWidth: 80,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 6,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  transactionItem: {
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  transactionContent: {
    padding: 16,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  typeIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
