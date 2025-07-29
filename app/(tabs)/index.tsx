import MonthlyChart from '@/components/MonthlyChart';
import SaldoCard from '@/components/SaldoCard';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useFinance } from '@/contexts/FinanceContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { summary, isLoading, refreshData, getMonthlyData } = useFinance();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [monthlyData, setMonthlyData] = useState<{ month: string; income: number; expense: number }[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadMonthlyData = useCallback(async () => {
    try {
      const data = await getMonthlyData();
      setMonthlyData(data);
    } catch (error) {
      console.error('Error loading monthly data:', error);
      Alert.alert('Error', 'Gagal memuat data grafik');
    }
  }, [getMonthlyData]);

  useEffect(() => {
    loadMonthlyData();
  }, [loadMonthlyData]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
      await loadMonthlyData();
    } catch (error) {
      console.error('Error refreshing data:', error);
      Alert.alert('Error', 'Gagal memperbarui data');
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Memuat data...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Keuangan Pribadi
          </Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: '#2ECC71', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }]}
            onPress={() => router.push('/add-transaction' as any)}
          >
            <IconSymbol name="plus" size={18} color="white" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Saldo Card */}
        <SaldoCard balance={summary.balance} />

        {/* Monthly Chart */}
        <MonthlyChart data={monthlyData} />

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 6,
  },
  bottomSpacing: {
    height: 100,
  },
});
