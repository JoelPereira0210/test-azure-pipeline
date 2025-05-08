import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../../theme/themeProvider'; // Corrected useTheme import

// Define the types for the props
interface PaginationComponentProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({ page, totalPages, onPageChange }) => {
  const { theme } = useTheme(); // Access theme from useTheme hook

  return (
    <View style={[styles.paginationContainer, { backgroundColor: theme.colors.background }]}>
      <TouchableOpacity
        style={[styles.pageButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        <Text style={[styles.pageButtonText, { color: theme.colors.text }]}>Previous</Text>
      </TouchableOpacity>
      <Text style={[styles.pageInfo, { color: theme.colors.text, fontSize: 16 }]}>
        Page {page} of {totalPages}
      </Text>
      <TouchableOpacity
        style={[styles.pageButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        <Text style={[styles.pageButtonText, { color: theme.colors.text }]}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    padding: 10,
    borderRadius: 8, // Rounded corners for the pagination container
  },
  pageButton: {
    padding: 8,
    borderRadius: 4,
  },
  pageButtonText: {
    fontSize: 14, // Text size 2
  },
  pageInfo: {
    fontSize: 16, // Text size 3
  },
});

export default PaginationComponent;