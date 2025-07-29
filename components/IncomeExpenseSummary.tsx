import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconSymbol } from './ui/IconSymbol';

interface IncomeExpenseSummaryProps {
  totalIncome: number;
  totalExpense: number;
}

export default function IncomeExpenseSummary({ totalIncome, totalExpense }: IncomeExpenseSummaryProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {/* Income Section */}
      <View style={styles.section}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: '#2ECC71' }]}>
            <IconSymbol name="arrow.down" size={20} color="white" />
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: colors.icon }]}>Total Pemasukan</Text>
          <Text style={[styles.amount, { color: '#2ECC71' }]}>
            {formatCurrency(totalIncome)}
          </Text>
        </View>
      </View>

      {/* Separator */}
      <View style={[styles.separator, { backgroundColor: colors.border }]} />

      {/* Expense Section */}
      <View style={styles.section}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: '#E74C3C' }]}>
            <IconSymbol name="arrow.up" size={20} color="white" />
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: colors.icon }]}>Total Pengeluaran</Text>
          <Text style={[styles.amount, { color: '#E74C3C' }]}>
            {formatCurrency(totalExpense)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    marginRight: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    marginVertical: 16,
  },
});
