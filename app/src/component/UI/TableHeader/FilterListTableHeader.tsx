import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Menu, Divider, IconButton } from 'react-native-paper';
import Search from 'react-native-vector-icons/MaterialIcons';
import SwapVert from 'react-native-vector-icons/MaterialCommunityIcons';
import Sort from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../../theme/themeProvider'; // Ensure correct path

interface FilterListTableHeaderProps {
  filterOptions?: any[];
  onFilterSelect?: (option: any) => void;
  sortOptions?: string[];
  onSortSelect?: (option: string) => void;
  Buttontext?: string;
  onButtonClick?: (option: any) => void;
  onSearchChange?: (term: string) => void;
  onClearFilters?: () => void;
  onClearFilterOption?: () => void;
  onClearFilterSortOption?: () => void;
  onSearchClear?: () => void;
  showSearch?: boolean;
  showButton?: boolean;
  showFilter?: boolean;
  showSort?: boolean;
  buttonIcon?: JSX.Element;
}

const FilterListTableHeader: React.FC<FilterListTableHeaderProps> = ({
  filterOptions = [],
  onFilterSelect = () => {},
  sortOptions = [],
  onSortSelect = () => {},
  Buttontext,
  onButtonClick = () => {},
  onSearchChange = () => {},
  onClearFilters = () => {},
  onClearFilterOption = () => {},
  onClearFilterSortOption = () => {},
  onSearchClear = () => {},
  showSearch,
  showButton,
  showFilter,
  showSort,
  buttonIcon,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openSort, setOpenSort] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);

  const { theme, mode } = useTheme();

  // console.log("got sort items",filterOptions);
  // Handle text input changes
  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
    setFilterApplied(true);
    onSearchChange(text);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onSearchClear();
    setFilterApplied(false);
  };

  const handleFilterSelect = (option: any) => {
    onFilterSelect(option);
    setFilterApplied(true);
    setOpenFilter(false);
  };

  const handleSortSelect = (option: string) => {
    onSortSelect(option);
    setFilterApplied(true);
    setOpenSort(false);
  };

  const handleSortToggle = () => {
    // console.warn("handleSortToggle");
    setOpenSort(!openSort);
    setOpenFilter(false);
  };

  const handleFilterToggle = () => {
    setOpenFilter(!openFilter);
    setOpenSort(false);
  };

  const handleAllClearFilters = () => {
    onClearFilters();
    setSearchTerm('');
    setFilterApplied(false);
  };

  const handleFilterClear = () => {
    onClearFilterOption();
    setFilterApplied(false);
  };

  const handleSortFilterClear = () => {
    onClearFilterSortOption();
    setFilterApplied(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top row: Search bar (left), Clear All Filters, Sort & Filter icons (right) */}
      <View style={styles.topRow}>
        {/* Left side: Search bar + "Clear All Filters" */}
        <View style={styles.leftRow}>
          {showSearch && (
            <View style={styles.searchBox}>
              <Search
              name="search"
              style={styles.searchIcon}
              size={22}
              color={mode === 'light' ? '#16151C' : '#F5F6FA'}
              />
              <TextInput
              value={searchTerm}
              onChangeText={handleSearchChange}
              placeholder="Search"
              placeholderTextColor={mode === 'light' ? '#16151C' : '#F5F6FA'}
              style={[
                styles.searchInput,
                { borderColor: mode === 'light' ? '#9C9AA533' : '#F5F6FA33', color: theme.colors.mainText },
              ]}
              />
              {searchTerm ? (
              <IconButton
                icon="cancel"
                onPress={handleClearSearch}
                style={styles.clearSearchIcon}
                iconColor={theme.colors.mainText}
              />
              ) : null}
            </View>
          )}
          {filterApplied && (
            <TouchableOpacity onPress={handleAllClearFilters}> 
              <Text style={styles.clearFilterText}>clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Right side: Sort & Filter Icons */}
        <View style={styles.rightRow}>
        

{showSort && (
  <View style={styles.iconWrapper}>
    <Menu
      visible={openSort}
      onDismiss={handleSortToggle}
      anchor={
        <TouchableOpacity onPress={handleSortToggle}>
          <SwapVert name="swap-vertical" size={24} color={theme.colors.mainText} />
        </TouchableOpacity>
      }
      contentStyle={{ backgroundColor: theme.colors.background }} 
    >
      {sortOptions.map((sortItem, index) => (
        <Menu.Item
          key={index}
          onPress={() => handleSortSelect(sortItem)}
          title={sortItem}
          style={[{ backgroundColor: theme.colors.background }]}
          titleStyle={{ color: theme.colors.mainText }}
        />
      ))}
  
    </Menu>
  </View>
)}



{showFilter && (
  <View style={styles.iconWrapper}>
    <Menu
      visible={openFilter}
      onDismiss={handleFilterToggle}
      anchor={
        <TouchableOpacity onPress={handleFilterToggle}>
          <Sort name="sort" size={24} color={theme.colors.mainText} />
        </TouchableOpacity>
      }
      contentStyle={{ backgroundColor: theme.colors.background }} 

    >
      {filterOptions.map((item, index) => (
        <Menu.Item
          key={index}
          onPress={() => handleFilterSelect(item)}
          title={item.name}
          style={[{ backgroundColor: theme.colors.background }]}
          titleStyle={{ color: theme.colors.mainText }}
        />
      ))}
      {/* <Divider /> */}
      {/* <Menu.Item onPress={handleFilterClear} title="Clear" /> */}
    </Menu>
  </View>
)}


        </View>
      </View>

      {/* Second row: Add button (if showButton is true) */}
      {showButton && (
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={onButtonClick} style={styles.button}>
            {buttonIcon}
            <Text style={styles.buttonText}>{Buttontext}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 5,
    width: '100%',
    padding: 10,
    borderRadius: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBox: {
    position: 'relative',
    width: '85%',
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    top: 15,
  },
  searchInput: {
    paddingLeft: 35,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    borderRadius: 10,
    height: 50,
    width: '100%',
    borderWidth: 1,
  },
  clearSearchIcon: {
    position: 'absolute',
    right: 10,
    top: 0,
  },
  clearFilterText: {
    color: '#007FFF',
    fontSize: 14,
    marginLeft: 2,
    marginRight:0,
  },
  iconWrapper: {
    marginLeft:2,
    marginRight: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonRow: {
    marginTop: 10,
    alignItems:'flex-start',
    flexDirection:'row'
  },
  button: {
    height: 47,
    backgroundColor: '#007FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignSelf: 'flex-start', // or 'center' if you want to center it
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
});

export default FilterListTableHeader;
