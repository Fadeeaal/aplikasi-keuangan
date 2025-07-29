import { IconSymbol } from '@/components/ui/IconSymbol';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: {
    type: 'all' | 'income' | 'expense';
    startDate: string;
    endDate: string;
  };
  onFiltersChange: (filters: any) => void;
  onApply: () => void;
  onClear: () => void;
  colors: any;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filters,
  onFiltersChange,
  onApply,
  onClear,
  colors,
}) => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const getTypeLabel = (type: string) => {
    if (type === 'all') return 'Semua';
    if (type === 'income') return 'Pemasukan';
    return 'Pengeluaran';
  };

  const handleTypeChange = (type: 'all' | 'income' | 'expense') => {
    onFiltersChange({ ...filters, type });
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      onFiltersChange({ ...filters, startDate: dateString });
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      onFiltersChange({ ...filters, endDate: dateString });
    }
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return 'Pilih tanggal';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Filter Transaksi</Text>
            <TouchableOpacity onPress={onClose}>
              <IconSymbol name="xmark" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: colors.text }]}>Jenis Transaksi</Text>
            <View style={styles.filterTypeButtons}>
              {(['all', 'income', 'expense'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterTypeButton,
                    { 
                      backgroundColor: filters.type === type ? colors.tint : colors.card,
                      borderColor: colors.border
                    }
                  ]}
                  onPress={() => handleTypeChange(type)}
                >
                  <Text style={[
                    styles.filterTypeText,
                    { color: filters.type === type ? 'white' : colors.text }
                  ]}>
                    {getTypeLabel(type)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: colors.text }]}>Tanggal Mulai</Text>
            <TouchableOpacity
              style={[styles.dateInput, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={[styles.dateText, { color: filters.startDate ? colors.text : colors.icon }]}>
                {formatDisplayDate(filters.startDate)}
              </Text>
              <IconSymbol name="calendar" size={20} color={colors.icon} />
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={filters.startDate ? new Date(filters.startDate) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleStartDateChange}
              />
            )}
          </View>

          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: colors.text }]}>Tanggal Akhir</Text>
            <TouchableOpacity
              style={[styles.dateInput, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={[styles.dateText, { color: filters.endDate ? colors.text : colors.icon }]}>
                {formatDisplayDate(filters.endDate)}
              </Text>
              <IconSymbol name="calendar" size={20} color={colors.icon} />
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={filters.endDate ? new Date(filters.endDate) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleEndDateChange}
              />
            )}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={onClear}
            >
              <Text style={[styles.modalButtonText, { color: colors.text }]}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.tint }]}
              onPress={onApply}
            >
              <Text style={[styles.modalButtonText, { color: 'white' }]}>Terapkan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterTypeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  filterTypeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    flex: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilterModal;
