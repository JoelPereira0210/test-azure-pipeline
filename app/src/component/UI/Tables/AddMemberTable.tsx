import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { useTheme } from '../../../../theme/themeProvider';

interface Props {
  jsonData: any[];
  setEditForm: React.Dispatch<any>;
  setSelectedEntries: React.Dispatch<React.SetStateAction<any[]>>;
  setShowTable: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddMemberTable = (props: Props) => {
  const { theme, mode } = useTheme();
  const [clickedRowId, setClickedRowId] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const rows = props.jsonData.map((item) => ({
    id: item.id,
    name: `${item.firstName} ${item.lastName}`,
    mobileNumber: item.mobileNumber,
    error: item.error,
  }));

  const handleSelectionChange = (rowId: number) => {
    setSelectedRows((prev) => {
      const updatedSelection = prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId];

      props.setSelectedEntries(updatedSelection);
      return updatedSelection;
    });
  };


  const handleRowPress = (rowData: any) => {
    setClickedRowId((prevId) => (prevId === rowData.id ? null : rowData.id));
    props.setEditForm(rowData);
    props.setShowTable(false);
  };

  
  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.row, item.id === clickedRowId ? styles.clickedRow : null, item.error ? styles.errorRow : null]}>
      <View style={styles.checkboxContainer}>
        <Checkbox
        uncheckedColor={theme.colors.main}
        color={theme.colors.main}
          status={selectedRows.includes(item.id) ? 'checked' : 'unchecked'}
          onPress={() => handleSelectionChange(item.id)}
        />
      </View>
      <TouchableOpacity onPress={() => handleRowPress(item)} style={styles.textContainer}>
        <Text style={[styles.nameText,{color:item.id === clickedRowId?'black':theme.colors.mainText}]}>{item.name}</Text>
        <Text style={styles.mobileText}>{item.mobileNumber}</Text>
        {item.error && <Text style={styles.errorText}>{item.error}</Text>}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[{ flexGrow: 1,backgroundColor:theme.colors.background}]}>
    <FlatList
      data={rows}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={[styles.listContainer,{backgroundColor:theme.colors.background}]}
      ListEmptyComponent={<Text style={styles.emptyMessage}>No members added yet</Text>}
      nestedScrollEnabled={true}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    // maxHeight: 200,  // Increase height limit
    minHeight: 80,   // Ensure list box is always visible
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    // overflow: 'hidden',  // Prevent unwanted scrolling inside FlatList
  },
  

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderRadius: 8,
    marginBottom: 5,
  },
  clickedRow: {
    backgroundColor: '#E3F2FD', // Light blue for selected row
  },
  errorRow: {
    backgroundColor: '#f8d7da',
  },
  checkboxContainer: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  mobileText: {
    color: 'gray',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  emptyMessage: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 14,
    paddingVertical: 20,
  },
});

export default AddMemberTable;
