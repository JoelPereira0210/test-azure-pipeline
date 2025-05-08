import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Surface } from "react-native-paper";
import { useTheme } from "../../../../theme/themeProvider";

interface FilterListTableProps {
  tableData: Array<Record<string, any>>;
  columnNameArray: { field: string; headerName: string }[];
  toDisplayFooter: boolean;
  totalRecords?: number;
  currentPage?: number;
}

const FilterListTable: React.FC<FilterListTableProps> = ({
  tableData,
  columnNameArray,
  toDisplayFooter,
  totalRecords = tableData.length,
  currentPage = 1,
}) => {
  const pageSize = 10;
  const [paginationModel, setPaginationModel] = useState(0);

  const {theme} = useTheme();

  const handlePageChange = (newPage: number) => {
    console.log("Page changed to:", newPage);
    setPaginationModel(newPage - 1);
  };

  // Debugging
  // console.log("Table Data:", JSON.stringify(tableData, null, 2));
  
  const displayedRows = tableData.length > 0 ? tableData.slice(0, 10) : [];
  console.log("got data in filterlisttable",tableData);

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={true} >
        <Surface style={[styles.container,{backgroundColor:theme.colors.background,borderColor:"#F5F6FA33"}]}>
          <ScrollView>
            {/* Table Header */}
            <View style={[styles.headerRow,{backgroundColor:theme.colors.background,borderColor:'gray'}]}>
              {columnNameArray.map((column) => (
                <View key={column.field} style={[styles.headerCell]}>
                  <Text style={[styles.headerText,{color:theme.colors.mainText}]}>{column.headerName}</Text>
                </View>
              ))}
            </View>

            {/* Table Body */}
            {displayedRows.length > 0 ? (
              displayedRows.map((row, rowIndex) => (
              <View key={rowIndex} style={[styles.row,{backgroundColor:theme.colors.background, borderColor:'gray'}]}>
                {columnNameArray.map((column) => (
                <View key={column.field} style={[styles.cell, { backgroundColor: theme.colors.background,borderColor:'gray' }]}>
                  {/* Check if value is a React element */}
                  {React.isValidElement(row[column.field]) ? (
                  row[column.field]  // Render the JSX directly
                  ) : (
                  <Text style={[styles.cellText, { color: theme.colors.mainText }]}>
                    {/* {String(row[column.field] || "[MISSING DATA]")} */}
                    {String(row[column.field])}
                  </Text>
                  )}
                </View>
                ))}
              </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No Data Available</Text>
            )}
          </ScrollView>
        </Surface>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
  },
  debugText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    marginBottom: 10,
  },
  container: {
    margin:10,
    borderWidth: 1,
    minWidth: 600,
    minHeight: 400,
    borderRadius: 8,
    elevation: 5,
    padding: 5,
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 0.3,
    paddingVertical: 8,

  },
  headerText: {
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 0.3,
    paddingVertical: 8,
    alignItems: "center", 
    minHeight: 50, 
  },
  
  cell: {
    minWidth: 190,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    flex: 1, 
    alignSelf: "center", 
  },
  

  headerCell: {
    minWidth: 190,
    padding: 8,
    justifyContent: "center",
    alignItems: "center", 
  },
  
  cellText: {
    fontSize: 14,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    padding: 20,
  },
});

export default FilterListTable;
