import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useFinance } from '@/contexts/FinanceContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { formatCurrency, formatCurrencyInput, parseCurrencyInput } from '@/utils/helpers';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AddTransactionScreen() {
  const { addTransaction } = useFinance();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const params = useLocalSearchParams();

  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (params.type === 'income' || params.type === 'expense') {
      setType(params.type);
    }
  }, [params.type]);

  const handleAmountChange = (value: string) => {
    const formatted = formatCurrencyInput(value);
    setAmount(formatted);
  };

  const handleSubmit = async () => {
    const numericAmount = parseCurrencyInput(amount);
    
    if (numericAmount <= 0) {
      Alert.alert('Error', 'Nominal transaksi harus lebih dari 0');
      return;
    }

    setIsLoading(true);
    
    try {
      const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      await addTransaction({
        type,
        amount: numericAmount,
        description: description.trim() || '',
        date: currentDate,
      });

      // Reset form
      setAmount('');
      setDescription('');
      
      // Notifikasi berhasil
      Alert.alert(
        'Berhasil',
        `Transaksi ${type === 'income' ? 'pemasukan' : 'pengeluaran'} berhasil ditambahkan!`
      );
      
      // Langsung kembali ke home tanpa delay
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error adding transaction:', error);
      Alert.alert('Error', 'Gagal menambahkan transaksi');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return parseCurrencyInput(amount) > 0;
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Tambah Transaksi
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Transaction Type */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Jenis Transaksi
          </Text>
          <View style={styles.typeButtons}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                {
                  backgroundColor: type === 'income' ? '#2ECC71' : colors.card,
                  borderColor: type === 'income' ? '#2ECC71' : colors.border,
                }
              ]}
              onPress={() => setType('income')}
            >
              <IconSymbol 
                name="arrow.down" 
                size={20} 
                color={type === 'income' ? 'white' : colors.text} 
              />
              <Text style={[
                styles.typeButtonText,
                { color: type === 'income' ? 'white' : colors.text }
              ]}>
                Pemasukan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                {
                  backgroundColor: type === 'expense' ? '#E74C3C' : colors.card,
                  borderColor: type === 'expense' ? '#E74C3C' : colors.border,
                }
              ]}
              onPress={() => setType('expense')}
            >
              <IconSymbol 
                name="arrow.up" 
                size={20} 
                color={type === 'expense' ? 'white' : colors.text} 
              />
              <Text style={[
                styles.typeButtonText,
                { color: type === 'expense' ? 'white' : colors.text }
              ]}>
                Pengeluaran
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Nominal <Text style={styles.required}>*</Text>
          </Text>
          <View style={[styles.amountContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.currencySymbol, { color: colors.text }]}>Rp</Text>
            <TextInput
              style={[styles.amountInput, { color: colors.text }]}
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="0"
              placeholderTextColor={colors.icon}
              keyboardType="numeric"
              textAlign="right"
            />
          </View>
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Keterangan
          </Text>
          <TextInput
            style={[
              styles.descriptionInput,
              { 
                backgroundColor: colors.card, 
                color: colors.text, 
                borderColor: colors.border 
              }
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Masukkan keterangan transaksi (opsional)"
            placeholderTextColor={colors.icon}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Date Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Tanggal Transaksi
          </Text>
          <View style={[styles.dateContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <IconSymbol name="calendar" size={20} color={colors.icon} />
            <Text style={[styles.dateText, { color: colors.text }]}>
              {new Date().toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              backgroundColor: isFormValid() ? colors.tint : colors.icon,
            }
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid() || isLoading}
        >
          <Text style={[
            styles.submitButtonText,
            {
              color: isFormValid() ? '#555555' : 'white',
            }
          ]}>
            {isLoading ? 'Menyimpan...' : 'Simpan Transaksi'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  required: {
    color: '#E74C3C',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
  },
  amountPreview: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'right',
  },
  descriptionInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    height: 100,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  dateText: {
    fontSize: 16,
  },
  submitContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
