import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { formatCurrency } from '@/utils/helpers';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BalanceCardProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, totalIncome, totalExpense }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Main Balance Card */}
      <View style={[styles.balanceCard, { 
        backgroundColor: balance >= 0 ? '#2ECC71' : '#E74C3C',
        shadowColor: colors.text,
      }]}>
        <Text style={styles.balanceLabel}>Saldo Saat Ini</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
      </View>

      {/* Income and Expense Cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
          <View style={styles.summaryHeader}>
            <View style={[styles.indicator, { backgroundColor: '#2ECC71' }]} />
            <Text style={[styles.summaryLabel, { color: colors.text }]}>Pemasukan</Text>
          </View>
          <Text style={[styles.summaryAmount, { color: '#2ECC71' }]}>
            {formatCurrency(totalIncome)}
          </Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
          <View style={styles.summaryHeader}>
            <View style={[styles.indicator, { backgroundColor: '#E74C3C' }]} />
            <Text style={[styles.summaryLabel, { color: colors.text }]}>Pengeluaran</Text>
          </View>
          <Text style={[styles.summaryAmount, { color: '#E74C3C' }]}>
            {formatCurrency(totalExpense)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  balanceCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    opacity: 0.9,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BalanceCard;
