
'use client';
import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ButtonInput from '../Button/Button';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SortIcon from '@mui/icons-material/Sort';
import { Box, Typography, Paper, List, ListItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AddCircleOutline } from '@mui/icons-material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
 
interface FilterListTableHeaderProps {
  filterOptions?: any[]; // Replace `any` with the actual type if known
  onFilterSelect?: (option: any) => void; // Adjust type accordingly
  sortOptions?: string[];
  onSortSelect?: (option: string) => void;
  Buttontext?: string;
  onButtonClick?: (option:any) => void;
  onSearchChange?: (term: string) => void;
  onClearFilters?: () => void;
  onClearFilterOption?: () => void;
  onClearFilterSortOption?: () => void;
  onSearchClear?: () => void;
  showSearch?: boolean;
  showButton?: boolean;
  showFilter?: boolean;
  showSort?: boolean;
  buttonIcon?: JSX.Element; // Accept an icon as a prop
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
  buttonIcon  
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openSort, setOpenSort] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
 
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setSearchTerm(event.target.value);
    setFilterApplied(true);
    onSearchChange(value);
  };
 
  const handleFilterSelect = (option) => {
    onFilterSelect(option); // Call the callback with the selected option
    console.log('Selected Filter Option:', option.name);
    console.log('Corresponding Designation ID:', option.id);
    setFilterApplied(true);
    setOpenFilter(false); // Optionally close the filter dropdown after selection
  };
 
  const handleSortName = (sortoption) => {
    onSortSelect(sortoption);
    setFilterApplied(true);
    setOpenSort(false);
    console.log('Selected Filter Option:', sortoption);
  };
 
  const handleSortToggle = () => {
    console.log('cliked sort');
    setOpenSort(!openSort);
    setOpenFilter(false); // Close filter dropdown when sorting is opened
  };
 
  const handleFilterToggle = () => {
    console.log('cliked filetr');
    setOpenFilter(!openFilter);
    setOpenSort(false); // Close sort dropdown when filter is opened
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
 
  const handleClearSearch = () => {
    setSearchTerm('');
    onSearchClear();
    setFilterApplied(false);
  };
 
  const theme = useTheme();
  const mode = theme.palette.mode;
 
  console.log('filteroptons in table header', filterOptions);
 
  return (
    <Box
      sx={{
        display: 'flex',
        marginTop: '2%',
        marginBottom: '1%',
        width: '100%',
        alignItems: 'center',
        justifyContent: {
          xs: 'center',
          sm: 'center',
          md: 'flex-start',
          lg: 'flex-start',
        },
      }}
      className="filter-list-table-header-container"
    >
      <Box sx={{display: 'flex'}}>
      {showSearch && (
        <Box
          className="filter-list-table-header-search-container"
          sx={{
            position: 'relative',
            width: { xs: '44%', sm: '272px' }, // Adjust width for mobile
 
            // marginLeft: { xs: '-22%', sm: '-10%' }, // Adjust for mobile
          }}
        >
          <SearchIcon
            sx={{
              position: 'absolute',
              marginLeft: '2%',
              display:"flex",
              top: '15.25px',
              color: mode === 'light' ? '#16151C' : '#F5F6FA',
            }}
          />
 
          <Box sx={{ width: { xs: '80%', sm: '80%', md: '100%', lg: '100%' } }}>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                padding: '8px 8px 8px 35px',
                backgroundColor: 'transparent',
                borderRadius: '10px',
                border: `1px solid ${
                  mode === 'dark' ? '#F5F6FA33' : '#9C9AA533'
                }`,
                height: '50px',
                width: '100%',
              }}
            />
          </Box>
 
          {searchTerm && ( // Render close icon only when there is text in the search bar
            <CancelOutlinedIcon
              onClick={handleClearSearch}
              sx={{
                position: 'absolute',
                right: '10px',
                top: '15px',
                cursor: 'pointer',
                color: mode === 'light' ? '#D3D3D3' : '#F5F6FA33',
              }}
            />
          )}
 
        </Box>
      )}
      {filterApplied && ( // Conditionally render the "Clear All Filters" text
        <Typography
          onClick={handleAllClearFilters}
          sx={{
            cursor: 'pointer',
            color: mode === 'light' ? '#007FFF' : '#1F64FF',
            marginTop: '10px',
            fontSize: '14px',marginLeft: '16px',
          }}
        >
          Clear All Filters
        </Typography>
      )}
 </Box>
 <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      // gap: '16px', // Adjust spacing as needed
      justifyContent: 'flex-end',
      flexGrow: 1, // Push this box to the right end
    }}
  >

        {showButton && (
          <Box
            sx={{
              width: {
                xs: 'fit-content',
                sm: 'fit-content',
                md: 'fit-content',
                lg: 'fit-content',
              },
            }}
          >
            <ButtonInput
              text={Buttontext}
              type="submit"
              onClick={onButtonClick}
              disabled={false}
              fontSize={14}
              fontWeight={600}
              styles={{
                height: '47px',
                width: '100%',marginLeft:"-14%",
                backgroundColor: '#007FFF',
                '&:hover': { backgroundColor: '#1F64FF' },
              }}
              icon={buttonIcon}
              loading={false}
            />
          </Box>
        )}
 
        {/* Sort filter */}
        {/* show only on mobile view of sort*/}
        {showSort && (
          <Box
            sx={{
              display: { xs: 'flex', sm: 'flex', md: 'flex', lg: 'none' },
              alignItems: 'center',
            }}
          >
            <SwapVertIcon
              sx={{ color: '#16151C', fontWeight: 'bold' }}
              onClick={handleSortToggle} // Toggle sort options
            />
            {openSort && ( // Conditionally render sort options
              <Paper
                elevation={3}
                sx={{
                  position: 'absolute',
                  marginTop: { sm: '100%', xs: '50%' },
                  marginLeft: { sm: '', xs: '-15%' },
                  width: 'auto',
                  backgroundColor: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
                  zIndex: 10,
                }}
              >
                <List style={{ fontWeight: '100' }}>
                  {sortOptions.map((sortItem, index) => (
                    <ListItem
                      button
                      key={index}
                      onClick={() => handleSortName(sortItem)} // Call the sorting function
                    >
                      {sortItem} {/* Display the sort option */}
                    </ListItem>
                  ))}
                  <ListItem button onClick={handleSortFilterClear}>
                    {' '}
                    {/* Clear sort option */}
                    Clear
                  </ListItem>
                </List>
              </Paper>
            )}
          </Box>
        )}
 
        {/* show only on PC view of sort*/}
        {showSort && (
          <Box
            className="filter-table-sort-desktop-view"
            sx={{
              display: { xs: 'none', sm: 'none', md: 'none', lg: 'flex' },
              width: 'fit-content',
              height: '50px',
              alignItems: 'center',
              border: `1px solid ${
                mode === 'dark' ? '#F5F6FA33' : '#9C9AA533'
              }`,
              borderRadius: '10px',
              padding: '8px 10px',
              fontSize: '16px',
              fontWeight: '600',
              marginRight: '10px',
              position: 'relative', // Make this position relative for dropdown
            }}
          >
            <SwapVertIcon
              sx={{
                marginRight: '5px',
                color:
                  mode === 'light'
                    ? 'var(--tw-text-light-mainText)'
                    : 'var(--tw-text-dark-mainText)',
                fontWeight: 'bold',
              }}
              onClick={handleSortToggle}
            />
 
            <span
              style={{
                color:
                  mode === 'light'
                    ? 'var(--tw-text-light-mainText)'
                    : 'var(--tw-text-dark-mainText)',
                textWrap: 'nowrap',
              }}
            >
              Sort by Name
            </span>
 
            {openSort && (
              <Paper
                elevation={3}
                sx={{
                  position: 'absolute',
                  top: '100%', // Positioning just below the button
                  left: '0',
                  width: 'auto',
                  backgroundColor: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
                  zIndex: 10,
                }}
              >
                <List style={{ fontWeight: '100' }}>
                  {sortOptions.map((sortItem, index) => (
                    <ListItem
                      button
                      key={index}
                      onClick={() => handleSortName(sortItem)}
                    >
                      {sortItem}
                    </ListItem>
                  ))}
 
                  <ListItem button onClick={() => handleSortFilterClear()}>
                    Clear
                  </ListItem>
                </List>
              </Paper>
            )}
          </Box>
        )}
 
        {/* Filter Box */}
        {/* Show only on mobile view of filter*/}
        {showFilter && (
          <Box
            sx={{
              display: { xs: 'flex', sm: 'flex', md: 'flex', lg: 'none' },
              alignItems: 'center',
            }}
          >
            <SortIcon
              sx={{
                fontWeight: 'bold',
                color:
                  mode === 'light'
                    ? 'var(--tw-text-light-mainText)'
                    : 'var(--tw-text-dark-mainText)',
              }}
              onClick={handleFilterToggle}
            />
 
            {openFilter && (
              <Paper
                elevation={3}
                sx={{
                  position: 'absolute',
                  marginTop: { sm: '100%', xs: '87%' },
                  marginLeft: { sm: '', xs: '-17%' },
                  width: 'auto',
                  backgroundColor: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
                  zIndex: 10,
                }}
              >
                <List style={{ fontWeight: '100' }}>
                  {filterOptions.map((item, index) => (
                    <ListItem
                      button
                      key={index}
                      onClick={() => handleFilterSelect(item)}
                    >
                      {item.name}
                    </ListItem>
                  ))}
 
                  <ListItem button onClick={() => handleFilterClear()}>
                    Clear
                  </ListItem>
                </List>
              </Paper>
            )}
          </Box>
        )}
        {/* show only on pc view of filter */}
        {showFilter && (
          <Box
            sx={{
              display: { xs: 'none', sm: 'none', md: 'none', lg: 'flex' },
              width: 'fit-content',
              height: '50px',
              alignItems: 'center',
              border: `1px solid ${
                mode === 'dark' ? '#F5F6FA33' : '#9C9AA533'
              }`,
              borderRadius: '10px',
              padding: '8px 10px',
              fontSize: '16px',
              fontWeight: '600',
              marginRight: '10px',
              position: 'relative', // Make this position relative for dropdown
            }}
          >
            <SortIcon
              sx={{
                marginRight: '5px',
                fontWeight: 'bold',
                color:
                  mode === 'light'
                    ? 'var(--tw-text-light-mainText)'
                    : 'var(--tw-text-dark-mainText)',
              }}
              onClick={handleFilterToggle}
            />
 
            <span
              style={{
                color:
                  mode === 'light'
                    ? 'var(--tw-text-light-mainText)'
                    : 'var(--tw-text-dark-mainText)',
              }}
            >
              Filter
            </span>
 
            {openFilter && (
              <Paper
                elevation={3}
                sx={{
                  position: 'absolute',
                  top: '109%', // Position just below the button
                  left: '-30',
                  width: { xs: 'auto', sm: '177px' }, // Fixed width for consistency
                  marginLeft: { xs: '-74%', sx: '-74%' },
                  maxHeight: '280px', // Limit the max height
                  overflowY: 'auto', // Allow vertical scroll if content exceeds height
                  zIndex: 10,
                  backgroundColor: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
                }}
              >
                <List style={{ fontWeight: '100' }}>
                  {filterOptions.map((item, index) => (
                    <ListItem
                      button
                      key={index}
                      onClick={() => handleFilterSelect(item)}
                    >
                      {item.name}
                    </ListItem>
                  ))}
 
                  <ListItem button onClick={() => handleFilterClear()}>
                    Clear
                  </ListItem>
                </List>
              </Paper>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
 
export default FilterListTableHeader;
