import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface MonthlyChartProps {
  data: { month: string; income: number; expense: number }[];
}

const MonthlyChart: React.FC<MonthlyChartProps> = ({ data }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const screenWidth = Dimensions.get('window').width;

  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.text }]}>
          Belum ada data untuk ditampilkan
        </Text>
      </View>
    );
  }

  // Format data untuk LineChart dengan pemasukan dan pengeluaran terpisah
  const chartData = {
    labels: data.map(item => {
      const [, month] = item.month.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 
                         'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      return monthNames[parseInt(month) - 1];
    }),
    datasets: [
      {
        data: data.map(item => Math.max(item.income / 1000, 0.01)), // Pemasukan dalam ribu rupiah
        color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`, // Hijau untuk pemasukan
        strokeWidth: 4,
      },
      {
        data: data.map(item => Math.max(item.expense / 1000, 0.01)), // Pengeluaran dalam ribu rupiah
        color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`, // Merah untuk pengeluaran
        strokeWidth: 4,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: colors.background,
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    decimalPlaces: 0,
    color: (opacity = 1) => colors.text.replace('rgb', 'rgba').replace(')', `, ${opacity})`),
    labelColor: (opacity = 1) => colors.text.replace('rgb', 'rgba').replace(')', `, ${opacity})`),
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "7",
      strokeWidth: "3",
      stroke: colors.background,
      fill: colors.text,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: colors.text + '20',
    },
    propsForLabels: {
      fontSize: 12,
    },
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Grafik Pemasukan dan Pengeluaran
      </Text>
      
      <LineChart
        data={chartData}
        width={screenWidth - 32}
        height={240}
        chartConfig={chartConfig}
        style={styles.chart}
        yAxisSuffix="k"
        fromZero
        withInnerLines={true}
        withOuterLines={true}
        withDots={true}
        withShadow={false}
        segments={4}
      />
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#2ECC71' }]} />
          <Text style={[styles.legendText, { color: colors.text }]}>Pemasukan</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#E74C3C' }]} />
          <Text style={[styles.legendText, { color: colors.text }]}>Pengeluaran</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.6,
  },
});

export default MonthlyChart;
