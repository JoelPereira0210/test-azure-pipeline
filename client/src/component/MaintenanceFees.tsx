import React, { use, useContext, useEffect, useState } from 'react';
import { MemberContext } from '@/src/component/context/MemberContext';
import FilterListTable from './UI/Tables/FilterListTable';
import { fetchMaintenanceDetails } from '../actions/addMembers';
import { Box, Typography } from '@mui/material';
import PaginationFooter from './UI/TableFooter/TableFooter';

const MaintenanceFees = () => {
  const { contextUserId } = useContext(MemberContext);

  const [maintenanceData, setMaintenanceData] = useState<any>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; // Records per page

  const columnNameArray = [
    { field: 'memberName', headerName: 'Event Name' },
    { field: 'amount', headerName: 'Amount' },
    { field: 'dueDate', headerName: 'Due Date' },
    { field: 'status', headerName: 'Status' },
  ];


      const fetchData = async (page = 0) => {
        try {
    
          const limit = pageSize; // Define the limit
          const offset = page * limit; // Calculate offset

          const response = await fetchMaintenanceDetails(contextUserId,limit, offset);
          console.log('res main', response);
          setMaintenanceData(response); // Assuming response.data contains the necessary data
          if (response.status === 200) {
            console.log('resp.data', response.data);

            // setMaintenanceData(response.data); // Assuming response.data contains the necessary data
          } else if (response.status === 203) {
            console.log('No maintenance details found');
            // setMaintenanceData([]);
          }
        } catch (error) {
          console.error('Error fetching maintenance details:', error);
        }
      };

  // Trigger data fetch when user ID or page changes
  useEffect(() => {
    if (contextUserId) {
      fetchData(currentPage);
    }
  }, [contextUserId, currentPage]);

  

  const tableData = Array.isArray(maintenanceData)
    ? maintenanceData.map((item: any) => ({
        memberName: item.eventName,
        amount: item.amount,
        dueDate: item.eventRegistrationDate,
        status: item.status,
      }))
    : [];

  console.log('Table Data:', tableData);
  console.log('Column Name Array:', columnNameArray);

  return (
    <Box>
      {tableData.length > 0 ? (
        <Box> 
        <FilterListTable
          tableData={tableData}
          columnNameArray={columnNameArray}
          toDisplayFooter={false}
        />
          <PaginationFooter
          currentPage={currentPage}
          totalRecords={maintenanceData[0].totalRecords}
          pageSize={pageSize}
          onPageChange={(newPage) => setCurrentPage(newPage)} // Update page state on change
        />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',

            justifyContent: 'center',

            alignItems: 'center',

            height: '50vh',
          }}
        >
          <img
            src="/images/Frame.png"
            alt="Description of image"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
         
        </Box>
      )}
    </Box>
  );
};

export default MaintenanceFees;
