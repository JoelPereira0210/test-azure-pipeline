import React from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import DisplayDesignation from './modals/DisplayDesignation';
import FilterListTable from './UI/Tables/FilterListTable';
import FilterListTableHeader from './UI/TableHeader/FilterListTableHeader';
import { useTheme } from '../../theme/themeProvider';

interface CommitteParentProps {
  selectedDesignation: string;
  onDesignationSelect: any;
  onDesignationMembersFetched: (members: any) => void;
  transformedUserDetails: any[];
  columnNameArray: { field: string; headerName: string }[];
  onSortSelect: (sort: string) => void;
  onClearFilters: () => void;
  onSearchChange: (searchTerm: string) => void;
  onClearFilterSortOption: () => void;
  onSearchClear: () => void;
}

const CommitteParent = ({
  selectedDesignation,
  onDesignationSelect,
  onDesignationMembersFetched,
  transformedUserDetails,
  columnNameArray,
  onSortSelect,
  onClearFilters,
  onSearchChange,
  onClearFilterSortOption,
  onSearchClear,
}: CommitteParentProps) => {
  const filterOptions = ['asd', 'dfg', 'hgt', 'hdhe'];
  const sortOptions = ['A-Z', 'Z-A'];
  const hasData = transformedUserDetails.length > 0;
  const {theme} = useTheme();

  return (
    <View style={[styles.container,{backgroundColor:theme.colors.background}]}>
      {/* Header Section */}
      <View style={styles.header}>
        <FilterListTableHeader
          showSearch={true}
          showFilter={false}
          showSort={hasData}
          onSortSelect={onSortSelect}
          filterOptions={filterOptions}
          sortOptions={sortOptions}
          onSearchChange={onSearchChange}
          onClearFilters={onClearFilters}
          onSearchClear={onSearchClear}
          onClearFilterSortOption={onClearFilterSortOption}
        />
      </View>

      {/* Main Content Section */}
      <View style={[styles.mainContent,{backgroundColor:theme.colors.background}]}>
        {/* Display Designation Component */}
        <DisplayDesignation
          selectedDesignation={selectedDesignation}
          onDesignationSelect={onDesignationSelect}
          onDesignationMembersFetched={onDesignationMembersFetched}
        />

        {/* Filter List Table or No Data Image */}
        {hasData ? (
            <View style={styles.tableContainer}>
            <ScrollView>
              <FilterListTable
              toDisplayFooter={false}
              tableData={transformedUserDetails}
              columnNameArray={columnNameArray}
              />
            </ScrollView>
            </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No results found.</Text>
            <Image
              source={require('../images/Frame.png')}
              style={styles.noDataImage}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    // marginTop: '3%',
    // marginTop: 120,
    width: '100%',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    // padding: '2%',
  },
  mainContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    marginTop: '2%',
    marginBottom: '2%',
  },
  tableContainer: {
    width: '100%',
    alignItems: 'center',
    padding: '2%',
    maxHeight: 220,
  },
  noDataContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: '2%',
  },
  noDataText: {
    color: 'gray',
    marginTop: 16,
  },
  noDataImage: {
    width: '80%',
    height: 100,
    marginBottom:10,
    marginTop: 10,
  },
});

export default CommitteParent;
