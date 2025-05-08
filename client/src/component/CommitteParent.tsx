
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import DisplayDesignation from './modals/DisplayDesignation';
import FilterListTable from './UI/Tables/FilterListTable';
import FilterListTableHeader from './UI/TableHeader/FilterListTableHeader';

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
}) => {
  const filterOptions = ['asd', 'dfg', 'hgt', 'hdhe'];
  const sortOptions = ['A-Z', 'Z-A'];
  console.log('on sort in CommitteParent', onSortSelect);
  console.log("transformDetails", transformedUserDetails)

  const hasData = transformedUserDetails.length > 0;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      sx={{
        gap: '1%',
        // border: '1px solid #A2A1A833',  padding: '16px', 
        // borderRadius: '10px',
        marginTop: '3%',
      }}
    >
      {/* Header Section */}
      <Box
        sx={{

          width: '100%',
          textAlign: 'center',
          padding: '2%'
        }}
      >
        <FilterListTableHeader
          showSearch={true}
          showFilter={false}
          // showSort={true}
          showSort={transformedUserDetails.length > 0}
          onSortSelect={onSortSelect}
          filterOptions={filterOptions}
          sortOptions={sortOptions}
          onSearchChange={onSearchChange}
          onClearFilters={onClearFilters}
          onSearchClear={onSearchClear}

          onClearFilterSortOption={onClearFilterSortOption}

        />
      </Box>
      {/* Main Content Section */}
      <Box
        display="flex"
        justifyContent="flex-start"
        alignItems="flex-start"
        sx={{
          gap: '1%',
          width: '100%',
          flexDirection: {
            xs: 'column',
            sm: 'column',
            md: 'row',
            lg: 'row',
            xl: 'row',
          },
          marginTop: "2%", marginBottom: "2%"
        }}
      >
        {/* Display Designation Component */}
        <DisplayDesignation
          selectedDesignation={selectedDesignation}
          onDesignationSelect={onDesignationSelect}
          onDesignationMembersFetched={onDesignationMembersFetched}
        />

        {/* Filter List Table or Image */}
        {/*      {hasData ? (
          <Box sx={{ width: '100%', textAlign: 'center', padding: '2%' }}>
            <FilterListTable
              toDisplayFooter={false}
              tableData={transformedUserDetails}
              columnNameArray={columnNameArray}
            />
          </Box>
        ) : (
          <Box
            component="img"
            src="/images/Frame.png"
            alt="Description of image"
            sx={{ maxWidth: '50%', height: 'auto' }}
          />
        )} */}
        {hasData ? (
          <Box sx={{ width: '100%', textAlign: 'center', padding: '2%' }}>
            <FilterListTable
              toDisplayFooter={false}
              tableData={transformedUserDetails}
              columnNameArray={columnNameArray}
            />
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{
              width: '100%',
              textAlign: 'center',
              padding: '2%',
            }}
          >
            <Typography variant="h6" color="textSecondary">
              No results found.
            </Typography>
            <Box
              component="img"
              src="/images/Frame.png"
              alt="No results found"
              sx={{ maxWidth: '50%', height: 'auto', marginTop: '1rem' }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CommitteParent;

